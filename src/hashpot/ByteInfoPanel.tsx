import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { BYTE_LABELS, byteColor } from './types';
import type { PotPhase } from './types';

interface Props {
  selectedSlot: number | null;
  slotPools: number[];
  totalPool: number;
  userBet: { slot: number; amount: number } | null;
  phase: PotPhase;
  winnerSlot?: number;
  btcPrice?: number | null;
}

const fmtBtc = (sats: number) => (sats / 100_000_000).toFixed(4);
export function ByteInfoPanel({ selectedSlot, slotPools, totalPool, userBet, phase, winnerSlot }: Props) {
  const slot = selectedSlot;
  if (slot === null) return null;

  const color = byteColor(slot);
  const pool = slotPools[slot];
  const isWinner = phase === 'SETTLED' && winnerSlot === slot;
  const isLoser = phase === 'SETTLED' && winnerSlot !== undefined && winnerSlot !== slot;
  const userBetOnThis = userBet?.slot === slot;
  const userWon = isWinner && userBetOnThis;

  const multiplier = pool > 0 ? (totalPool * 0.999) / pool : 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slot}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: isWinner ? `${color}88` : `${color}30`,
          background: isWinner
            ? `linear-gradient(135deg, ${color}15 0%, #0a0a1e 100%)`
            : '#0a0a1e',
        }}
      >
        <div style={{ padding: '10px 14px' }}>
          {/* Header + stats inline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-display font-black" style={{ fontSize: '1.2rem', lineHeight: 1, color }}>
                {BYTE_LABELS[slot]}
              </div>
              <div className="font-display tracking-widest" style={{ color: '#a0a8c8', fontSize: '0.6rem' }}>
                0x{BYTE_LABELS[slot]}
              </div>
              {userBetOnThis && (
                <div className="font-mono font-bold" style={{ color, fontSize: '0.65rem' }}>
                  BET: {fmtBtc(userBet!.amount)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono font-bold" style={{ color: '#e8eeff', fontSize: '0.8rem' }}>
                {fmtBtc(pool)} BTC
              </span>
              <span className="font-display font-black" style={{ fontSize: '1rem', color: pool > 0 ? color : '#3a4060' }}>
                {pool > 0 ? `${multiplier >= 100 ? Math.round(multiplier) : multiplier.toFixed(1)}×` : '—'}
              </span>
              {isWinner && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 font-display font-bold tracking-wider" style={{ color, fontSize: '0.7rem' }}>
                  <Trophy size={12} /> WIN
                </motion.span>
              )}
              {isLoser && (
                <span className="font-display font-bold tracking-wider" style={{ color: '#3a4060', fontSize: '0.7rem' }}>LOST</span>
              )}
            </div>
          </div>

          {/* Claim button */}
          {userWon && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn w-full mt-2"
              style={{
                padding: '8px',
                fontSize: '0.75rem',
                background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
                border: `1px solid ${color}`,
                color,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Trophy size={14} />
              CLAIM WINNINGS
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
