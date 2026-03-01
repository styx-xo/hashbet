import { networks } from '@btc-vision/bitcoin';

export const OPNET_NETWORK = networks.opnetTestnet;
export const OPNET_RPC_URL = 'https://testnet.opnet.org';

// Contracts are deployed but settlement is blocked by missing runtime method
// (Blockchain.getBlockHash not implemented on OPNet testnet yet).
// Using local mode with OPNet testnet block data until runtime supports it.
// Deployed addresses (for reference):
//   HashFlip: opt1sqpal8jec9kvkjy8lqxkfsxnvuwlgk6dgegg9dhvd
//   HashSpin: opt1sqq9g4pklgsjnvv055542zxry24ttfnk3e5xye38s
//   HashPot:  opt1sqrx4lx9rsp3gxfkx8vc2wtusfmdtfzhl9qrl4t5u
export const CONTRACT_ADDRESSES = {
  hashFlip: '',
  hashSpin: '',
  hashPot: '',
} as const;
