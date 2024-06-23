import { jsonRpcProxy, loggedProcedure } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const systemStatus = loggedProcedure
  .query(async () => {
    const body: JSONRPCRequest = {
      jsonrpc: '2.0',
      method: 'GetSystemStatus',
      id: '13.4'
    };
    return await jsonRpcProxy(body);
  });
