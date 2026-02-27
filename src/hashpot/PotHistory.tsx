import { motion, AnimatePresence } from 'framer-motion';
import type { PotHistoryEntry } from './types';
import { BYTE_LABELS, byteColor } from './types';

interface Props {
  entries: PotHistoryEntry[];
}

export function PotHistory({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display text-xs tracking-widest mb-4" style={{ color: '#a0a8c8' }}>
        RECENT DRAWS
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const color = byteColor(e.winnerSlot);
            const hasWinner = e.winnerPool > 0;
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-xl border px-4 py-3 text-center"
                style={{
                  borderColor: hasWinner ? `${color}40` : 'rgba(245,158,11,0.15)',
                  background: '#0a0a1a',
                  minWidth: 90,
                }}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
              >
                <div className="font-mono text-xs text-text-dim mb-1.5">#{e.roundId}</div>
                <div
                  className="font-display text-xl font-black mb-1"
                  style={{
                    color,
                    textShadow: `0 0 10px ${color}88`,
                    lineHeight: 1,
                  }}
                >
                  {BYTE_LABELS[e.winnerSlot]}
                </div>
                <div className="font-mono text-xs text-text-secondary">
                  0x{BYTE_LABELS[e.winnerSlot]}
                </div>
                {hasWinner ? (
                  <div className="font-mono text-xs font-bold mt-1" style={{ color }}>
                    {e.multiplier}×
                  </div>
                ) : (
                  <div className="font-mono text-xs mt-1" style={{ color: '#3a4060' }}>
                    NO WIN
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
