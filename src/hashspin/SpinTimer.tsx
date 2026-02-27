import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpinRound } from './types';
import { SLOT_LABELS, slotColor } from './types';

const AVG_BLOCK_SECS = 600;

interface Props {
  round: SpinRound | null;
  lastBlockTimestamp: number | null;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function SpinTimer({ round, lastBlockTimestamp }: Props) {
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
      if (round?.phase === 'SPINNING' && frozenAt.current === null) {
        frozenAt.current = elapsed;
      }
      return;
    }
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [round?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!round || lastBlockTimestamp === null) {
    return (
      <div className="rounded-2xl border border-dark-border text-center" style={{ background: '#0a0a1e', padding: '40px 24px' }}>
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
  const barColor = elapsed < 300 ? '#00e5ff' : '#bf00ff';

  return (
    <div
      className="rounded-2xl border border-dark-border relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1e 0%, #06060f 100%)', padding: '28px 32px' }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: round.phase === 'SETTLED' && round.winnerSlot !== undefined
            ? `radial-gradient(ellipse 80% 80% at 50% 50%, ${slotColor(round.winnerSlot)}0d 0%, transparent 70%)`
            : round.phase === 'SPINNING'
            ? 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,58,255,0.06) 0%, transparent 70%)'
            : `radial-gradient(ellipse 80% 80% at 50% 50%, ${barColor}0a 0%, transparent 70%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {round.phase === 'BETTING' && (
          <motion.div key="betting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-display font-black tracking-widest mb-1" style={{ fontSize: '1.25rem' }}>
                  <span style={{ background: 'linear-gradient(90deg, #00e5ff, #bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BETTING OPEN
                  </span>
                </div>
                {!overdue && (
                  <div className="font-mono text-sm font-semibold" style={{ color: '#c4ccee' }}>
                    ~{fmt(remainEst)} remaining (avg)
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

            <div className="text-center font-display font-black mb-5" style={{ fontSize: 'clamp(3rem, 9vw, 5.5rem)', lineHeight: 1 }}>
              <span style={{ color: '#00e5ff', textShadow: '0 0 30px rgba(0,229,255,0.7), 0 0 60px rgba(0,229,255,0.3)' }}>
                {pad(Math.floor(elapsed / 60))}
              </span>
              <span style={{ color: '#a0a8c8' }}>:</span>
              <span style={{ color: '#bf00ff', textShadow: '0 0 30px rgba(191,0,255,0.7), 0 0 60px rgba(191,0,255,0.3)' }}>
                {pad(elapsed % 60)}
              </span>
            </div>

            <div className="text-center font-display text-xs tracking-widest mb-5" style={{ color: '#c4ccee' }}>
              TIME SINCE LAST BLOCK
            </div>

            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#080814', border: '1px solid #1e2048' }}>
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00e5ff, #bf00ff)' }}
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
            <div className="flex justify-between mt-2 font-mono text-xs" style={{ color: '#a0a8c8' }}>
              <span>0:00</span>
              <span>avg 10:00</span>
            </div>
          </motion.div>
        )}

        {round.phase === 'SPINNING' && (
          <motion.div key="spinning" className="text-center py-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="font-display text-xs tracking-widest text-text-dim mb-3">
              BLOCK #{round.targetBlock.toLocaleString()} MINED AFTER {fmt(frozenAt.current ?? displayTime)}
            </div>
            <motion.div
              className="font-display font-black text-accent"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 0.65, repeat: Infinity }}
            >
              SPINNING THE WHEEL
            </motion.div>
            <div className="font-mono text-xs text-text-dim mt-3">
              Reading last digit of block hash...
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
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                color: slotColor(round.winnerSlot),
                textShadow: `0 0 30px ${slotColor(round.winnerSlot)}cc, 0 0 60px ${slotColor(round.winnerSlot)}55`,
              }}
            >
              0x{round.winnerSlot.toString(16).toUpperCase()}
            </div>
            <div className="font-mono text-text-secondary text-sm mt-2">
              SLOT {SLOT_LABELS[round.winnerSlot]} WINS
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
