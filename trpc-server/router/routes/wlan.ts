import { jsonRpcProxy, publicProcedure, router } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const wlan = router({
  getWlanSettings: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        id: '12',
        jsonrpc: '2.0',
        method: 'GetWlanSettings',
        params: {}
      };
      return await jsonRpcProxy(body, input.token);
    }),
  setWlanSettings: publicProcedure
    .input(z.object({ token: z.string(), params: z.any() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        id: '12',
        jsonrpc: '2.0',
        method: 'SetWlanSettings',
        params: input.params
      };
      return await jsonRpcProxy(body, input.token);
    })
});
