import { jsonRpcProxy, publicProcedure, router } from '@trpc-server/common';
import { JSONRPCRequest } from 'json-rpc-2.0';
import { z } from 'zod';

export const deviceAccess = router({
  getConnectedList: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetConnectedDeviceList',
        id: '12',
        params: {}
      };
      return await jsonRpcProxy(body, input.token);
    }),
  getBlockedList: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'GetBlockDeviceList',
        id: '12',
        params: {}
      };
      return await jsonRpcProxy(body, input.token);
    }),
  internetRight: publicProcedure
    .input(z.object({
      token: z.string(),
      device: z.object({
        DeviceName: z.string(),
        InternetRight: z.number(),
        MacAddress: z.string(),
        StorageRight: z.number()
      })
    }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetConnectedDeviceRight',
        id: '12',
        params: input.device
      };
      return await jsonRpcProxy(body, input.token);
    }),
  setDeviceName: publicProcedure
    .input(z.object({
      token: z.string(),
      device: z.object({
        DeviceName: z.string(),
        MacAddress: z.string()
      })
    }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetDeviceName',
        id: '12',
        params: input.device
      };
      return await jsonRpcProxy(body, input.token);
    }),
  setConnectedDeviceBlock: publicProcedure
    .input(z.object({
      token: z.string(),
      device: z.object({
        DeviceName: z.string(),
        MacAddress: z.string()
      })
    }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetConnectedDeviceBlock',
        id: '12',
        params: input.device
      };
      return await jsonRpcProxy(body, input.token);
    }),
  setDeviceUnblock: publicProcedure
    .input(z.object({
      token: z.string(),
      device: z.object({
        DeviceName: z.string(),
        MacAddress: z.string()
      })
    }))
    .query(async ({ input }) => {
      const body: JSONRPCRequest = {
        jsonrpc: '2.0',
        method: 'SetDeviceUnblock',
        id: '12',
        params: input.device
      };
      return await jsonRpcProxy(body, input.token);
    })
});
