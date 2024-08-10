import { JSONRPCClient, JSONRPCRequest } from 'json-rpc-2.0';
import { JSONRPCResponse } from 'json-rpc-2.0/dist/models';
import http from 'node:http';
import fetch from 'node-fetch';
import { envs } from '@trpc-server/config';

export const jsonRpcProxy = (body: JSONRPCRequest, token?: string): PromiseLike<JSONRPCResponse> => {
  const headers: any = {
    'Content-Type': 'application/json, text/plain, */*',
    [ envs.REQUEST_VERIFICATION_KEY_HEADER ]: envs.REQUEST_VERIFICATION_KEY,
    'Referer': envs.WEB_REFER,
    'Connection': 'keep-alive'
  };
  if ( token ) {
    headers[ envs.REQUEST_VERIFICATION_TOKEN_HEADER ] = token;
  }
  const RPCClient = new JSONRPCClient((payload) => {
    fetch(envs.WEB_API, {
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
      })
      .catch((err) => {
        console.log(`[FetchError]: request to ${ envs.WEB_API } failed, reason: ${ err.erroredSysCall } ${ err.code }`);
      });
  });

  return RPCClient.requestAdvanced(body);
};
