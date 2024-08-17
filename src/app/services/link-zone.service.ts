import { computed, Injectable, signal } from '@angular/core';
import { defer, delay, Observable, switchMap, tap } from 'rxjs';
import { JSONRPCResponse } from 'json-rpc-2.0/dist/models';
import { RequestVerificationToken } from '@rha/common';
import { Device, NetworkMode } from '@rha/common/types';
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from '@trpc/client';
import type { AppRouterType } from '@trpc-server/router';
import superjson from 'superjson';
import { environment } from '@rha/env';

@Injectable({ providedIn: 'root' })
export class LinkZoneService {

  #token = signal<string>('');
  #wsClient = createWSClient({ url: environment.wsClient });
  #trpcProxyClient = createTRPCProxyClient<AppRouterType>({
    transformer: superjson,
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({ client: this.#wsClient }),
        false: httpBatchLink({ url: environment.httpBatchLink }),
      })
    ],
  });

  isLoggedIn = computed(() => this.#token().trim().length > 0);

  set token(token: string) {
    this.#token.set(token);
  }

  #encrypt(value: string) {
    const KEY = 'e5dl12XYVggihggafXWf0f2YSf2Xngd1';
    let encoded = [];
    for ( let index = 0; index < value.length; index++ ) {
      let valueCode = value.charCodeAt(index);
      let keyCode = KEY.charCodeAt(index % KEY.length);
      encoded.push(String.fromCharCode(( 240 & keyCode ) | ( ( 15 & valueCode ) ^ ( 15 & keyCode ) )));
      encoded.push(String.fromCharCode(( 240 & keyCode ) | ( ( valueCode >> 4 ) ^ ( 15 & keyCode ) )));
    }
    return encoded.join('');
  }

  connectInternet() {
    return defer(() => this.#trpcProxyClient.connectInternet.query({ token: this.#token() }));
  }

  disconnectInternet() {
    return defer(() => this.#trpcProxyClient.disconnectInternet.query({ token: this.#token() }));
  }

  heartBeat() {
    return defer(() => this.#trpcProxyClient.heartBeat.query({ token: this.#token() }));
  }

  login(pwd: string): Observable<JSONRPCResponse> {
    const UserName = this.#encrypt('admin');
    const Password = this.#encrypt(pwd);
    return defer(() => this.#trpcProxyClient.login.query({ UserName, Password }))
      .pipe(
        tap((res) => {
          this.token = this.#encrypt(`${ res.result.token }`);
          sessionStorage.setItem(RequestVerificationToken, this.#token());
        })
      );
  }

  logout() {
    this.token = '';
    sessionStorage.removeItem(RequestVerificationToken);
  }

  getSystemStatus() {
    return defer(() => this.#trpcProxyClient.systemStatus.query());
  }

  getSimStatus() {
    return defer(() => this.#trpcProxyClient.simStatus.query({ token: this.#token() }));
  }

  getNetworkInfo() {
    return defer(() => this.#trpcProxyClient.networkInfo.query());
  }

  getNetworkSettings() {
    return defer(() => this.#trpcProxyClient.networkSettings.get.query({ token: this.#token() }));
  }

  setNetworkSettings(NetworkMode: NetworkMode) {
    return defer(() => this.#trpcProxyClient.networkSettings.set.query({ token: this.#token(), NetworkMode }));
  }

  getCurrentProfile() {
    return defer(() => this.#trpcProxyClient.currentProfile.query({ token: this.#token() }));
  }

  getConnectionState() {
    return defer(() => this.#trpcProxyClient.connectionState.query({ token: this.#token() }));
  }

  sendUssd(ussdCode: string, UssdType: number = 1) {
    return defer(() => this.#trpcProxyClient.ussd.send.query({
      token: this.#token(),
      UssdType,
      UssdContent: ussdCode
    }));
  }

  setUssdEnd() {
    return defer(() => this.#trpcProxyClient.ussd.end.query({ token: this.#token() }));
  }

  getUSSDSendResult() {
    return defer(() => this.#trpcProxyClient.ussd.result.query({ token: this.#token() }));
  }

  sendUssdCode(ussdCode: string, ussdType: number = 1) {
    return this.sendUssd(ussdCode, ussdType);
  }

  getSmsList(Page: number = 1) {
    return defer(() => this.#trpcProxyClient.sms.list.query({ token: this.#token(), Page }));
  }

  getSMSStorageState() {
    return defer(() => this.#trpcProxyClient.sms.storageState.query({ token: this.#token() }));
  }

  deleteSms(SMSId: number, ContactId: number) {
    return defer(() => this.#trpcProxyClient.sms.delete.query({ token: this.#token(), SMSId, ContactId }));
  }

  getSmsResult() {
    return defer(() => this.#trpcProxyClient.sms.result.query({ token: this.#token() }));
  }

  sendSms(SMSContent: string, PhoneNumber: string) {
    return defer(() => this.#trpcProxyClient.sms.send.query({ token: this.#token(), SMSContent, PhoneNumber }))
      .pipe(
        delay(5000),
        switchMap(() => this.getSmsResult())
      );
  }

  getConnectedDeviceList() {
    return defer(() => this.#trpcProxyClient.deviceAccess.getConnectedList.query({ token: this.#token() }));
  }

  getBlockedDeviceList() {
    return defer(() => this.#trpcProxyClient.deviceAccess.getBlockedList.query({ token: this.#token() }));
  }

  setInternetRight(device: Device) {
    return defer(() => this.#trpcProxyClient.deviceAccess.internetRight.query({
      token: this.#token(),
      device: {
        DeviceName: device.DeviceName,
        MacAddress: device.MacAddress,
        StorageRight: device?.StorageRight ?? 1,
        InternetRight: device?.InternetRight ?? 1
      }
    }));
  }

  setDeviceName(device: Device) {
    return defer(() => this.#trpcProxyClient.deviceAccess.setDeviceName.query({
      token: this.#token(),
      device: {
        DeviceName: device.DeviceName,
        MacAddress: device.MacAddress
      }
    }));
  }

  setConnectedDeviceBlock(device: Device) {
    return defer(() => this.#trpcProxyClient.deviceAccess.setConnectedDeviceBlock.query({
      token: this.#token(),
      device: {
        DeviceName: device.DeviceName,
        MacAddress: device.MacAddress
      }
    }));
  }

  setDeviceUnblock(device: Device) {
    return defer(() => this.#trpcProxyClient.deviceAccess.setDeviceUnblock.query({
      token: this.#token(),
      device: {
        DeviceName: device.DeviceName,
        MacAddress: device.MacAddress
      }
    }));
  }

  getWlanSettings() {
    return defer(() => this.#trpcProxyClient.wlan.getWlanSettings.query({ token: this.#token() }));
  }

  setWlanSettings(params: any) {
    return defer(() => this.#trpcProxyClient.wlan.setWlanSettings.query({ token: this.#token(), params }));
  }

}
