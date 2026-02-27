import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { Side, RoundPhase } from './types';

const btc = (sats: number) => (sats / 100_000_000).toFixed(4);
const usd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

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

export function SidePanel({ side, pool, otherPool, phase, winner, userBet, btcPrice }: Props) {
  const isLow    = side === 'LOW';
  const isWinner = winner === side;
  const isLoser  = winner !== undefined && winner !== side;
  const myBet    = userBet?.side === side ? userBet : null;

  const color  = isLow ? LOW_COLOR : HIGH_COLOR;
  const dimBg  = isLow ? '#001a1f' : '#190030';
  const bg     = isLow
    ? 'linear-gradient(170deg, #001f2e 0%, #06060f 65%)'
    : 'linear-gradient(170deg, #1f0040 0%, #06060f 65%)';

  const glowClass = isLow
    ? isWinner ? 'glow-low-strong animate-winner-low'   : 'animate-pulse-low'
    : isWinner ? 'glow-high-strong animate-winner-high' : 'animate-pulse-high';

  const borderColor = isLoser
    ? '#1e2048'
    : isLow ? 'rgba(0,229,255,0.35)' : 'rgba(191,0,255,0.35)';

  const multi = calcMulti(pool, otherPool);

  return (
    <motion.div
      className={`relative flex flex-col items-center p-6 rounded-2xl border overflow-hidden ${glowClass}`}
      style={{ background: bg, borderColor }}
      initial={{ opacity: 0, x: isLow ? -40 : 40 }}
      animate={{ opacity: isLoser ? 0.32 : 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)` }}
      />

      {/* Side label */}
      <div className="text-center" style={{ marginBottom: 4 }}>
        <div
          className="flex items-center justify-center gap-3 font-display font-black tracking-widest"
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
            lineHeight: 1,
            color,
            textShadow: `0 0 20px ${color}70, 0 0 40px ${color}35`,
          }}
        >
          {isLow ? <TrendingDown size={34} strokeWidth={2.5} /> : <TrendingUp size={34} strokeWidth={2.5} />}
          {side}
        </div>
        <div className="font-mono text-sm" style={{ color: `${color}90`, marginTop: 4 }}>
          BYTE {isLow ? '< 128' : '≥ 128'}
        </div>
      </div>

      {/* Pool amount */}
      <div className="w-full text-center" style={{ marginTop: 16 }}>
        <div className="font-display tracking-widest mb-1" style={{ color: '#a0a8c8', fontSize: '0.85rem' }}>
          POOL
        </div>
        <motion.div
          className="font-mono font-bold"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color }}
          key={Math.round(pool / 1000)}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {btc(pool)}
          <span style={{ fontSize: '0.95rem', opacity: 0.55, marginLeft: 4 }}>BTC</span>
        </motion.div>
        {btcPrice && (
          <div className="font-mono font-bold" style={{ fontSize: '1.25rem', color, opacity: 0.85, marginTop: 2 }}>
            {usd(pool, btcPrice)}
          </div>
        )}
      </div>

      {/* Multiplier box */}
      <div
        className="w-full rounded-xl border px-5 py-4 text-center"
        style={{ background: `${color}0c`, borderColor: `${color}28`, marginTop: 16 }}
      >
        <div className="font-display text-xs tracking-widest mb-1" style={{ color: '#a0a8c8' }}>
          IF YOU WIN
        </div>
        <motion.div
          className="font-display font-black"
          style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)', color, lineHeight: 1 }}
          key={multi}
          initial={{ scale: 1.1, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {multi}×
        </motion.div>
        <div className="font-mono text-xs mt-1" style={{ color: '#a0a8c8' }}>
          payout multiplier
        </div>
      </div>

      {/* User bet badge */}
      {myBet && (
        <motion.div
          className="w-full rounded-xl border px-4 py-3 text-center font-mono"
          style={{ background: dimBg, borderColor: `${color}50`, color, marginTop: 12 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-xs mb-1" style={{ color: '#a0a8c8' }}>YOUR BET</div>
          <div className="text-xl font-bold">{btc(myBet.amount)} BTC</div>
          {btcPrice && (
            <div className="font-bold" style={{ fontSize: '0.85rem', color, opacity: 0.75, marginTop: 2 }}>
              {usd(myBet.amount, btcPrice)}
            </div>
          )}
        </motion.div>
      )}

      {/* Winner announcement */}
      {phase === 'SETTLED' && isWinner && (
        <motion.div
          className="w-full text-center mt-4"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.4 }}
        >
          <div
            className="font-display font-black tracking-widest text-2xl animate-count-in"
            style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}80` }}
          >
            ★ WINNER ★
          </div>
          {myBet && (
            <button className={`btn mt-3 w-full py-3 text-base ${isLow ? 'btn-low' : 'btn-high'}`}>
              CLAIM WINNINGS
            </button>
          )}
        </motion.div>
      )}

    </motion.div>
  );
}
