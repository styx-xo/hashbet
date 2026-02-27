import { motion } from 'framer-motion';

const btc = (sats: number) => (sats / 100_000_000).toFixed(4);
const usd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

interface Props {
  poolLow: number;
  poolHigh: number;
  btcPrice?: number | null;
}

export function PoolBar({ poolLow, poolHigh, btcPrice }: Props) {
  const total = poolLow + poolHigh;
  const lowPct  = total > 0 ? (poolLow  / total) * 100 : 50;
  const highPct = 100 - lowPct;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-display text-xs tracking-widest text-low">
          LOW {lowPct.toFixed(1)}%
        </span>
        <span className="font-display tracking-widest font-bold" style={{ color: '#a0a8c8', fontSize: '0.65rem' }}>POOL DISTRIBUTION</span>
        <span className="font-display text-xs tracking-widest text-high">
          {highPct.toFixed(1)}% HIGH
        </span>
      </div>

      {/* Bar */}
      <div
        className="relative h-4 rounded-full overflow-hidden"
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
      <div className="flex justify-between mt-2 font-mono text-sm">
        <div className="flex flex-col">
          <span className="text-low font-bold">{btc(poolLow)} BTC</span>
          {btcPrice && <span className="font-bold" style={{ fontSize: '0.85rem', color: '#00e5ff' }}>{usd(poolLow, btcPrice)}</span>}
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold" style={{ fontSize: '0.9rem', color: '#a0a8c8' }}>TOTAL {btc(total)} BTC</span>
          {btcPrice && <span className="font-bold" style={{ fontSize: '0.85rem', color: '#c4ccee' }}>{usd(total, btcPrice)}</span>}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-high font-bold">{btc(poolHigh)} BTC</span>
          {btcPrice && <span className="font-bold" style={{ fontSize: '0.85rem', color: '#bf00ff' }}>{usd(poolHigh, btcPrice)}</span>}
        </div>
      </div>
    </div>
  );
}
