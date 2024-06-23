import { router } from '@trpc-server/common/trpc';
import {
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
  ussd
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
  ussd
});

export type AppRouterType = typeof appRouter;
