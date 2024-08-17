import { jsonRpcProxy, publicProcedure } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const changePassword = publicProcedure
  .input(z.object({
    token: z.string(),
    login: z.object({
      UserName: z.string(),
      CurrPassword: z.string(),
      NewPassword: z.string()
    })
  }))
  .query(async ({ input }) => {
    const body: JSONRPCRequest = {
      id: '12',
      jsonrpc: '2.0',
      method: 'ChangePassword',
      params: input.login
    };
    return await jsonRpcProxy(body, input.token);
  });
