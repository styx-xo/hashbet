import {
  ABIDataTypes,
  BitcoinAbiTypes,
  CallResult,
  JSONRpcProvider,
  OP_NET_ABI,
  getContract,
} from 'opnet';
import type { BaseContractProperties, BitcoinInterfaceAbi } from 'opnet';
import { OPNET_NETWORK, OPNET_RPC_URL, CONTRACT_ADDRESSES } from './config';

// ─── Provider singleton ──────────────────────────────────────────────────────

let _provider: JSONRpcProvider | null = null;

export function getProvider(): JSONRpcProvider {
  if (!_provider) {
    _provider = new JSONRpcProvider({ url: OPNET_RPC_URL, network: OPNET_NETWORK });
  }
  return _provider;
}

// ─── HashFlip (HashLine) ABI ─────────────────────────────────────────────────

export const HashFlipAbi = [
  {
    name: '_newRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_bet',
    payable: true,
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'side', type: ABIDataTypes.UINT8 },
      { name: 'satoshis', type: ABIDataTypes.UINT256 },
    ],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_settle',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'winnerSide', type: ABIDataTypes.UINT8 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_expire',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_claim',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'payout', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_withdraw',
    inputs: [],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getCurrentRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getRound',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getBet',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'addr', type: ABIDataTypes.ADDRESS },
    ],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getClaimable',
    inputs: [{ name: 'addr', type: ABIDataTypes.ADDRESS }],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  ...OP_NET_ABI,
];

// ─── HashSpin ABI ────────────────────────────────────────────────────────────

export const HashSpinAbi = [
  {
    name: '_newRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_bet',
    payable: true,
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'slot', type: ABIDataTypes.UINT8 },
      { name: 'satoshis', type: ABIDataTypes.UINT256 },
    ],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_settle',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'winnerSlot', type: ABIDataTypes.UINT8 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_expire',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_claim',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'payout', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_withdraw',
    inputs: [],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getCurrentRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getRound',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getBet',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'addr', type: ABIDataTypes.ADDRESS },
    ],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getClaimable',
    inputs: [{ name: 'addr', type: ABIDataTypes.ADDRESS }],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getSlotPool',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'slot', type: ABIDataTypes.UINT8 },
    ],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  ...OP_NET_ABI,
];

// ─── HashPot ABI ─────────────────────────────────────────────────────────────

export const HashPotAbi = [
  {
    name: '_newRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_bet',
    payable: true,
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'slot', type: ABIDataTypes.UINT16 },
      { name: 'satoshis', type: ABIDataTypes.UINT256 },
    ],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_settle',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'winnerSlot', type: ABIDataTypes.UINT16 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_expire',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_claim',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'payout', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_withdraw',
    inputs: [],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getCurrentRound',
    inputs: [],
    outputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getRound',
    inputs: [{ name: 'roundId', type: ABIDataTypes.UINT64 }],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getBet',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'addr', type: ABIDataTypes.ADDRESS },
    ],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getClaimable',
    inputs: [{ name: 'addr', type: ABIDataTypes.ADDRESS }],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getSlotPool',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'slot', type: ABIDataTypes.UINT16 },
    ],
    outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    type: BitcoinAbiTypes.Function,
  },
  {
    name: '_getSlotPoolBatch',
    inputs: [
      { name: 'roundId', type: ABIDataTypes.UINT64 },
      { name: 'start', type: ABIDataTypes.UINT16 },
      { name: 'count', type: ABIDataTypes.UINT16 },
    ],
    outputs: [{ name: 'data', type: ABIDataTypes.BYTES }],
    type: BitcoinAbiTypes.Function,
  },
  ...OP_NET_ABI,
];

// ─── Contract interfaces ────────────────────────────────────────────────────

type NewRoundResult = CallResult<{ roundId: bigint }, []>;
type BetResult = CallResult<{ success: boolean }, []>;
type SettleResult = CallResult<{ winnerSide: number } | { winnerSlot: number }, []>;
type ClaimResult = CallResult<{ payout: bigint }, []>;
type WithdrawResult = CallResult<{ amount: bigint }, []>;
type GetCurrentRoundResult = CallResult<{ roundId: bigint }, []>;
type GetRoundResult = CallResult<{ data: Uint8Array }, []>;
type GetBetResult = CallResult<{ data: Uint8Array }, []>;
type GetClaimableResult = CallResult<{ amount: bigint }, []>;
type GetSlotPoolResult = CallResult<{ amount: bigint }, []>;

export interface IHashFlipContract extends BaseContractProperties {
  _newRound(): Promise<NewRoundResult>;
  _bet(roundId: bigint, side: number, satoshis: bigint): Promise<BetResult>;
  _settle(roundId: bigint): Promise<SettleResult>;
  _expire(roundId: bigint): Promise<CallResult<{ success: boolean }, []>>;
  _claim(roundId: bigint): Promise<ClaimResult>;
  _withdraw(): Promise<WithdrawResult>;
  _getCurrentRound(): Promise<GetCurrentRoundResult>;
  _getRound(roundId: bigint): Promise<GetRoundResult>;
  _getBet(roundId: bigint, addr: string): Promise<GetBetResult>;
  _getClaimable(addr: string): Promise<GetClaimableResult>;
}

export interface IHashSpinContract extends BaseContractProperties {
  _newRound(): Promise<NewRoundResult>;
  _bet(roundId: bigint, slot: number, satoshis: bigint): Promise<BetResult>;
  _settle(roundId: bigint): Promise<SettleResult>;
  _expire(roundId: bigint): Promise<CallResult<{ success: boolean }, []>>;
  _claim(roundId: bigint): Promise<ClaimResult>;
  _withdraw(): Promise<WithdrawResult>;
  _getCurrentRound(): Promise<GetCurrentRoundResult>;
  _getRound(roundId: bigint): Promise<GetRoundResult>;
  _getBet(roundId: bigint, addr: string): Promise<GetBetResult>;
  _getClaimable(addr: string): Promise<GetClaimableResult>;
  _getSlotPool(roundId: bigint, slot: number): Promise<GetSlotPoolResult>;
}

export interface IHashPotContract extends BaseContractProperties {
  _newRound(): Promise<NewRoundResult>;
  _bet(roundId: bigint, slot: number, satoshis: bigint): Promise<BetResult>;
  _settle(roundId: bigint): Promise<SettleResult>;
  _expire(roundId: bigint): Promise<CallResult<{ success: boolean }, []>>;
  _claim(roundId: bigint): Promise<ClaimResult>;
  _withdraw(): Promise<WithdrawResult>;
  _getCurrentRound(): Promise<GetCurrentRoundResult>;
  _getRound(roundId: bigint): Promise<GetRoundResult>;
  _getBet(roundId: bigint, addr: string): Promise<GetBetResult>;
  _getClaimable(addr: string): Promise<GetClaimableResult>;
  _getSlotPool(roundId: bigint, slot: number): Promise<GetSlotPoolResult>;
  _getSlotPoolBatch(roundId: bigint, start: number, count: number): Promise<CallResult<{ data: Uint8Array }, []>>;
}

// ─── Contract factories ─────────────────────────────────────────────────────

export function getHashFlipContract(): IHashFlipContract {
  const provider = getProvider();
  return getContract<IHashFlipContract>(
    CONTRACT_ADDRESSES.hashFlip,
    HashFlipAbi as BitcoinInterfaceAbi,
    provider,
    OPNET_NETWORK,
  );
}

export function getHashSpinContract(): IHashSpinContract {
  const provider = getProvider();
  return getContract<IHashSpinContract>(
    CONTRACT_ADDRESSES.hashSpin,
    HashSpinAbi as BitcoinInterfaceAbi,
    provider,
    OPNET_NETWORK,
  );
}

export function getHashPotContract(): IHashPotContract {
  const provider = getProvider();
  return getContract<IHashPotContract>(
    CONTRACT_ADDRESSES.hashPot,
    HashPotAbi as BitcoinInterfaceAbi,
    provider,
    OPNET_NETWORK,
  );
}
