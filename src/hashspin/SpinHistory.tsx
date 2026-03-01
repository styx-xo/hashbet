import { motion, AnimatePresence } from 'framer-motion';
import type { SpinHistoryEntry } from './types';
import { SLOT_LABELS, slotColor } from './types';

interface Props {
  entries: SpinHistoryEntry[];
}

export function SpinHistory({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display tracking-widest mb-1.5" style={{ color: '#6872a0', fontSize: '0.6rem' }}>
        RECENT SPINS
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const color = slotColor(e.winnerSlot);
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-lg border px-3 py-2 text-center"
                style={{
                  borderColor: `${color}30`,
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
                  style={{
                    color,
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                >
                  {SLOT_LABELS[e.winnerSlot]}
                </div>
                <div className="font-mono text-xs text-text-secondary">
                  0x{e.winnerSlot.toString(16).toUpperCase()}
                </div>
                <div className="font-mono text-xs font-bold mt-1" style={{ color }}>
                  {e.multiplier}×
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
