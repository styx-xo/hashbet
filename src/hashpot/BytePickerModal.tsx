import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BYTE_LABELS, byteColor } from './types';
import type { PotPhase } from './types';

interface Props {
  open: boolean;
  onClose: () => void;
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

export function BytePickerModal({ open, onClose, selectedSlot, onSelectSlot, totalPool, userBetSlot, phase, winnerSlot, disabled }: Props) {
  const isSettled = phase === 'SETTLED' && winnerSlot !== undefined;

  const handleSelect = (i: number) => {
    onSelectSlot(i);
    if (!isSettled) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(6,6,15,0.97)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: 8, flexShrink: 0 }}>
            <div className="font-display font-black tracking-widest" style={{ fontSize: '1rem' }}>
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

            <div className="flex items-center gap-3">
              {totalPool > 0 && (
                <span className="font-mono font-bold" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
                  {(totalPool / 100_000_000).toFixed(4)} BTC
                </span>
              )}
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg border"
                style={{ width: 36, height: 36, background: '#0a0a1e', borderColor: '#1e2048', cursor: 'pointer', color: '#a0a8c8' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Grid container — fills remaining space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(16, 1fr)', gap: 3, marginBottom: 3, flexShrink: 0 }}>
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

            {/* 16x16 grid — each row stretches to fill */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minHeight: 0 }}>
              {Array.from({ length: 16 }).map((_, row) => (
                <div
                  key={row}
                  style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '24px repeat(16, 1fr)',
                    gap: 3,
                    minHeight: 0,
                  }}
                >
                  <div
                    className="font-mono font-bold flex items-center justify-center"
                    style={{ fontSize: '0.65rem', color: '#6872a0' }}
                  >
                    {NIB[row]}
                  </div>

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
                        onClick={() => handleSelect(i)}
                        disabled={disabled}
                        whileHover={!disabled ? { scale: 1.15, zIndex: 10 } : undefined}
                        whileTap={!disabled ? { scale: 0.9 } : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4,
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
                          minHeight: 0,
                        }}
                      >
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

                        <span
                          className="font-mono font-bold"
                          style={{
                            fontSize: 'clamp(0.55rem, 1.2vw, 0.8rem)',
                            lineHeight: 1,
                            color: isWinner ? '#fff'
                              : isLoser ? '#2a2a44'
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
