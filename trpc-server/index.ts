import { createServer } from '@trpc-server/server';
import { serverConfig } from '@trpc-server/config';

const trpcServer = createServer(serverConfig);

trpcServer.start()
  .then(() => console.log('tRPC + Fastify ready to work 🚀'))
  .catch(() => trpcServer.stop());
