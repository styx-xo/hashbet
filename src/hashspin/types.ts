export type SpinPhase = 'BETTING' | 'SPINNING' | 'SETTLED';

export interface SpinRound {
  id: number;
  targetBlock: number;
  currentBlock: number;
  slotPools: number[];   // 16 entries (sats per slot)
  totalPool: number;     // sats
  phase: SpinPhase;
  winnerSlot?: number;   // 0–15
  hashNibble?: number;   // 0–15 raw value
}

export interface SpinHistoryEntry {
  roundId: number;
  winnerSlot: number;    // 0–15
  totalPool: number;
  winnerPool: number;
  multiplier: number;
}

export const SLOT_LABELS = [
  '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
] as const;

/**
 * Generate a color for each of the 16 slots.
 * Gradient cycles teal (#00e5ff) → purple (#bf00ff) → teal around the ring.
 */
export function slotColor(slot: number): string {
  const t = slot / 16;
  const angle = t * Math.PI * 2;
  const mix = (Math.cos(angle) + 1) / 2;
  const r = Math.round(0 + (191 - 0) * (1 - mix));
  const g = Math.round(229 * mix);
  const b = 255;
  return `rgb(${r},${g},${b})`;
}
