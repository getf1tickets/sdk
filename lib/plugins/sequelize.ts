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
    pool: {
      max: (process.env.NODE_ENV === 'production') ? 50 : 2,
      min: (process.env.NODE_ENV === 'production') ? 20 : 2,
      idle: 5000,
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
  await sequelize.sync();

  fastify.log.info({ name: 'sequelize' }, 'Sequelize is ready!');
}, { name: 'sdk-sequelize' });
