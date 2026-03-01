import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { BYTE_LABELS, byteColor } from './types';

const QUICK = ['0.001', '0.005', '0.01', '0.05'];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBet: () => void;
  selectedSlot: number | null;
  userBet?: { slot: number; amount: number } | null;
  disabled?: boolean;
  btcPrice?: number | null;
  compact?: boolean;
}

export function PotBetInput({ value, onChange, onBet, selectedSlot, userBet, disabled, compact }: Props) {
  const amount = parseFloat(value) || 0;
  const isValid = amount >= 0.0001 && selectedSlot !== null;

  const slotCol = selectedSlot !== null ? byteColor(selectedSlot) : '#3a4060';

  if (compact) {
    return (
      <AnimatePresence mode="wait">
        {userBet ? (
          <motion.div
            key="confirmed"
            className="flex flex-col items-center gap-1 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={20} style={{ color: byteColor(userBet.slot) }} />
              <span className="font-display font-black tracking-widest" style={{ fontSize: '1.2rem', color: byteColor(userBet.slot), textShadow: `0 0 16px ${byteColor(userBet.slot)}99` }}>
                BET PLACED — 0x{BYTE_LABELS[userBet.slot]}
              </span>
            </div>
            <span className="font-mono font-bold" style={{ fontSize: '1rem', color: '#e8eeff' }}>
              {(userBet.amount / 100_000_000).toFixed(4)} BTC
            </span>
            <motion.span
              className="font-display text-xs tracking-widest"
              style={{ color: '#6872a0' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              WAITING FOR NEXT BLOCK...
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Input row */}
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
              <div className="flex gap-1">
                {QUICK.map(v => (
                  <button key={v} onClick={() => onChange(v)} disabled={disabled} className="btn-ghost px-2 py-1" style={{ fontSize: '0.6rem' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Bet button */}
            <motion.button
              className="btn w-full"
              style={{
                padding: '10px',
                fontSize: '0.8rem',
                background: selectedSlot !== null
                  ? 'linear-gradient(135deg, #f59e0b 0%, #ff6b00 100%)'
                  : 'linear-gradient(135deg, #1a1a30 0%, #0c0c1e 100%)',
                border: `1px solid ${selectedSlot !== null ? '#f59e0b' : '#2d3270'}`,
                color: selectedSlot !== null ? '#06060f' : '#3a4060',
                fontWeight: selectedSlot !== null ? 800 : 600,
              }}
              onClick={onBet}
              disabled={disabled || !isValid}
              whileHover={isValid ? { scale: 1.02 } : undefined}
              whileTap={isValid ? { scale: 0.97 } : undefined}
            >
              {selectedSlot !== null ? `BET ON 0x${BYTE_LABELS[selectedSlot]}` : 'SELECT A BYTE FIRST'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Full-size mode (unused currently but kept for flexibility)
  return (
    <AnimatePresence mode="wait">
      {userBet ? (
        <motion.div
          key="confirmed"
          className="flex flex-col items-center gap-3 py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle size={32} style={{ color: byteColor(userBet.slot) }} />
          <div className="text-center">
            <div className="font-display text-xs tracking-widest text-text-dim mb-2">BET PLACED</div>
            <div className="font-display font-black text-2xl tracking-wider" style={{ color: byteColor(userBet.slot) }}>
              BYTE 0x{BYTE_LABELS[userBet.slot]}
            </div>
            <div className="font-mono font-bold text-lg mt-1" style={{ color: '#e8eeff' }}>
              {(userBet.amount / 100_000_000).toFixed(4)} BTC
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="input"
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="font-display font-black tracking-widest text-center" style={{ fontSize: '1.4rem' }}>
            <span
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #ff6b00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PLACE YOUR BET
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                min="0.0001"
                step="0.001"
                className="input-neon text-center"
                style={{ padding: '16px 60px', fontSize: '1.4rem', fontWeight: 700 }}
                placeholder="0.001"
              />
              <span
                className="absolute right-5 top-1/2 -translate-y-1/2 font-mono font-bold"
                style={{ color: '#3a4060', fontSize: '0.95rem' }}
              >
                BTC
              </span>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              {QUICK.map(v => (
                <button key={v} onClick={() => onChange(v)} disabled={disabled} className="btn-ghost px-3 py-1.5 text-sm">
                  {v}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            className="btn"
            style={{
              padding: '18px',
              fontSize: '0.95rem',
              background: selectedSlot !== null
                ? `linear-gradient(135deg, ${slotCol}33 0%, #0c0c1e 100%)`
                : 'linear-gradient(135deg, #1a1a30 0%, #0c0c1e 100%)',
              border: `1px solid ${selectedSlot !== null ? slotCol : '#2d3270'}`,
              color: selectedSlot !== null ? slotCol : '#3a4060',
              width: '100%',
              boxShadow: selectedSlot !== null ? `0 0 20px ${slotCol}33` : 'none',
            }}
            onClick={onBet}
            disabled={disabled || !isValid}
            whileHover={isValid ? { scale: 1.02, y: -2 } : undefined}
            whileTap={isValid ? { scale: 0.97 } : undefined}
          >
            {selectedSlot !== null ? `BET ON BYTE 0x${BYTE_LABELS[selectedSlot]}` : 'SELECT A BYTE FIRST'}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
