export interface SMSData {
  SMSList: SMSContact[];
  Page: number;
  TotalPageCount: number;
}

export interface SMSContact {
  PhoneNumber: string[];
  SMSType: number;
  SMSContent: string;
  SMSId: number;
  SMSTime: string;
  SMSTimezone: number;
}
