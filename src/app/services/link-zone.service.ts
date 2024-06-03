import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, switchMap, tap } from 'rxjs';
import { JSONRPCResponse } from 'json-rpc-2.0/dist/models';
import { RequestVerificationToken } from '@rha/common';

@Injectable({ providedIn: 'root' })
export class LinkZoneService {

  #http = inject(HttpClient);
  #token = signal<string>('');
  readonly #proxyURL = 'http://localhost:3000/proxy';

  get LinkZoneUrl() {
    return this.#proxyURL;
  }

  get isLoggin() {
    return !!this.#token();
  }

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

  #linkZoneRequest(payload: any): Observable<JSONRPCResponse> {
    return this.#http.post<JSONRPCResponse>(
      this.#token() ? `${ this.LinkZoneUrl }?token=${ this.#token() }` : this.LinkZoneUrl,
      payload);
  }

  connectInternet() {
    const data = {
      jsonrpc: '2.0',
      method: 'Connect',
      id: '3.2'
    };

    return this.#linkZoneRequest(data);
  }

  disconnectInternet() {
    const data = {
      jsonrpc: '2.0',
      method: 'DisConnect',
      id: '3.2'
    };

    return this.#linkZoneRequest(data);
  }

  heartBeat() {
    const data = {
      id: '12',
      jsonrpc: '2.0',
      method: 'HeartBeat',
      params: {}
    };

    return this.#linkZoneRequest(data);
  }

  login(pwd: string): Observable<JSONRPCResponse> {
    const data = {
      jsonrpc: '2.0',
      method: 'Login',
      params: {
        UserName: this.#encrypt('admin'),
        Password: this.#encrypt(pwd)
      },
      id: '1.1'
    };

    return this.#linkZoneRequest(data)
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
    const data = {
      jsonrpc: '2.0',
      method: 'GetSystemStatus',
      id: '13.4'
    };

    return this.#linkZoneRequest(data);
  }

  getSimStatus() {
    const data = {
      id: '12',
      jsonrpc: '2.0',
      method: 'GetSimStatus',
      params: {}
    };

    return this.#linkZoneRequest(data);
  }

  getNetworkInfo() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetNetworkInfo',
      id: '12',
      params: {}
    };

    return this.#linkZoneRequest(data);
  }

  getNetworkSettings() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetNetworkSettings',
      id: '12'
    };

    return this.#linkZoneRequest(data);
  }

  getCurrentProfile() {
    const data = {
      id: '12',
      jsonrpc: '2.0',
      method: 'getCurrentProfile',
      params: {}
    };

    return this.#linkZoneRequest(data);
  }

  setNetworkSettings(networkMode: number) {
    const data = {
      jsonrpc: '2.0',
      method: 'SetNetworkSettings',
      params: {
        NetworkMode: networkMode,
        NetselectionMode: 0
      },
      id: '4.7'
    };

    return this.#linkZoneRequest(data);
  }

  getConnectionState() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetConnectionState',
      id: '3.1'
    };

    return this.#linkZoneRequest(data);
  }

  setNetwork(networkMode: number) {
    return this.getConnectionState()
      .pipe(
        switchMap((res: any) => {
          if ( res.ConnectionStatus === 2 ) { // if it is connected
            return this.disconnectInternet().pipe(
              switchMap(() => this.setNetworkSettings(networkMode))
            );
          }
          return this.setNetworkSettings(networkMode);
        })
      );

  }

  sendUssd(ussdCode: string, ussdType: number = 1) {
    const data = {
      jsonrpc: '2.0',
      method: 'SendUSSD',
      params: {
        UssdContent: ussdCode,
        UssdType: ussdType
      },
      id: '8.1'
    };

    return this.#linkZoneRequest(data);
  }

  setUssdEnd() {
    const data = {
      jsonrpc: '2.0',
      method: 'SetUSSDEnd',
      id: '8.3'
    };

    return this.#linkZoneRequest(data);
  }

  getUSSDSendResult() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetUSSDSendResult',
      id: '8.2'
    };

    return this.#linkZoneRequest(data);
  }

  sendUssdCode(ussdCode: string, ussdType: number = 1) {
    return this.sendUssd(ussdCode, ussdType)
      .pipe(
        delay(5000),
        switchMap(() => this.getUSSDSendResult())
      );

  }

  getSmsList(page: number = 1) {
    const data = {
      jsonrpc: '2.0',
      method: 'GetSMSListByContactNum',
      params: {
        Page: page,
        key: 'inbox'
      },
      id: '12'
    };

    return this.#linkZoneRequest(data);
  }

  getSmsContentList(page: number, contactId: number) {
    const data = {
      jsonrpc: '2.0',
      method: 'GetSMSContentList',
      params: {
        Page: page,
        ContactId: contactId
      },
      id: '6.3'
    };

    return this.#linkZoneRequest(data);
  }

  deleteSms(smsId: number, contactId: number) {
    const data = {
      jsonrpc: '2.0',
      method: 'DeleteSMS',
      params: {
        DelFlag: 2,
        ContactId: contactId,
        SMSId: smsId
      },
      id: '6.5'
    };

    return this.#linkZoneRequest(data);
  }

  getSmsStorageState() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetSMSStorageState',
      id: '6.4'
    };

    return this.#linkZoneRequest(data);
  }

  getSmsResult() {
    const data = {
      jsonrpc: '2.0',
      method: 'GetSendSMSResult',
      id: '6.7'
    };

    return this.#linkZoneRequest(data);
  }

  getSendSms(content: string, phoneNumber: string) {
    let dateNow = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const data = {
      jsonrpc: '2.0',
      method: 'SendSMS',
      params: {
        SMSId: -1,
        SMSContent: content,
        PhoneNumber: [ phoneNumber ],
        SMSTime: dateNow
      },
      id: '6.6'
    };

    return this.#linkZoneRequest(data);
  }

  sendSms(content: string, phoneNumber: string) {
    return this.getSendSms(content, phoneNumber)
      .pipe(
        delay(5000),
        switchMap(() => this.getSmsResult())
      );
  }

}
