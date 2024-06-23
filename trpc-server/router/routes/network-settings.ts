import { jsonRpcProxy, loggedProcedure, router } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';
import { z } from 'zod';

export const networkSettings = router({
  get: loggedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetNetworkSettings',
        id: '12'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  set: loggedProcedure
    .input(z.object({ token: z.string(), NetworkMode: z.number() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetNetworkSettings',
        params: {
          NetworkMode: input.NetworkMode,
          NetselectionMode: 0
        },
        id: '4.7'
      };
      return await jsonRpcProxy(body, input.token);
    })
});
