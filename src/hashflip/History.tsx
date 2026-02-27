import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { HistoryEntry } from './types';

interface Props {
  entries: HistoryEntry[];
}

export function History({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display text-xs tracking-widest mb-4" style={{ color: '#a0a8c8' }}>RECENT ROUNDS</div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const isLow = e.winner === 'LOW';
            const color = isLow ? '#00e5ff' : '#bf00ff';
            const dimBg = isLow ? '#001a1f' : '#190030';
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-xl border px-5 py-4 text-center"
                style={{ borderColor: `${color}40`, background: dimBg, minWidth: 100 }}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
              >
                <div className="font-mono text-xs text-text-dim mb-2">#{e.roundId}</div>
                <div
                  className="flex items-center justify-center gap-1 font-display text-sm font-bold mb-2"
                  style={{ color }}
                >
                  {isLow ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {e.winner}
                </div>
                <div className="font-mono text-xs text-text-secondary">
                  0x{e.hashByte.toString(16).toUpperCase().padStart(2, '0')}
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
