import { createServer } from '@trpc-server/server';
import { envs } from '@trpc-server/config';

const trpcServer = createServer(envs);

trpcServer.start()
  .then(() => console.log('tRPC + Fastify ready to work 🚀'))
  .catch(() => trpcServer.stop());
