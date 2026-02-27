import type { SpinRound } from './types';
import { slotColor, SLOT_LABELS } from './types';

interface Props {
  round: SpinRound;
  btcPrice?: number | null;
}

const fmtBtc = (sats: number) => (sats / 100_000_000).toFixed(4);
const fmtUsd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

export function SpinPoolBar({ round, btcPrice }: Props) {
  const maxPool = Math.max(...round.slotPools, 1);

  return (
    <div>
      {/* Total pool */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xs tracking-widest" style={{ color: '#a0a8c8' }}>
          TOTAL POOL
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold" style={{ color: '#e8eeff', fontSize: '1rem' }}>
            {fmtBtc(round.totalPool)} BTC
          </span>
          {btcPrice && (
            <span className="font-mono font-bold" style={{ color: '#c4ccee', fontSize: '0.9rem' }}>
              {fmtUsd(round.totalPool, btcPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Mini bar chart */}
      <div style={{ display: 'flex', gap: 2, height: 32, alignItems: 'flex-end' }}>
        {round.slotPools.map((pool, i) => {
          const height = pool > 0 ? Math.max(4, (pool / maxPool) * 32) : 2;
          const color = slotColor(i);
          const isWinner = round.phase === 'SETTLED' && round.winnerSlot === i;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height,
                background: pool > 0 ? color : '#1e2048',
                borderRadius: '2px 2px 0 0',
                opacity: isWinner ? 1 : pool > 0 ? 0.7 : 0.3,
                transition: 'height 0.3s ease, opacity 0.3s ease',
                boxShadow: isWinner ? `0 0 8px ${color}` : 'none',
              }}
              title={`Slot ${SLOT_LABELS[i]}: ${fmtBtc(pool)} BTC`}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
        {SLOT_LABELS.map((label, i) => (
          <div
            key={i}
            className="font-mono"
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.55rem',
              color: slotColor(i),
              opacity: 0.6,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
