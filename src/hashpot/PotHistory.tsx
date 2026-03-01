import { motion, AnimatePresence } from 'framer-motion';
import type { PotHistoryEntry } from './types';
import { BYTE_LABELS, byteColor } from './types';

interface Props {
  entries: PotHistoryEntry[];
}

export function PotHistory({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display tracking-widest mb-1.5" style={{ color: '#a0a8c8', fontSize: '0.6rem' }}>
        RECENT DRAWS
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const color = byteColor(e.winnerSlot);
            const hasWinner = e.winnerPool > 0;
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-lg border px-3 py-2 text-center"
                style={{
                  borderColor: hasWinner ? `${color}40` : 'rgba(245,158,11,0.15)',
                  background: '#0a0a1a',
                  minWidth: 60,
                }}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
              >
                <div className="font-mono text-text-dim" style={{ fontSize: '0.55rem' }}>#{e.roundId}</div>
                <div
                  className="font-display font-black"
                  style={{ color, fontSize: '1rem', lineHeight: 1 }}
                >
                  {BYTE_LABELS[e.winnerSlot]}
                </div>
                <div className="font-mono text-text-secondary" style={{ fontSize: '0.55rem' }}>
                  0x{BYTE_LABELS[e.winnerSlot]} · {hasWinner ? `${e.multiplier}×` : '—'}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
