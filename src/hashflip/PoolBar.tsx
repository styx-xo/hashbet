import { motion } from 'framer-motion';

const btc = (sats: number) => (sats / 100_000_000).toFixed(4);
interface Props {
  poolLow: number;
  poolHigh: number;
  btcPrice?: number | null;
}

export function PoolBar({ poolLow, poolHigh }: Props) {
  const total = poolLow + poolHigh;
  const lowPct  = total > 0 ? (poolLow  / total) * 100 : 50;
  const highPct = 100 - lowPct;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-display tracking-widest text-low" style={{ fontSize: '0.6rem' }}>
          LOW {lowPct.toFixed(0)}%
        </span>
        <span className="font-display tracking-widest font-bold" style={{ color: '#6872a0', fontSize: '0.55rem' }}>POOL</span>
        <span className="font-display tracking-widest text-high" style={{ fontSize: '0.6rem' }}>
          {highPct.toFixed(0)}% HIGH
        </span>
      </div>

      {/* Bar */}
      <div
        className="relative h-2.5 rounded-full overflow-hidden"
        style={{ background: '#080814', border: '1px solid #1e2048' }}
      >
        {/* LOW fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #001a1f, #00e5ff)' }}
          animate={{ width: `${lowPct}%` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        {/* HIGH fill */}
        <motion.div
          className="absolute right-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(270deg, #190030, #bf00ff)' }}
          animate={{ width: `${highPct}%` }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'bar-shimmer 2.5s linear infinite',
          }}
        />
      </div>

      {/* BTC amounts */}
      <div className="flex justify-between mt-1 font-mono" style={{ fontSize: '0.7rem' }}>
        <span className="text-low font-bold">{btc(poolLow)}</span>
        <span className="font-bold" style={{ color: '#6872a0' }}>TOTAL {btc(total)} BTC</span>
        <span className="text-high font-bold">{btc(poolHigh)}</span>
      </div>
    </div>
  );
}
