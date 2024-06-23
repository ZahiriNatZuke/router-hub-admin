import { jsonRpcProxy, loggedProcedure, router } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const ussd = router({
  send: loggedProcedure
    .input(z.object({ token: z.string(), UssdContent: z.string(), UssdType: z.number() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SendUSSD',
        params: {
          UssdContent: input.UssdContent,
          UssdType: input.UssdType
        },
        id: '8.1'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  end: loggedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetUSSDEnd',
        id: '8.3'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  result: loggedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetUSSDSendResult',
        id: '8.2'
      };
      return await jsonRpcProxy(body, input.token);
    })
});
