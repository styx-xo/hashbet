import { UnisatSigner } from '@btc-vision/transaction';

export interface WalletState {
  connected: boolean;
  address: string | null;
  signer: UnisatSigner | null;
}

export const INITIAL_WALLET_STATE: WalletState = {
  connected: false,
  address: null,
  signer: null,
};

export function isUnisatAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window as unknown as Record<string, unknown>).unisat;
}

export async function connectWallet(): Promise<WalletState> {
  if (!isUnisatAvailable()) {
    throw new Error('Unisat wallet not detected. Please install the Unisat browser extension.');
  }

  const unisat = (window as unknown as Record<string, unknown>).unisat as {
    requestAccounts: () => Promise<string[]>;
    switchNetwork: (network: string) => Promise<void>;
  };

  // Request connection
  await unisat.requestAccounts();

  // Switch to testnet (OPNet testnet uses signet)
  try {
    await unisat.switchNetwork('testnet');
  } catch {
    // May already be on testnet
  }

  // Create signer
  const signer = new UnisatSigner();
  await signer.init();

  return {
    connected: true,
    address: signer.p2tr,
    signer,
  };
}

export function disconnectWallet(): WalletState {
  return { ...INITIAL_WALLET_STATE };
}
