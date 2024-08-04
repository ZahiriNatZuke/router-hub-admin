import { jsonRpcProxy, publicProcedure } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const networkInfo = publicProcedure
  .query(async () => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'GetNetworkInfo',
      id: '12',
      params: {}
    };
    return await jsonRpcProxy(body);
  });
