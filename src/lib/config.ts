import { networks } from '@btc-vision/bitcoin';

export const OPNET_NETWORK = networks.opnetTestnet;
export const OPNET_RPC_URL = 'https://testnet.opnet.org';

export const CONTRACT_ADDRESSES = {
  hashFlip: 'opt1sqpal8jec9kvkjy8lqxkfsxnvuwlgk6dgegg9dhvd',
  hashSpin: 'opt1sqq9g4pklgsjnvv055542zxry24ttfnk3e5xye38s',
  hashPot: 'opt1sqrx4lx9rsp3gxfkx8vc2wtusfmdtfzhl9qrl4t5u',
} as const;
