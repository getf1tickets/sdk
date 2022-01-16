import fp from 'fastify-plugin';
import { to } from 'await-to-js';

export default fp(async (fastify) => {
  async function to500<T>(promise: Promise<T>): Promise<T> {
    const [err, result] = await to<T>(promise);

    if (err) {
      fastify.log.error(err);
      throw fastify.httpErrors.internalServerError();
    }

    return result;
  }

  fastify.decorate('to500', to500);
}, { name: 'sdk-utils' });
