import { FastifyInstance } from 'fastify';
import { Model, Sequelize } from 'sequelize';

import { User } from '@/models/user';

export const models = {
  User,
};

export const registerExtraModels = async (
  m: Model[],
  fastify: FastifyInstance,
  sequelize: Sequelize,
) => {
  for (const model of (m as any)) {
    fastify.log.debug({ name: 'sequelize' }, 'Registering model: %s', model.name);
    model.fn(sequelize);
  }

  for (const model of (m as any)) {
    if (model.associate) {
      fastify.log.debug({ name: 'sequelize' }, 'Execute associate method for model: %s', model.name);
      model.associate();
    }
  }
};

export const registerModels = async (
  fastify: FastifyInstance,
  sequelize: Sequelize,
) => registerExtraModels(Object.keys(models).map((key) => models[key]), fastify, sequelize);

export * from '@/models/user';
export default models;
