import { ServerOptions } from '@trpc-server/types';

export const serverConfig: ServerOptions = {
  dev: false,
  port: 2022,
  prefix: '/trpc',
};
