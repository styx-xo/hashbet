import { motion } from 'framer-motion';
import { BYTE_LABELS, byteColor } from './types';
import type { PotPhase } from './types';

interface Props {
  selectedSlot: number | null;
  onSelectSlot: (slot: number) => void;
  slotPools: number[];
  totalPool: number;
  userBetSlot: number | null;
  phase: PotPhase;
  winnerSlot?: number;
  disabled?: boolean;
}

const NIB = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

export function ByteSelector({ selectedSlot, onSelectSlot, totalPool, userBetSlot, phase, winnerSlot, disabled }: Props) {
  const isSettled = phase === 'SETTLED' && winnerSlot !== undefined;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="font-display font-black tracking-widest" style={{ fontSize: '1.1rem' }}>
          {isSettled ? (
            <span style={{ color: '#a0a8c8' }}>RESULT</span>
          ) : (
            <span
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #ff6b00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SELECT A BYTE
            </span>
          )}
        </div>
        {totalPool > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-display text-xs tracking-widest" style={{ color: '#6872a0' }}>TOTAL POOL</span>
            <span className="font-mono font-bold text-sm" style={{ color: '#f59e0b' }}>
              {(totalPool / 100_000_000).toFixed(4)} BTC
            </span>
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(16, 1fr)', gap: 3, marginBottom: 3 }}>
        <div />
        {NIB.map((label) => (
          <div
            key={`col-${label}`}
            className="font-mono font-bold"
            style={{ textAlign: 'center', fontSize: '0.65rem', color: '#6872a0', lineHeight: '16px' }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 16×16 grid */}
      {Array.from({ length: 16 }).map((_, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: '24px repeat(16, 1fr)', gap: 3, marginBottom: 3 }}>
          {/* Row label */}
          <div
            className="font-mono font-bold flex items-center justify-center"
            style={{ fontSize: '0.65rem', color: '#6872a0' }}
          >
            {NIB[row]}
          </div>

          {/* 16 cells */}
          {Array.from({ length: 16 }).map((_, col) => {
            const i = row * 16 + col;
            const color = byteColor(i);
            const isSelected = selectedSlot === i;
            const isBet = userBetSlot === i;
            const isWinner = isSettled && winnerSlot === i;
            const isLoser = isSettled && winnerSlot !== i;

            return (
              <motion.button
                key={i}
                onClick={() => onSelectSlot(i)}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.15, zIndex: 10 } : undefined}
                whileTap={!disabled ? { scale: 0.92 } : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  borderRadius: 5,
                  border: isWinner ? '2px solid #fff'
                    : isSelected || isBet ? `2px solid ${color}`
                    : '1px solid #151838',
                  background: isWinner
                    ? `${color}44`
                    : isSelected || isBet
                    ? `${color}15`
                    : '#08081a',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: isLoser && !isBet ? 0.15 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow: isWinner
                    ? `0 0 14px ${color}aa, 0 0 28px ${color}44`
                    : isSelected || isBet
                    ? `0 0 10px ${color}44`
                    : 'none',
                  position: 'relative',
                  padding: 0,
                }}
              >
                {/* Bet dot */}
                {isBet && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 4px ${color}`,
                    }}
                  />
                )}

                {/* Hex label */}
                <span
                  className="font-mono font-bold"
                  style={{
                    fontSize: '0.8rem',
                    lineHeight: 1,
                    color: isWinner ? '#fff'
                      : isLoser ? '#2a2a44'
                      : isSelected || isBet ? color
                      : color,
                    opacity: (isWinner || isLoser || isSelected || isBet) ? 1 : 0.55,
                    textShadow: isWinner || isSelected || isBet
                      ? `0 0 8px ${color}88`
                      : 'none',
                  }}
                >
                  {BYTE_LABELS[i]}
                </span>
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
