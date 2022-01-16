import fp from 'fastify-plugin';
import amqp from 'amqplib';
import { v4 } from 'uuid';

export interface AMQP {
  channel: amqp.Channel;
  publish: (destination: string, type: string, data?: object) => Promise<void>;
  createQueue: (routingKey: string, handler: QueueHandler) => Promise<void>;
}

export type QueueHandler = (type: string, data: object) => Promise<any>;

export default fp(async (fastify) => {
  const connect = await amqp.connect(process.env.CLOUDAMQP_URL);
  const channel = await connect.createChannel();
  const createdQueue = [];

  const computeRoutingHeader = (destination: string) => {
    const keys = ['f1tickets', ...destination.split('.')];
    const header = {};
    header[`routing-level-${keys.length}`] = destination;
    return header;
  };

  const computeMatchHeader = (routingKey: string) => {
    const keys = ['f1tickets', ...routingKey.split('.')];
    const headers = {
      'x-match': 'any',
    };

    let sb = '';
    keys.forEach((key, index) => {
      sb += key;
      headers[`routing-level-${index + 1}`] = `${sb}`;
      sb += '.';
    });

    return headers;
  };

  const publish = async (destination: string, type: string, data?: object) => {
    await channel.assertExchange(process.env.AMQP_EXCHANGE_NAME, 'headers');

    const routingHeader = computeRoutingHeader(destination);

    channel.publish(
      process.env.AMQP_EXCHANGE_NAME,
      '',
      Buffer.from(JSON.stringify({ type, data })),
      {
        headers: {
          ...routingHeader,
        },
      },
    );
  };

  const createQueue = async (routingKey: string, handler: QueueHandler) => {
    await channel.assertExchange(process.env.AMQP_EXCHANGE_NAME, 'headers');

    const queueChannel = await connect.createChannel();
    const queueName = v4();
    createdQueue.push(queueName);

    queueChannel.assertQueue(queueName, { autoDelete: true });
    queueChannel.bindQueue(
      queueName,
      process.env.AMQP_EXCHANGE_NAME,
      '',
      computeMatchHeader(routingKey),
    );

    queueChannel.consume(queueName, async (message) => {
      const { type, data } = JSON.parse(message.content.toString());

      const ack = () => {
        queueChannel.ack(message); return true;
      };

      const nack = () => {
        setTimeout(() => queueChannel.nack(message), 45000);
        return true;
      };

      if (!type) {
        return ack();
      }

      try {
        await handler(type, data);
      } catch (err) {
        fastify.log.error(err);
        return nack();
      }

      return ack();
    });
  };

  fastify.addHook('onClose', async () => {
    for (const qn of createdQueue) {
      // eslint-disable-next-line no-await-in-loop
      await channel.deleteQueue(qn);
    }
    await connect.close();
  });

  fastify.decorate('amqp', {
    channel,
    publish,
    createQueue,
  });
}, { name: 'sdk-amqp' });
