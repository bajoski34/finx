import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import { environment } from './environments/environment';

async function bootstrap() {
  const app: FastifyInstance = fastify({
    logger: true
  });

  // Health check endpoint
  app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ 
      status: 'ok', 
      service: 'finx-api-gateway',
      version: '0.1.0',
      environment: environment.production ? 'production' : 'development'
    });
  });

  // Payment endpoints placeholder
  app.register(async function (fastify) {
    fastify.post('/api/v1/payment-intents', async (request, reply) => {
      reply.send({ message: 'Payment intents endpoint - TODO' });
    });

    fastify.post('/api/v1/payouts', async (request, reply) => {
      reply.send({ message: 'Payouts endpoint - TODO' });
    });

    fastify.post('/api/v1/virtual-accounts', async (request, reply) => {
      reply.send({ message: 'Virtual accounts endpoint - TODO' });
    });
  });

  try {
    const port = environment.port || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API Gateway running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();