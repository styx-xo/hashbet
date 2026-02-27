import { motion, AnimatePresence } from 'framer-motion';
import type { SpinHistoryEntry } from './types';
import { SLOT_LABELS, slotColor } from './types';

interface Props {
  entries: SpinHistoryEntry[];
}

export function SpinHistory({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display text-xs tracking-widest mb-4" style={{ color: '#a0a8c8' }}>
        RECENT SPINS
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const color = slotColor(e.winnerSlot);
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-xl border px-5 py-4 text-center"
                style={{
                  borderColor: `${color}40`,
                  background: '#0a0a1a',
                  minWidth: 100,
                }}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
              >
                <div className="font-mono text-xs text-text-dim mb-2">#{e.roundId}</div>
                <div
                  className="font-display text-2xl font-black mb-1"
                  style={{
                    color,
                    textShadow: `0 0 12px ${color}88`,
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
