import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { SLOT_LABELS, slotColor } from './types';

const QUICK = ['0.001', '0.005', '0.01', '0.05', '0.1'];

const usd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBet: () => void;
  selectedSlot: number | null;
  userBet?: { slot: number; amount: number } | null;
  disabled?: boolean;
  btcPrice?: number | null;
}

export function SpinBetInput({ value, onChange, onBet, selectedSlot, userBet, disabled, btcPrice }: Props) {
  const amount = parseFloat(value) || 0;
  const isValid = amount >= 0.0001 && selectedSlot !== null;
  const amountSats = Math.round(amount * 100_000_000);

  const slotCol = selectedSlot !== null ? slotColor(selectedSlot) : '#3a4060';

  return (
    <AnimatePresence mode="wait">
      {userBet ? (
        <motion.div
          key="confirmed"
          className="flex flex-col items-center gap-4 py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle size={36} style={{ color: slotColor(userBet.slot) }} />
          <div className="text-center">
            <div className="font-display text-xs tracking-widest text-text-dim mb-2">BET PLACED</div>
            <div className="font-display font-black text-3xl tracking-wider" style={{ color: slotColor(userBet.slot) }}>
              SLOT {SLOT_LABELS[userBet.slot]}
            </div>
            <div className="font-mono font-bold text-lg mt-1" style={{ color: '#e8eeff' }}>
              {(userBet.amount / 100_000_000).toFixed(4)} BTC
            </div>
            {btcPrice && (
              <div className="font-mono text-sm mt-1" style={{ color: '#6872a0' }}>
                {usd(userBet.amount, btcPrice)}
              </div>
            )}
            <div className="font-mono text-sm text-text-dim mt-3 animate-timer-pulse">
              Waiting for the wheel to spin...
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="input"
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {/* Label */}
          <div className="font-display font-black tracking-widest text-center" style={{ fontSize: '1.3rem' }}>
            <span
              style={{
                background: 'linear-gradient(90deg, #00e5ff, #bf00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PLACE YOUR BET
            </span>
          </div>

          {/* Selected slot indicator */}
          {selectedSlot !== null && (
            <div className="text-center">
              <span className="font-display text-sm tracking-wider" style={{ color: '#a0a8c8' }}>
                SLOT{' '}
              </span>
              <span
                className="font-display font-black text-2xl"
                style={{ color: slotCol, textShadow: `0 0 12px ${slotCol}88` }}
              >
                {SLOT_LABELS[selectedSlot]}
              </span>
            </div>
          )}

          {/* Amount input */}
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
                style={{ padding: '14px 50px', fontSize: '1.35rem', fontWeight: 700 }}
                placeholder="0.001"
              />
              <span
                className="absolute right-5 top-1/2 -translate-y-1/2 font-mono font-bold"
                style={{ color: '#3a4060', fontSize: '1rem' }}
              >
                BTC
              </span>
            </div>

            {btcPrice && amountSats > 0 && (
              <div className="text-center font-mono font-bold" style={{ color: '#c4ccee', fontSize: '1.05rem', marginTop: 2 }}>
                ≈ {usd(amountSats, btcPrice)}
              </div>
            )}

            {/* Quick amounts */}
            <div className="flex gap-2 justify-center flex-wrap">
              {QUICK.map(v => (
                <button key={v} onClick={() => onChange(v)} disabled={disabled} className="btn-ghost px-4 py-2 text-sm">
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Bet button */}
          <motion.button
            className="btn"
            style={{
              padding: '16px',
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
            {selectedSlot !== null ? `BET ON SLOT ${SLOT_LABELS[selectedSlot]}` : 'SELECT A SLOT FIRST'}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
