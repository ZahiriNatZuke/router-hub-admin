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

  setNetwork(networkMode: NetworkMode) {
    return this.getConnectionState()
      .pipe(
        switchMap((res: JSONRPCResponse) => {
          if ( res.result.ConnectionStatus === 2 ) { // if it is connected
            return this.disconnectInternet()
              .pipe(
                switchMap(() => this.setNetworkSettings(networkMode))
              );
          }
          return this.setNetworkSettings(networkMode);
        })
      );

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

  getSmsContentList(Page: number, ContactId: number) {
    return defer(() => this.#trpcProxyClient.sms.contentList.query({ token: this.#token(), Page, ContactId }));
  }

  deleteSms(SMSId: number, ContactId: number) {
    return defer(() => this.#trpcProxyClient.sms.delete.query({ token: this.#token(), SMSId, ContactId }));
  }

  getSmsResult() {
    return defer(() => this.#trpcProxyClient.sms.result.query({ token: this.#token() }));
  }

  getSendSms(SMSContent: string, PhoneNumber: string) {
    return defer(() => this.#trpcProxyClient.sms.send.query({ token: this.#token(), SMSContent, PhoneNumber }));
  }

  sendSms(content: string, phoneNumber: string) {
    return this.getSendSms(content, phoneNumber)
      .pipe(
        delay(5000),
        switchMap(() => this.getSmsResult())
      );
  }

}
