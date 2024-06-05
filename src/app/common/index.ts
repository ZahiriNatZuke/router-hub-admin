export const NETWORKS_TYPES: string[] = [ 'NO_SERVICE', '2G', '2G', '3G', '3G', '3G', '3G+', '3G+', '4G', '4G+' ];

export interface UssdCode {
  value: string;
  name: string;
  bonus?: string;
  price?: number;
}

export const USSD_CODES: UssdCode[] = [
  {
    value: '*222#',
    name: 'Check Balance'
  },
  {
    value: '*222*266#',
    name: 'Check Bonus'
  },
  {
    value: '*133*5*1#',
    name: 'Combined Plan - Little',
    bonus: '600 MB + 800 MB',
    price: 110
  },
  {
    value: '*133*5*2#',
    name: 'Combined Plan - Middle',
    bonus: '1.5 GB + 2 GB',
    price: 250
  },
  {
    value: '*133*5*3#',
    name: 'Combined Plan - Big',
    bonus: '3.5 GB + 4.5 GB',
    price: 500
  },
  {
    value: '*133*1*4*1#',
    name: 'Plan LTE - Little',
    bonus: '1GB',
    price: 100
  },
  {
    value: '*133*1*4*2#',
    name: 'Plan LTE - Middle',
    bonus: '2.5GB',
    price: 200
  },
  {
    value: '*133*1*4*3#',
    name: 'Plan LTE - Big',
    bonus: '4 GB + 12 GB',
    price: 950
  },
];

export const RequestVerificationToken = '_tclrequestverificationtoken';
