import { FastifyInstance } from 'fastify';
import autoLoad from 'fastify-autoload';
import path from 'path';
import Models from '@/models';

export * from '@/interfaces';
export * from '@/models';
export * from '@/utils';

export const registerPlugins = async (fastify: FastifyInstance) => {
  fastify.register(autoLoad, {
    dir: path.join(__dirname, 'plugins'),
  });
};

export default {
  Models,
};
