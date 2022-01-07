import fp from 'fastify-plugin';
import cors, { FastifyCorsOptions } from 'fastify-cors';

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: ['Authorization'],
    preflight: true,
    credentials: false,
  });
});
