import { jsonRpcProxy, loggedProcedure } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';
import { z } from 'zod';

export const login = loggedProcedure
  .input(z.object({ UserName: z.string(), Password: z.string() }))
  .query(async ({ input }) => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'Login',
      params: {
        UserName: input.UserName,
        Password: input.Password
      },
      id: '1.1'
    };
    return await jsonRpcProxy(body);
  });
