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
const fmtUsd = (sats: number, price: number) =>
  '$' + Math.round((sats / 100_000_000) * price).toLocaleString();

export function ByteInfoPanel({ selectedSlot, slotPools, totalPool, userBet, phase, winnerSlot, btcPrice }: Props) {
  const slot = selectedSlot;
  if (slot === null) return null;

  const color = byteColor(slot);
  const pool = slotPools[slot];
  const isWinner = phase === 'SETTLED' && winnerSlot === slot;
  const isLoser = phase === 'SETTLED' && winnerSlot !== undefined && winnerSlot !== slot;
  const userBetOnThis = userBet?.slot === slot;
  const userWon = isWinner && userBetOnThis;

  const multiplier = pool > 0 ? (totalPool * 0.999) / pool : 0;
  const potentialWin = userBet && userBetOnThis && multiplier > 0
    ? userBet.amount * multiplier
    : 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slot}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: isWinner ? `${color}88` : `${color}30`,
          background: isWinner
            ? `linear-gradient(135deg, ${color}15 0%, #0c0c1e 100%)`
            : 'linear-gradient(135deg, #0c0c1e 0%, #08081a 100%)',
          boxShadow: isWinner ? `0 0 30px ${color}33, 0 0 60px ${color}11` : 'none',
        }}
      >
        <div style={{ padding: '16px 20px' }}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="font-display font-black"
                style={{
                  fontSize: '1.6rem',
                  lineHeight: 1,
                  color,
                  textShadow: `0 0 16px ${color}88`,
                }}
              >
                {BYTE_LABELS[slot]}
              </div>
              <div>
                <div className="font-display text-xs tracking-widest" style={{ color: '#a0a8c8' }}>
                  BYTE 0x{BYTE_LABELS[slot]}
                </div>
                {userBetOnThis && (
                  <div className="font-mono text-xs font-bold mt-0.5" style={{ color }}>
                    YOUR BET: {fmtBtc(userBet!.amount)} BTC
                  </div>
                )}
              </div>
            </div>

            {isWinner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-display text-xs font-bold tracking-wider"
                style={{
                  background: `${color}22`,
                  border: `1px solid ${color}66`,
                  color,
                }}
              >
                <Trophy size={12} />
                WINNER
              </motion.div>
            )}
            {isLoser && (
              <div
                className="px-3 py-1.5 rounded-full font-display text-xs font-bold tracking-wider"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#3a4060',
                }}
              >
                LOST
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="flex gap-5 flex-wrap">
            <div>
              <div className="font-mono text-xs" style={{ color: '#6872a0' }}>POOL</div>
              <div className="font-mono font-bold" style={{ color: '#e8eeff', fontSize: '0.95rem' }}>
                {fmtBtc(pool)} BTC
              </div>
              {btcPrice && pool > 0 && (
                <div className="font-mono text-xs" style={{ color: '#a0a8c8' }}>
                  {fmtUsd(pool, btcPrice)}
                </div>
              )}
            </div>

            <div>
              <div className="font-mono text-xs" style={{ color: '#6872a0' }}>MULTIPLIER</div>
              <div
                className="font-display font-black"
                style={{ fontSize: '1.1rem', color: pool > 0 ? color : '#3a4060' }}
              >
                {pool > 0 ? `${multiplier >= 100 ? Math.round(multiplier) : multiplier.toFixed(1)}x` : '—'}
              </div>
            </div>

            {userBetOnThis && potentialWin > 0 && (
              <div>
                <div className="font-mono text-xs" style={{ color: '#6872a0' }}>IF YOU WIN</div>
                <div className="font-mono font-bold" style={{ color, fontSize: '0.95rem' }}>
                  {fmtBtc(potentialWin)} BTC
                </div>
                {btcPrice && (
                  <div className="font-mono text-xs" style={{ color: `${color}aa` }}>
                    {fmtUsd(potentialWin, btcPrice)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Claim button */}
          {userWon && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn w-full mt-4"
              style={{
                padding: '14px',
                fontSize: '0.9rem',
                background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
                border: `1.5px solid ${color}`,
                color,
                boxShadow: `0 0 20px ${color}44`,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${color}66` }}
              whileTap={{ scale: 0.97 }}
            >
              <Trophy size={16} />
              CLAIM WINNINGS
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
