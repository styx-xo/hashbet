import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, CheckCircle } from 'lucide-react';
import type { Side } from './types';

const QUICK = ['0.001', '0.005', '0.01', '0.05', '0.1'];

const usd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBet: (side: Side) => void;
  userBet?: { side: Side; amount: number } | null;
  disabled?: boolean;
  btcPrice?: number | null;
}

export function BetInput({ value, onChange, onBet, userBet, disabled, btcPrice }: Props) {
  const amount = parseFloat(value) || 0;
  const isValid = amount >= 0.0001;
  const amountSats = Math.round(amount * 100_000_000);

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
          <CheckCircle
            size={36}
            style={{ color: userBet.side === 'LOW' ? '#00e5ff' : '#bf00ff' }}
          />
          <div className="text-center">
            <div className="font-display text-xs tracking-widest text-text-dim mb-2">BET PLACED</div>
            <div
              className="font-display font-black text-3xl tracking-wider"
              style={{ color: userBet.side === 'LOW' ? '#00e5ff' : '#bf00ff' }}
            >
              {userBet.side}  —  {(userBet.amount / 100_000_000).toFixed(4)} BTC
            </div>
            {btcPrice && (
              <div className="font-mono text-sm mt-1" style={{ color: '#6872a0' }}>
                {usd(userBet.amount, btcPrice)}
              </div>
            )}
            <div className="font-mono text-sm text-text-dim mt-3">
              Waiting for block to mine...
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

          {/* Amount input + quick amounts inline */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                min="0.0001"
                step="0.001"
                className="input-neon text-center"
                style={{ padding: '12px 50px 12px 14px', fontSize: '1.15rem', fontWeight: 700 }}
                placeholder="0.001"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold"
                style={{ color: '#3a4060', fontSize: '0.8rem' }}
              >
                BTC
              </span>
            </div>
            <div className="flex gap-1.5">
              {QUICK.map(v => (
                <button
                  key={v}
                  onClick={() => onChange(v)}
                  disabled={disabled}
                  className="btn-ghost px-3 py-1.5"
                  style={{ fontSize: '0.75rem' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {btcPrice && amountSats > 0 && (
            <div className="text-center font-mono font-bold" style={{ color: '#c4ccee', fontSize: '0.85rem' }}>
              ≈ {usd(amountSats, btcPrice)}
            </div>
          )}

          {/* Bet buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="btn btn-low"
              style={{ padding: '14px', fontSize: '0.95rem' }}
              onClick={() => onBet('LOW')}
              disabled={disabled || !isValid}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <TrendingDown size={18} />
              BET LOW
            </motion.button>
            <motion.button
              className="btn btn-high"
              style={{ padding: '14px', fontSize: '0.95rem' }}
              onClick={() => onBet('HIGH')}
              disabled={disabled || !isValid}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <TrendingUp size={18} />
              BET HIGH
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
