import { motion } from 'framer-motion';
import { SLOT_LABELS, slotColor } from './types';
import type { SpinPhase } from './types';

interface Props {
  selectedSlot: number | null;
  onSelectSlot: (slot: number) => void;
  slotPools: number[];
  totalPool: number;
  userBetSlot: number | null;
  phase: SpinPhase;
  winnerSlot?: number;
  disabled?: boolean;
}

const calcMultiplier = (slotPool: number, totalPool: number): string => {
  if (slotPool <= 0 || totalPool <= 0) return '—';
  const m = (totalPool * 0.99) / slotPool;
  return m >= 100 ? `${Math.round(m)}×` : `${m.toFixed(1)}×`;
};

export function SlotSelector({ selectedSlot, onSelectSlot, slotPools, totalPool, userBetSlot, phase, winnerSlot, disabled }: Props) {
  const isSettled = phase === 'SETTLED' && winnerSlot !== undefined;

  return (
    <div>
      {/* Header */}
      <div className="font-display font-black tracking-widest mb-4 text-center" style={{ fontSize: '1.4rem' }}>
        {isSettled ? (
          <span style={{ color: '#a0a8c8' }}>RESULT</span>
        ) : (
          <span
            style={{
              background: 'linear-gradient(90deg, #00e5ff, #bf00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SELECT A SLOT
          </span>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
        {Array.from({ length: 16 }).map((_, i) => {
          const color = slotColor(i);
          const isSelected = selectedSlot === i;
          const isBet = userBetSlot === i;
          const pool = slotPools[i];
          const isWinner = isSettled && winnerSlot === i;
          const isLoser = isSettled && winnerSlot !== i;

          return (
            <motion.button
              key={i}
              onClick={() => onSelectSlot(i)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.1, y: -3 } : undefined}
              whileTap={!disabled ? { scale: 0.92 } : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '18px 0',
                borderRadius: 12,
                border: `2px solid ${
                  isWinner ? '#fff'
                  : isSelected || isBet ? color
                  : '#1e2048'
                }`,
                background: isWinner
                  ? `${color}33`
                  : isLoser
                  ? 'rgba(8,8,24,0.5)'
                  : isSelected || isBet
                  ? `${color}15`
                  : '#0a0a1e',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: isLoser && !isBet ? 0.3 : 1,
                transition: 'all 0.2s ease',
                boxShadow: isWinner
                  ? `0 0 24px ${color}88, 0 0 48px ${color}33`
                  : isSelected || isBet
                  ? `0 0 16px ${color}44, inset 0 0 12px ${color}11`
                  : 'none',
                position: 'relative',
              }}
            >
              {/* Bet indicator dot */}
              {isBet && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
              )}

              {/* Hex label — big and bold */}
              <span
                className="font-display font-black"
                style={{
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  color: isWinner ? '#fff' : isLoser ? '#2a2a44' : color,
                  textShadow: isSelected || isBet || isWinner
                    ? `0 0 12px ${color}88`
                    : 'none',
                }}
              >
                {SLOT_LABELS[i]}
              </span>

              {/* Multiplier — clean and readable */}
              {pool > 0 && !isLoser && (
                <span
                  className="font-mono font-bold"
                  style={{
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    color: isWinner ? '#fff' : `${color}99`,
                  }}
                >
                  {calcMultiplier(pool, totalPool)}
                </span>
              )}

              {/* No pool label for empty slots */}
              {pool <= 0 && !isLoser && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.65rem',
                    lineHeight: 1,
                    color: '#2d3270',
                  }}
                >
                  —
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
