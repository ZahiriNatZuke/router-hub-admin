export interface SimStatus {
  SIMState: number,
  PinState: number,
  PinRemainingTimes: number,
  PukRemainingTimes: number,
  SIMLockState: number,
  SIMLockRemainingTimes: number,
  PLMN: `${ number }`,
  SPN: string,
  cell_lock: number
}
