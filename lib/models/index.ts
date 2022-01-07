import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize';

import { User } from '@/models/user';

export * from '@/models/user';
export const models = {
  User,
};

export const registerModels = async (fastify: FastifyInstance, sequelize: Sequelize) => {
  Object.keys(models).forEach((key: any) => {
    const model = models[key];

    model.fn(sequelize);
    fastify.log.debug({ name: 'sequelize' }, 'Registering model: %s', model.name);

    models[model.name] = model;
    if (model.associate) {
      fastify.log.debug({ name: 'sequelize' }, 'Execute associate method for model: %s', model.name);
      model.associate(models);
    }
  });
};

export default models;
