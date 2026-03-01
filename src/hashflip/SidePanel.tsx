import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { Side, RoundPhase } from './types';

const btc = (sats: number) => (sats / 100_000_000).toFixed(4);

function calcMulti(myPool: number, theirPool: number) {
  return myPool > 0 ? (1 + (theirPool * 0.99) / myPool).toFixed(2) : '—';
}

const LOW_COLOR  = '#00e5ff';
const HIGH_COLOR = '#bf00ff';

interface Props {
  side: Side;
  pool: number;
  otherPool: number;
  phase: RoundPhase;
  winner?: Side;
  userBet?: { side: Side; amount: number } | null;
  btcPrice?: number | null;
}

export function SidePanel({ side, pool, otherPool, phase, winner, userBet }: Props) {
  const isLow    = side === 'LOW';
  const isWinner = winner === side;
  const isLoser  = winner !== undefined && winner !== side;
  const myBet    = userBet?.side === side ? userBet : null;
  const color    = isLow ? LOW_COLOR : HIGH_COLOR;
  const multi    = calcMulti(pool, otherPool);

  const bg = isLow
    ? 'linear-gradient(170deg, #001f2e 0%, #06060f 65%)'
    : 'linear-gradient(170deg, #1f0040 0%, #06060f 65%)';

  const glowClass = isLow
    ? isWinner ? 'glow-low-strong animate-winner-low' : 'animate-pulse-low'
    : isWinner ? 'glow-high-strong animate-winner-high' : 'animate-pulse-high';

  return (
    <motion.div
      className={`relative flex flex-col items-center rounded-xl border overflow-hidden ${glowClass}`}
      style={{ background: bg, borderColor: isLoser ? '#1e2048' : `${color}50`, padding: '12px 10px' }}
      animate={{ opacity: isLoser ? 0.32 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Side label + icon */}
      <div className="flex items-center gap-2 font-display font-black tracking-widest" style={{ fontSize: '1.4rem', lineHeight: 1, color }}>
        {isLow ? <TrendingDown size={20} strokeWidth={2.5} /> : <TrendingUp size={20} strokeWidth={2.5} />}
        {side}
      </div>
      <div className="font-mono" style={{ color: `${color}80`, fontSize: '0.65rem', marginTop: 2 }}>
        BYTE {isLow ? '< 128' : '≥ 128'}
      </div>

      {/* Pool + Multiplier — compact row */}
      <div className="flex items-baseline gap-3 mt-2">
        <span className="font-mono font-bold" style={{ fontSize: '1.1rem', color }}>
          {btc(pool)} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>BTC</span>
        </span>
        <span className="font-display font-black" style={{ fontSize: '1.3rem', color }}>
          {multi}×
        </span>
      </div>

      {/* User bet badge */}
      {myBet && (
        <div className="font-mono font-bold mt-2" style={{ fontSize: '0.75rem', color }}>
          YOUR BET: {btc(myBet.amount)} BTC
        </div>
      )}

      {/* Winner */}
      {phase === 'SETTLED' && isWinner && (
        <motion.div
          className="font-display font-black tracking-widest mt-2"
          style={{ fontSize: '0.9rem', color, textShadow: `0 0 16px ${color}` }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
        >
          WINNER
        </motion.div>
      )}
    </motion.div>
  );
}
