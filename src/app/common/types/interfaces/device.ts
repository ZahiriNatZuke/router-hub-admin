export interface Device {
  id: number;
  DeviceName: string,
  MacAddress: string,
  IPAddress?: string,
  AssociationTime?: number,
  DeviceType?: number,
  ConnectMode?: number,
  InternetRight?: number,
  StorageRight?: number
}