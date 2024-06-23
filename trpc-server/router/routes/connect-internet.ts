import { jsonRpcProxy, loggedProcedure } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const connectInternet = loggedProcedure
  .input(z.object({ token: z.string() }))
  .query(async ({ input }) => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'Connect',
      id: '3.2'
    };
    return await jsonRpcProxy(body, input.token);
  });
