export type Side = 'LOW' | 'HIGH';
export type RoundPhase = 'BETTING' | 'AWAITING' | 'SETTLED';

export interface Round {
  id: number;
  targetBlock: number;
  currentBlock: number;
  poolLow: number;    // satoshis
  poolHigh: number;   // satoshis
  phase: RoundPhase;
  winner?: Side;
  hashByte?: number;  // 0–255
}

export interface HistoryEntry {
  roundId: number;
  winner: Side;
  hashByte: number;
  multiplier: number;
}
