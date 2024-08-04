import { jsonRpcProxy, publicProcedure } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const currentProfile = publicProcedure
  .input(z.object({ token: z.string() }))
  .query(async ({ input }) => {
    const body: JSONRPCRequest = {
      id: '12',
      jsonrpc: '2.0',
      method: 'getCurrentProfile',
      params: {}
    };
    return await jsonRpcProxy(body, input.token);
  });
