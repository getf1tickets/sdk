import autoLoad from 'fastify-autoload';
import path from 'path';
import { FastifyInstance } from 'fastify';
import { Sequelize } from 'sequelize';
import { Authentication } from '@/plugins/authentification';
import { AMQP, AuthEntity } from '@/interfaces';
import { Middlewares } from '@/plugins/middlewares';
import { User } from '@/models/user';
import { Product } from '@/models/product';
import { Order } from '@/models/order';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize;
    authentication: Authentication;
    middlewares: Middlewares;
    amqp: AMQP;
    to500: <T>(promise: Promise<T>) => Promise<T>
  }

  interface FastifyRequest {
    user?: User;
    authEntity?: AuthEntity;
    product?: Product;
    order?: Order;
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
