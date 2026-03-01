import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { SLOT_LABELS, slotColor } from './types';

const QUICK = ['0.001', '0.005', '0.01', '0.05'];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBet: () => void;
  selectedSlot: number | null;
  userBet?: { slot: number; amount: number } | null;
  disabled?: boolean;
  btcPrice?: number | null;
}

export function SpinBetInput({ value, onChange, onBet, selectedSlot, userBet, disabled }: Props) {
  const amount = parseFloat(value) || 0;
  const isValid = amount >= 0.0001 && selectedSlot !== null;
  const slotCol = selectedSlot !== null ? slotColor(selectedSlot) : '#3a4060';

  return (
    <AnimatePresence mode="wait">
      {userBet ? (
        <motion.div
          key="confirmed"
          className="flex items-center gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle size={16} style={{ color: slotColor(userBet.slot) }} />
          <span className="font-display font-black text-sm" style={{ color: slotColor(userBet.slot) }}>
            {SLOT_LABELS[userBet.slot]}
          </span>
          <span className="font-mono font-bold text-sm" style={{ color: '#e8eeff' }}>
            {(userBet.amount / 100_000_000).toFixed(4)} BTC
          </span>
          <span className="font-mono text-xs animate-timer-pulse" style={{ color: '#6872a0' }}>
            Waiting...
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="input"
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Input row: amount + bet button */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                min="0.0001"
                step="0.001"
                className="input-neon text-center"
                style={{ padding: '8px 40px 8px 10px', fontSize: '0.95rem', fontWeight: 700 }}
                placeholder="0.001"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono font-bold" style={{ color: '#3a4060', fontSize: '0.7rem' }}>
                BTC
              </span>
            </div>
            <motion.button
              className="btn"
              style={{
                padding: '8px 14px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                background: selectedSlot !== null ? `linear-gradient(135deg, ${slotCol}33 0%, #0c0c1e 100%)` : '#1a1a30',
                border: `1px solid ${selectedSlot !== null ? slotCol : '#2d3270'}`,
                color: selectedSlot !== null ? slotCol : '#3a4060',
              }}
              onClick={onBet}
              disabled={disabled || !isValid}
              whileHover={isValid ? { scale: 1.03 } : undefined}
              whileTap={isValid ? { scale: 0.96 } : undefined}
            >
              {selectedSlot !== null ? `BET ${SLOT_LABELS[selectedSlot]}` : 'SELECT'}
            </motion.button>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-1.5 justify-center">
            {QUICK.map(v => (
              <button key={v} onClick={() => onChange(v)} disabled={disabled} className="btn-ghost px-2 py-1" style={{ fontSize: '0.65rem' }}>
                {v}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
