import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { HistoryEntry } from './types';

interface Props {
  entries: HistoryEntry[];
}

export function History({ entries }: Props) {
  return (
    <div className="w-full">
      <div className="font-display tracking-widest mb-1.5" style={{ color: '#a0a8c8', fontSize: '0.6rem' }}>RECENT ROUNDS</div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <AnimatePresence initial={false}>
          {entries.map(e => {
            const isLow = e.winner === 'LOW';
            const color = isLow ? '#00e5ff' : '#bf00ff';
            const dimBg = isLow ? '#001a1f' : '#190030';
            return (
              <motion.div
                key={e.roundId}
                className="flex-shrink-0 rounded-lg border px-3 py-2 text-center"
                style={{ borderColor: `${color}40`, background: dimBg, minWidth: 60 }}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.35 }}
              >
                <div className="font-mono text-text-dim" style={{ fontSize: '0.55rem' }}>#{e.roundId}</div>
                <div
                  className="flex items-center justify-center gap-1 font-display font-bold"
                  style={{ color, fontSize: '0.7rem' }}
                >
                  {isLow ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                  {e.winner}
                </div>
                <div className="font-mono text-text-secondary" style={{ fontSize: '0.55rem' }}>
                  0x{e.hashByte.toString(16).toUpperCase().padStart(2, '0')} · {e.multiplier}×
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
