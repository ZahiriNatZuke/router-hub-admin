import { jsonRpcProxy, publicProcedure } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const systemStatus = publicProcedure
  .query(async () => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'GetSystemStatus',
      id: '13.4'
    };
    return await jsonRpcProxy(body);
  });
