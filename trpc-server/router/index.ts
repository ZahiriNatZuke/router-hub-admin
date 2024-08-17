import { router } from '@trpc-server/common/trpc';
import {
  connectInternet,
  connectionState,
  currentProfile,
  deviceAccess,
  disconnectInternet,
  heartBeat,
  login,
  networkInfo,
  networkSettings,
  simStatus,
  sms,
  systemStatus,
  ussd,
  wlan
} from '@trpc-server/router/routes';

export const appRouter = router({
  connectInternet,
  connectionState,
  currentProfile,
  disconnectInternet,
  heartBeat,
  login,
  networkInfo,
  networkSettings,
  simStatus,
  sms,
  systemStatus,
  ussd,
  deviceAccess,
  wlan
});

export type AppRouterType = typeof appRouter;
