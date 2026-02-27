import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, Coins, Blocks, Dices, TrendingUp, Wallet, Trophy, Hexagon } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const items = [
  {
    icon: <Zap size={22} style={{ color: '#00e5ff', flexShrink: 0 }} />,
    title: 'What is HashBet?',
    body: 'HashBet is a Bitcoin-native betting platform. You bet on the outcome of real Bitcoin block hashes — the most tamper-proof source of randomness ever created. No accounts, no sign-ups, no middlemen. Just connect your wallet and play.',
  },
  {
    icon: <Blocks size={22} style={{ color: '#00e5ff', flexShrink: 0 }} />,
    title: 'How does it work?',
    body: 'Every ~10 minutes, Bitcoin miners produce a new block with a unique hash. That hash is a long hexadecimal string — completely random and impossible to predict. HashBet games use the last byte (or nibble) of that hash to determine winners. You place your bet before the block is mined, and the blockchain decides the outcome.',
  },
  {
    icon: <Coins size={22} style={{ color: '#bf00ff', flexShrink: 0 }} />,
    title: 'How do payouts work?',
    body: 'All games use a pari-mutuel pool system. Every bet goes into a shared pool. When the block is mined, winners split the entire pool proportionally. A tiny 0.1% fee is taken at settlement — that\'s it. The rest goes straight to winners.',
  },
  {
    icon: <Dices size={22} style={{ color: '#bf00ff', flexShrink: 0 }} />,
    title: 'What games are available?',
    body: 'Three games, each using a different slice of the block hash:',
    games: [
      {
        name: 'HASHFLIP',
        color: '#00e5ff',
        icon: <TrendingUp size={18} style={{ color: '#00e5ff' }} />,
        desc: 'Coin flip — bet HIGH or LOW on the last byte. 50/50 odds, ~2× payout.',
      },
      {
        name: 'HASHSPIN',
        color: '#bf00ff',
        icon: <Hexagon size={18} style={{ color: '#bf00ff' }} />,
        desc: 'Roulette — pick one of 16 hex slots (0–F). 6.25% chance, up to ~16× payout.',
      },
      {
        name: 'HASHPOT',
        color: '#f59e0b',
        icon: <Trophy size={18} style={{ color: '#f59e0b' }} />,
        desc: 'Jackpot — guess the exact byte (0x00–0xFF). 256 outcomes, up to ~240× payout.',
      },
    ],
  },
  {
    icon: <Wallet size={22} style={{ color: '#7c3aff', flexShrink: 0 }} />,
    title: 'How do I play?',
    body: 'Connect a Bitcoin wallet (like OPWallet), pick a game, place your bet, and wait for the next block. If you win, claim your payout directly to your wallet. That\'s it — no deposits, no accounts, no withdrawals. Your funds are always yours.',
  },
  {
    icon: <Shield size={22} style={{ color: '#7c3aff', flexShrink: 0 }} />,
    title: 'Can anyone cheat or rig the outcome?',
    body: 'No. The result comes from Bitcoin\'s proof-of-work — the most secure computational network on Earth. Even miners can\'t choose a specific hash. All settlement logic runs on OPNet smart contracts (Bitcoin Layer 1). The code is the law — nobody can alter, delay, or reverse the outcome. Not even us.',
  },
];

export function HashBetFAQ({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-50 rounded-2xl border overflow-y-auto"
            style={{
              top: '50%', left: '50%',
              width: '94%', maxWidth: 880,
              maxHeight: '90vh',
              background: 'linear-gradient(160deg, #0d0d22 0%, #06060f 100%)',
              borderColor: 'rgba(124,58,255,0.25)',
              boxShadow: '0 0 80px rgba(0,229,255,0.1), 0 0 160px rgba(191,0,255,0.06)',
              padding: '48px 48px',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: '-48%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.94, y: '-48%', x: '-50%' }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h2 className="font-display font-black tracking-widest" style={{ fontSize: '2.4rem', lineHeight: 1 }}>
                  <span style={{ color: '#00e5ff', textShadow: '0 0 20px rgba(0,229,255,0.5)' }}>HASH</span>
                  <span style={{ color: '#bf00ff', textShadow: '0 0 20px rgba(191,0,255,0.5)' }}>BET</span>
                </h2>
                <p className="font-hero font-medium mt-3 tracking-wide" style={{ fontSize: '1.1rem', color: '#8892bb' }}>
                  Everything you need to know
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border p-3 transition-colors"
                style={{ borderColor: 'rgba(124,58,255,0.25)', color: '#a0a8c8', background: 'transparent', cursor: 'pointer', flexShrink: 0, marginLeft: 16 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(124,58,255,0.25)')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-5">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '24px 28px',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {/* Question */}
                  <div className="flex items-center gap-3 mb-4">
                    {item.icon}
                    <span
                      className="font-display font-black tracking-wider"
                      style={{ fontSize: '1.2rem', color: '#e8eeff', lineHeight: 1.2 }}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Answer */}
                  <p
                    className="font-hero"
                    style={{
                      fontSize: '1rem',
                      color: '#b0b8d4',
                      lineHeight: 1.75,
                      letterSpacing: '0.01em',
                      paddingLeft: 35,
                    }}
                  >
                    {item.body}
                  </p>

                  {/* Game cards within FAQ */}
                  {'games' in item && item.games && (
                    <div className="flex flex-col gap-3 mt-5" style={{ paddingLeft: 35 }}>
                      {item.games.map((g) => (
                        <div
                          key={g.name}
                          className="rounded-xl border flex items-start gap-4"
                          style={{
                            borderColor: `${g.color}20`,
                            background: `${g.color}06`,
                            padding: '16px 20px',
                          }}
                        >
                          <div className="mt-1" style={{ flexShrink: 0 }}>{g.icon}</div>
                          <div>
                            <span
                              className="font-display font-bold tracking-widest"
                              style={{ fontSize: '0.9rem', color: g.color }}
                            >
                              {g.name}
                            </span>
                            <p
                              className="font-hero mt-1.5"
                              style={{ fontSize: '0.95rem', color: '#9aa2c0', lineHeight: 1.6 }}
                            >
                              {g.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
