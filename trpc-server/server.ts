import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from '@trpc-server/router';
import { ServerOptions } from '@trpc-server/types';

export function createServer({ PORT, PREFIX, ENVIRONMENT }: ServerOptions) {
  const isDev = ENVIRONMENT === 'DEVELOPMENT';
  const server = fastify({ logger: isDev });

  server.register(cors);
  server.register(ws);
  server.register(fastifyTRPCPlugin, {
    prefix: PREFIX,
    useWSS: true,
    trpcOptions: { router: appRouter }
  });

  if ( isDev ) {
    server.get('/panel', (_: FastifyRequest, res: FastifyReply) => {
      import('trpc-panel').then((lib) => {
        return res
          .headers({ 'Content-Type': 'text/html' })
          .send(lib.renderTrpcPanel(appRouter, { url: `http://localhost:${ PORT }${ PREFIX }` }));
      });
    });
  }

  return {
    server,
    start: async () => {
      try {
        await server.listen({ port: PORT });
        console.log('listening at port:', PORT, '🌐');
      } catch ( err ) {
        server.log.error(err);
        process.exit(1);
      }
    },
    stop: async () => {
      await server.close();
    }
  };
}
