import type { PotRound } from './types';
import { byteColor, BYTE_LABELS } from './types';

interface Props {
  round: PotRound;
  btcPrice?: number | null;
}

const fmtBtc = (sats: number) => (sats / 100_000_000).toFixed(4);
const fmtUsd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

/**
 * 16×16 heatmap visualization of pool distribution across 256 byte slots.
 * Brighter = more money in pool. Winner cell gets a glowing border.
 */
export function PotPoolBar({ round, btcPrice }: Props) {
  const maxPool = Math.max(...round.slotPools, 1);
  const isSettled = round.phase === 'SETTLED' && round.winnerSlot !== undefined;

  return (
    <div>
      {/* Total pool */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-xs tracking-widest" style={{ color: '#a0a8c8' }}>
          TOTAL POOL
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold" style={{ color: '#e8eeff', fontSize: '0.95rem' }}>
            {fmtBtc(round.totalPool)} BTC
          </span>
          {btcPrice && (
            <span className="font-mono font-bold" style={{ color: '#c4ccee', fontSize: '0.85rem' }}>
              {fmtUsd(round.totalPool, btcPrice)}
            </span>
          )}
        </div>
      </div>

      {/* 16×16 heatmap grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, 1fr)',
          gap: 1,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {round.slotPools.map((pool, i) => {
          const color = byteColor(i);
          const intensity = pool > 0 ? Math.max(0.15, pool / maxPool) : 0;
          const isWinner = isSettled && round.winnerSlot === i;

          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                background: pool > 0 ? color : '#0a0a1a',
                opacity: isWinner ? 1 : pool > 0 ? intensity * 0.85 + 0.15 : 0.08,
                transition: 'all 0.3s ease',
                boxShadow: isWinner ? `0 0 6px ${color}, 0 0 12px ${color}88` : 'none',
                border: isWinner ? '1px solid #fff' : '1px solid transparent',
                borderRadius: isWinner ? 2 : 0,
              }}
              title={`0x${BYTE_LABELS[i]}: ${pool > 0 ? fmtBtc(pool) + ' BTC' : 'empty'}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-xs" style={{ color: '#3a4060' }}>EMPTY</span>
        <div className="flex items-center gap-1">
          {[0.1, 0.3, 0.5, 0.7, 1].map((o, idx) => (
            <div
              key={idx}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: '#f59e0b',
                opacity: o,
              }}
            />
          ))}
        </div>
        <span className="font-mono text-xs" style={{ color: '#f59e0b' }}>MAX</span>
      </div>
    </div>
  );
}
