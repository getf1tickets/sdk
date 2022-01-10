import autoLoad from 'fastify-autoload';
import path from 'path';
import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize';
import Models, { User } from '@/models';
import { Authentication } from '@/plugins/authentification';
import { AuthEntity } from '@/interfaces';
import { Middlewares } from '@/plugins/middlewares';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize;
    authentication: Authentication;
    middlewares: Middlewares;
  }

  interface FastifyRequest {
    user?: User;
    authEntity?: AuthEntity;
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
