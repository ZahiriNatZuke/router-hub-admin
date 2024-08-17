export interface WlanSettings {
  WiFiOffTime: number,
  AP2G: {
    CountryCode: string,
    ApStatus: number,
    WMode: number,
    Ssid: string,
    SsidHidden: number,
    Channel: number,
    SecurityMode: number,
    WepType: number,
    WpaType: number,
    WepKey: string,
    WpaKey: string,
    ApIsolation: number,
    max_numsta: number,
    curr_num: number,
    CurChannel: number,
    Bandwidth: number
  }
}
