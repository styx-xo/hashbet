export type PotPhase = 'BETTING' | 'DRAWING' | 'SETTLED';

export interface PotRound {
  id: number;
  targetBlock: number;
  currentBlock: number;
  slotPools: number[];   // 256 entries (sats per slot)
  totalPool: number;     // sats
  phase: PotPhase;
  winnerSlot?: number;   // 0–255
  hashByte?: number;     // 0–255 raw value
}

export interface PotHistoryEntry {
  roundId: number;
  winnerSlot: number;    // 0–255
  totalPool: number;
  winnerPool: number;
  multiplier: number;
}

/** 256 hex labels: '00', '01', ..., 'FF' */
export const BYTE_LABELS: string[] = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).toUpperCase().padStart(2, '0'),
);

/**
 * Generate a color for each of the 256 byte slots.
 * Cycles teal (#00e5ff) → purple (#bf00ff) → amber (#f59e0b) → teal.
 */
export function byteColor(slot: number): string {
  const t = slot / 256;
  const angle = t * Math.PI * 2;

  // Three-way blend: teal → purple → amber → teal
  const phase1 = (Math.cos(angle) + 1) / 2;                    // teal weight
  const phase2 = (Math.cos(angle - (2 * Math.PI) / 3) + 1) / 2; // purple weight
  const phase3 = (Math.cos(angle - (4 * Math.PI) / 3) + 1) / 2; // amber weight

  const total = phase1 + phase2 + phase3;
  const w1 = phase1 / total;
  const w2 = phase2 / total;
  const w3 = phase3 / total;

  // teal: 0, 229, 255  |  purple: 191, 0, 255  |  amber: 245, 158, 11
  const r = Math.round(0 * w1 + 191 * w2 + 245 * w3);
  const g = Math.round(229 * w1 + 0 * w2 + 158 * w3);
  const b = Math.round(255 * w1 + 255 * w2 + 11 * w3);

  return `rgb(${r},${g},${b})`;
}
