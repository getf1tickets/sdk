import fp from 'fastify-plugin';
import { Sequelize, Options } from 'sequelize';
import { registerModels } from '@/models';

export interface SequelizePluginOptions {
  instanceName?: string;
  url?: string;
  sequelizeOptions?: Options;
}

export default fp<SequelizePluginOptions>(async (fastify, opts) => {
  fastify.log.info({ name: 'sequelize' }, 'Initialize Sequelize ...');

  const sequelizeOptions: Options = {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    ...opts.sequelizeOptions,
  };

  fastify.log.debug({ name: 'sequelize' }, 'Creating Sequelize instance');

  const sequelize = new Sequelize(
    opts.url || process.env.DATABASE_URL || 'postgresql://localhost',
    sequelizeOptions,
  );

  fastify.decorate(opts.instanceName || 'sequelize', sequelize);
  fastify.addHook(
    'onClose',
    (_, done) => sequelize.close().then(() => done()),
  );

  fastify.log.debug({ name: 'sequelize' }, 'Registering Sequelize models');
  await registerModels(fastify, sequelize);

  fastify.log.info({ name: 'sequelize' }, 'Sequelize is ready!');
}, { name: 'sdk-sequelize' });
