import fastify from 'fastify';
import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from '@trpc-server/router';
import { ServerOptions } from '@trpc-server/types';

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? '/trpc';
  const server = fastify({ logger: dev });

  server.register(cors);
  server.register(ws);
  server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter },
  });

  return {
    server,
    start: async () => {
      try {
        await server.listen({ port });
        console.log('listening at port:', port, '🌐');
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
