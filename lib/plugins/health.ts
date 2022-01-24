import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    handler: async () => ({ status: 'OK' }),
  });
}, { name: 'sdk-health' });
