import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, CheckCircle } from 'lucide-react';
import type { Side } from './types';

const QUICK = ['0.001', '0.005', '0.01', '0.05'];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBet: (side: Side) => void;
  userBet?: { side: Side; amount: number } | null;
  disabled?: boolean;
  btcPrice?: number | null;
}

export function BetInput({ value, onChange, onBet, userBet, disabled }: Props) {
  const amount = parseFloat(value) || 0;
  const isValid = amount >= 0.0001;

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
            <CheckCircle size={20} style={{ color: userBet.side === 'LOW' ? '#00e5ff' : '#bf00ff' }} />
            <span className="font-display font-black tracking-widest" style={{ fontSize: '1.2rem', color: userBet.side === 'LOW' ? '#00e5ff' : '#bf00ff', textShadow: `0 0 16px ${userBet.side === 'LOW' ? 'rgba(0,229,255,0.6)' : 'rgba(191,0,255,0.6)'}` }}>
              BET PLACED — {userBet.side}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Input + quick amounts row */}
          <div className="flex items-center gap-2">
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

          {/* Bet buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              className="btn btn-low"
              style={{ padding: '10px', fontSize: '0.8rem' }}
              onClick={() => onBet('LOW')}
              disabled={disabled || !isValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <TrendingDown size={14} />
              LOW
            </motion.button>
            <motion.button
              className="btn btn-high"
              style={{ padding: '10px', fontSize: '0.8rem' }}
              onClick={() => onBet('HIGH')}
              disabled={disabled || !isValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <TrendingUp size={14} />
              HIGH
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
