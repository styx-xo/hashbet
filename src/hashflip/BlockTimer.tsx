import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Round } from './types';

const AVG_BLOCK_SECS = 600;

interface Props {
  round: Round | null;
  lastBlockTimestamp: number | null;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(secs: number) { return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`; }

export function BlockTimer({ round, lastBlockTimestamp }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const frozenAt = useRef<number | null>(null);

  useEffect(() => {
    if (lastBlockTimestamp === null) return;
    setElapsed(Math.max(0, Math.floor(Date.now() / 1000 - lastBlockTimestamp)));
    frozenAt.current = null;
  }, [lastBlockTimestamp]);

  useEffect(() => {
    if (!round || round.phase !== 'BETTING') {
      if (round?.phase === 'AWAITING' && frozenAt.current === null) frozenAt.current = elapsed;
      return;
    }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [round?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!round || lastBlockTimestamp === null) {
    return (
      <div className="rounded-xl border border-dark-border text-center" style={{ background: '#0a0a1e', padding: '12px' }}>
        <p className="font-display text-xs tracking-widest text-text-dim animate-pulse">CONNECTING...</p>
      </div>
    );
  }

  const pct = Math.min(Math.round((elapsed / AVG_BLOCK_SECS) * 100), 100);
  const overdue = elapsed > AVG_BLOCK_SECS;
  const barColor = elapsed < 300 ? '#00e5ff' : '#bf00ff';

  return (
    <div className="rounded-xl border border-dark-border relative overflow-hidden" style={{ background: '#0a0a1e', padding: '10px 14px' }}>
      <AnimatePresence mode="wait">
        {round.phase === 'BETTING' && (
          <motion.div key="betting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold tracking-widest" style={{ fontSize: '0.7rem', background: 'linear-gradient(90deg, #00e5ff, #bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BETTING OPEN
              </span>
              <span className="font-display font-black" style={{ fontSize: '1.3rem', lineHeight: 1 }}>
                <span style={{ color: '#00e5ff' }}>{pad(Math.floor(elapsed / 60))}</span>
                <span style={{ color: '#a0a8c8' }}>:</span>
                <span style={{ color: '#bf00ff' }}>{pad(elapsed % 60)}</span>
              </span>
              <span className="font-display text-xs tracking-widest" style={{ color: barColor }}>
                {overdue ? 'OVERDUE' : `${pct}%`}
              </span>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: '#080814' }}>
              <motion.div className="absolute left-0 top-0 h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00e5ff, #bf00ff)' }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </motion.div>
        )}

        {round.phase === 'AWAITING' && (
          <motion.div key="awaiting" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="font-display text-xs tracking-widest text-text-dim">
              BLOCK #{round.targetBlock.toLocaleString()} · {fmt(frozenAt.current ?? elapsed)}
            </div>
            <motion.div className="font-display font-black text-accent" style={{ fontSize: '1rem' }} animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 0.65, repeat: Infinity }}>
              READING HASH
            </motion.div>
          </motion.div>
        )}

        {round.phase === 'SETTLED' && (
          <motion.div key="settled" className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="font-display text-xs tracking-widest text-text-dim">
              #{round.targetBlock.toLocaleString()}
            </span>
            <span className="font-display font-black" style={{
              fontSize: '1.2rem',
              color: round.winner === 'LOW' ? '#00e5ff' : '#bf00ff',
            }}>
              0x{(round.hashByte ?? 0).toString(16).toUpperCase().padStart(2, '0')} · {round.winner} WINS
            </span>
            <span className="font-mono text-xs text-text-dim animate-pulse">Next...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
