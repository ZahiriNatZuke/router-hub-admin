import { jsonRpcProxy, publicProcedure, router } from '@trpc-server/common';
import { z } from 'zod';
import { JSONRPCRequest } from 'json-rpc-2.0';

export const sms = router({
  list: publicProcedure
    .input(z.object({ token: z.string(), Page: z.number() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetSMSListByContactNum',
        params: {
          Page: input.Page,
          key: 'inbox'
        },
        id: '12'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  storageState: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        id: '12',
        jsonrpc: '2.0',
        method: 'GetSMSStorageState',
        params: {}
      };
      return await jsonRpcProxy(body, input.token);
    }),
  contentList: publicProcedure
    .input(z.object({ token: z.string(), Page: z.number(), ContactId: z.number() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetSMSContentList',
        params: {
          Page: input.Page,
          ContactId: input.ContactId
        },
        id: '6.3'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  delete: publicProcedure
    .input(z.object({ token: z.string(), SMSId: z.number(), ContactId: z.number() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'DeleteSMS',
        params: {
          DelFlag: 2,
          ContactId: input.ContactId,
          SMSId: input.SMSId
        },
        id: '6.5'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  result: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetSendSMSResult',
        id: '6.7'
      };
      return await jsonRpcProxy(body, input.token);
    }),
  send: publicProcedure
    .input(z.object({ token: z.string(), SMSContent: z.string(), PhoneNumber: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SendSMS',
        params: {
          SMSId: -1,
          SMSContent: input.SMSContent,
          PhoneNumber: [ input.PhoneNumber ],
          SMSTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        },
        id: '6.6'
      };
      return await jsonRpcProxy(body, input.token);
    }),

});
