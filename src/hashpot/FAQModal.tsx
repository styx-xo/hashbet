import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, Coins, Clock, Target, Trophy } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const items = [
  {
    icon: <Zap size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />,
    title: 'What is HashPot?',
    body: 'HashPot is the ultimate jackpot game on Bitcoin. You pick an exact byte value (0x00 to 0xFF) and bet on whether the next Bitcoin block hash ends with that byte. 256 possible outcomes. One winner takes the pot. Up to ~240× payout.',
  },
  {
    icon: <Target size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />,
    title: 'How do the 256 bytes work?',
    body: 'A byte is two hexadecimal digits (00–FF), giving 256 possible values. You pick one from the 16×16 grid. When the next Bitcoin block is mined, the last two characters of its hash determine the winning byte. Each byte has a 1-in-256 (0.39%) chance of winning — that\'s what makes this a jackpot.',
  },
  {
    icon: <Clock size={20} style={{ color: '#ff6b00', flexShrink: 0 }} />,
    title: 'When does the round end?',
    body: 'The timer counts up from the last Bitcoin block. When the next block is mined — usually around 10 minutes — betting closes and the winning byte is drawn. You can bet any time while betting is open.',
  },
  {
    icon: <Coins size={20} style={{ color: '#ff6b00', flexShrink: 0 }} />,
    title: 'How are payouts calculated?',
    body: 'All bets across all 256 byte slots go into a shared pool. If your byte wins, you receive your proportional share of the entire pool minus a tiny 0.1% house fee. With 256 outcomes, the theoretical max multiplier is ~255× — but the actual payout depends on how bets are distributed.',
  },
  {
    icon: <Trophy size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />,
    title: 'What if nobody bet on the winning byte?',
    body: 'If no one picked the winning byte, the pot rolls over. All bettors get their funds returned (minus the 0.1% fee) and the round resets. This happens frequently given the 256 outcomes — making the rounds where someone does win even more exciting.',
  },
  {
    icon: <Shield size={20} style={{ color: '#ff6b00', flexShrink: 0 }} />,
    title: 'Is this fair?',
    body: 'Completely. The result comes from Bitcoin\'s proof-of-work — the most tamper-proof source of randomness on Earth. Nobody can predict or manipulate a block hash. The settlement runs on an OPNet smart contract (Bitcoin L1). The code is the law.',
  },
];

export function HashPotFAQ({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-50 rounded-2xl border overflow-y-auto"
            style={{
              top: '50%', left: '50%',
              width: '94%', maxWidth: 820,
              maxHeight: '90vh',
              background: 'linear-gradient(160deg, #0d0d22 0%, #06060f 100%)',
              borderColor: 'rgba(245,158,11,0.25)',
              boxShadow: '0 0 80px rgba(245,158,11,0.12), 0 0 160px rgba(255,107,0,0.08)',
              padding: '44px 44px',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: '-48%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.94, y: '-48%', x: '-50%' }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-display font-black tracking-widest" style={{ fontSize: '2.2rem', lineHeight: 1 }}>
                  <span style={{ background: 'linear-gradient(90deg, #f59e0b, #ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    HOW IT WORKS
                  </span>
                </h2>
                <p className="font-hero font-medium mt-2" style={{ fontSize: '1rem', color: '#a0a8c8' }}>
                  Everything you need to know about HashPot
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border p-2.5 transition-colors"
                style={{ borderColor: 'rgba(245,158,11,0.25)', color: '#a0a8c8', background: 'transparent', cursor: 'pointer', flexShrink: 0, marginLeft: 16 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '20px 24px' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {item.icon}
                    <span className="font-display font-black tracking-wider" style={{ fontSize: '1.15rem', color: '#e8eeff', lineHeight: 1.2 }}>
                      {item.title}
                    </span>
                  </div>
                  <p
                    className="font-hero"
                    style={{
                      fontSize: '0.95rem',
                      color: '#b0b8d4',
                      lineHeight: 1.75,
                      letterSpacing: '0.01em',
                      paddingLeft: 32,
                    }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
