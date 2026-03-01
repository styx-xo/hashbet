export interface WalletState {
  connected: boolean;
  address: string | null;
}

export const INITIAL_WALLET_STATE: WalletState = {
  connected: false,
  address: null,
};

type WalletProvider = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  switchNetwork?: (network: string) => Promise<void>;
};

function getWalletProvider(): WalletProvider | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as Record<string, unknown>;

  // OP_WALLET (window.opnet)
  if (w.opnet) return w.opnet as WalletProvider;
  // Unisat
  if (w.unisat) return w.unisat as WalletProvider;
  // Xverse
  if (w.BitcoinProvider) return w.BitcoinProvider as WalletProvider;

  return null;
}

export function isWalletAvailable(): boolean {
  return getWalletProvider() !== null;
}

export async function connectWallet(): Promise<WalletState> {
  const provider = getWalletProvider();
  if (!provider) {
    throw new Error('No Bitcoin wallet detected. Please install OP_WALLET or Unisat.');
  }

  const accounts = await provider.requestAccounts();
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned from wallet.');
  }

  return {
    connected: true,
    address: accounts[0],
  };
}

export function disconnectWallet(): WalletState {
  return { ...INITIAL_WALLET_STATE };
}
