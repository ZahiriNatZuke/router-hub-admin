import { jsonRpcProxy, loggedProcedure } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const networkInfo = loggedProcedure
  .query(async () => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'GetNetworkInfo',
      id: '12',
      params: {}
    };
    return await jsonRpcProxy(body);
  });
