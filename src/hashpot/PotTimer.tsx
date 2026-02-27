import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PotRound } from './types';
import { BYTE_LABELS, byteColor } from './types';

const AVG_BLOCK_SECS = 600;

interface Props {
  round: PotRound | null;
  lastBlockTimestamp: number | null;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function PotTimer({ round, lastBlockTimestamp }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const frozenAt = useRef<number | null>(null);

  useEffect(() => {
    if (lastBlockTimestamp === null) return;
    const sinceMined = Math.floor(Date.now() / 1000 - lastBlockTimestamp);
    setElapsed(Math.max(0, sinceMined));
    frozenAt.current = null;
  }, [lastBlockTimestamp]);

  useEffect(() => {
    if (!round || round.phase !== 'BETTING') {
      if (round?.phase === 'DRAWING' && frozenAt.current === null) {
        frozenAt.current = elapsed;
      }
      return;
    }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [round?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!round || lastBlockTimestamp === null) {
    return (
      <div className="rounded-2xl border border-dark-border text-center" style={{ background: '#0a0a1e', padding: '32px 24px' }}>
        <p className="font-display text-xs tracking-widest text-text-dim animate-pulse">
          CONNECTING TO BITCOIN NETWORK...
        </p>
      </div>
    );
  }

  const progress = Math.min(elapsed / AVG_BLOCK_SECS, 1);
  const overdue = elapsed > AVG_BLOCK_SECS;
  const pct = Math.round(progress * 100);
  const remainEst = Math.max(0, AVG_BLOCK_SECS - elapsed);
  const displayTime = frozenAt.current !== null ? frozenAt.current : elapsed;
  const barColor = elapsed < 300 ? '#f59e0b' : '#ff6b00';

  return (
    <div
      className="rounded-2xl border border-dark-border relative overflow-hidden h-full"
      style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #06060f 100%)', padding: '20px 22px' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: round.phase === 'SETTLED' && round.winnerSlot !== undefined
            ? `radial-gradient(ellipse 80% 80% at 50% 50%, ${byteColor(round.winnerSlot)}0d 0%, transparent 70%)`
            : round.phase === 'DRAWING'
            ? 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)'
            : `radial-gradient(ellipse 80% 80% at 50% 50%, ${barColor}0a 0%, transparent 70%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {round.phase === 'BETTING' && (
          <motion.div key="betting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-display font-black tracking-widest mb-1" style={{ fontSize: '1rem' }}>
                  <span style={{ background: 'linear-gradient(90deg, #f59e0b, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BETTING OPEN
                  </span>
                </div>
                {!overdue && (
                  <div className="font-mono text-sm font-semibold" style={{ color: '#c4ccee' }}>
                    ~{fmt(remainEst)} remaining
                  </div>
                )}
              </div>
              <div
                className="font-display text-xs tracking-widest px-3 py-1 rounded-full border"
                style={{ color: barColor, borderColor: `${barColor}50`, background: `${barColor}10` }}
              >
                {overdue ? 'OVERDUE' : `${pct}%`}
              </div>
            </div>

            {/* Timer clock */}
            <div className="text-center font-display font-black mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
              <span style={{ color: '#f59e0b', textShadow: '0 0 30px rgba(245,158,11,0.7), 0 0 60px rgba(245,158,11,0.3)' }}>
                {pad(Math.floor(elapsed / 60))}
              </span>
              <span style={{ color: '#a0a8c8' }}>:</span>
              <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.7), 0 0 60px rgba(255,107,0,0.3)' }}>
                {pad(elapsed % 60)}
              </span>
            </div>

            <div className="text-center font-display text-xs tracking-widest mb-3" style={{ color: '#c4ccee' }}>
              TIME SINCE LAST BLOCK
            </div>

            {/* Progress bar */}
            <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: '#080814', border: '1px solid #1e2048' }}>
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #ff6b00)' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'bar-shimmer 2s linear infinite',
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5 font-mono text-xs" style={{ color: '#a0a8c8' }}>
              <span>0:00</span>
              <span>avg 10:00</span>
            </div>
          </motion.div>
        )}

        {round.phase === 'DRAWING' && (
          <motion.div key="drawing" className="text-center py-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="font-display text-xs tracking-widest text-text-dim mb-3">
              BLOCK #{round.targetBlock.toLocaleString()} MINED AFTER {fmt(frozenAt.current ?? displayTime)}
            </div>
            <motion.div
              className="font-display font-black"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: '#f59e0b' }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 0.65, repeat: Infinity }}
            >
              DRAWING THE WINNER
            </motion.div>
            <div className="font-mono text-xs text-text-dim mt-3">
              Reading last byte of block hash...
            </div>
          </motion.div>
        )}

        {round.phase === 'SETTLED' && round.winnerSlot !== undefined && (
          <motion.div key="settled" className="text-center py-2" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', bounce: 0.4 }}>
            <div className="font-display text-xs tracking-widest text-text-dim mb-3">
              BLOCK #{round.targetBlock.toLocaleString()} · RESULT
            </div>
            <div
              className="font-display font-black"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                color: byteColor(round.winnerSlot),
                textShadow: `0 0 30px ${byteColor(round.winnerSlot)}cc, 0 0 60px ${byteColor(round.winnerSlot)}55`,
              }}
            >
              0x{BYTE_LABELS[round.winnerSlot]}
            </div>
            <div className="font-mono text-text-secondary text-sm mt-2">
              BYTE {BYTE_LABELS[round.winnerSlot]} WINS
            </div>
            <div className="font-mono text-xs text-text-dim mt-3 animate-pulse">
              Next round starting soon...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
