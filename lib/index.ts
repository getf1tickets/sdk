import autoLoad from 'fastify-autoload';
import path from 'path';
import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize';
import Models, { User } from '@/models';
import { Authentication } from '@/plugins/authentification';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize,
    authentication: Authentication,
  }

  interface FastifyRequest {
    user?: User,
  }
}

export const registerPlugins = async (fastify: FastifyInstance) => {
  fastify.register(autoLoad, {
    dir: path.join(__dirname, 'plugins'),
  });
};

export * from '@/interfaces';
export * from '@/models';
export * from '@/utils';

export default {
  Models,
};
