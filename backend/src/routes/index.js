import emailRoutes from './emails.js';

export default async function routes(fastify, options) {
  // Add CORS support for frontend
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  });

  // Handle preflight requests
  fastify.options('*', async (request, reply) => {
    reply.send();
  });

  // Health check endpoint
  fastify.get('/ping', async (request, reply) => {
    return { success: true, message: 'pong' };
  });

  // Register email routes
  fastify.register(emailRoutes, { prefix: '/api' });
}
