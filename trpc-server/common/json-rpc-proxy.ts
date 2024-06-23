import { JSONRPCClient, JSONRPCRequest } from 'json-rpc-2.0';
import { JSONRPCResponse } from 'json-rpc-2.0/dist/models';
import http from 'node:http';
import fetch from 'node-fetch';

export const jsonRpcProxy = (body: JSONRPCRequest, token?: string): PromiseLike<JSONRPCResponse> => {
  const headers: any = {
    'Content-Type': 'application/json, text/plain, */*',
    '_tclrequestverificationkey': 'KSDHSDFOGQ5WERYTUIQWERTYUISDFG1HJZXCVCXBN2GDSMNDHKVKFsVBNf',
    'Referer': 'http://192.168.1.1/index.html',
    'Connection': 'keep-alive'
  };
  if ( token ) {
    headers[ '_tclrequestverificationtoken' ] = token;
  }
  const RPCClient = new JSONRPCClient((payload) => {
    fetch('http://192.168.1.1/jrd/webapi', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      insecureHTTPParser: true,
      redirect: 'follow',
      agent: new http.Agent({ keepAlive: true })
    })
      .then((response: any) => {
        if ( response.status === 200 ) {
          return response
            .json()
            .then((jsonRPCResponse: JSONRPCResponse) => {
              RPCClient.receive(jsonRPCResponse);
              return jsonRPCResponse;
            });
        } else if ( payload.id !== undefined ) {
          return Promise.reject(new Error(response.statusText));
        }
      });
  });

  return RPCClient.requestAdvanced(body);
};
