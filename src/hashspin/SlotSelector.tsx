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

export function SlotSelector({ selectedSlot, onSelectSlot, userBetSlot, phase, winnerSlot, disabled }: Props) {
  const isSettled = phase === 'SETTLED' && winnerSlot !== undefined;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const color = slotColor(i);
        const isSelected = selectedSlot === i;
        const isBet = userBetSlot === i;
        const isWinner = isSettled && winnerSlot === i;
        const isLoser = isSettled && winnerSlot !== i;

        return (
          <motion.button
            key={i}
            onClick={() => onSelectSlot(i)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.12 } : undefined}
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 0',
              borderRadius: 6,
              border: `1.5px solid ${isWinner ? '#fff' : isSelected || isBet ? color : '#1e2048'}`,
              background: isWinner ? `${color}33` : isLoser ? 'rgba(8,8,24,0.5)' : isSelected || isBet ? `${color}15` : '#0a0a1e',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: isLoser && !isBet ? 0.3 : 1,
              transition: 'all 0.15s',
              boxShadow: isWinner ? `0 0 12px ${color}66` : isSelected || isBet ? `0 0 8px ${color}33` : 'none',
            }}
          >
            <span
              className="font-display font-black"
              style={{
                fontSize: '0.85rem',
                lineHeight: 1,
                color: isWinner ? '#fff' : isLoser ? '#2a2a44' : color,
              }}
            >
              {SLOT_LABELS[i]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
