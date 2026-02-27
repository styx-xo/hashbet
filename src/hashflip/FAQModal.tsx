import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, TrendingUp, Zap, Shield, Coins, Clock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const items = [
  {
    icon: <Zap size={20} style={{ color: '#00e5ff', flexShrink: 0 }} />,
    title: 'What is HashFlip?',
    body: 'HashFlip is a betting game where you predict a number hidden inside the next Bitcoin block. Every ~10 minutes, Bitcoin miners produce a new block. The last byte of that block\'s hash — a number from 0 to 255 — decides who wins. Nobody can predict or manipulate it in advance.',
  },
  {
    icon: <TrendingDown size={20} style={{ color: '#00e5ff', flexShrink: 0 }} />,
    title: 'LOW vs HIGH — what am I betting on?',
    body: 'The last byte is a number between 0 and 255. Bet LOW if you think it will be 0–127. Bet HIGH if you think it will be 128–255. It\'s shown on screen as a hex value (e.g. 0x3F = 63 → LOW wins, 0xC2 = 194 → HIGH wins). Each side has a 50% chance.',
  },
  {
    icon: <Clock size={20} style={{ color: '#bf00ff', flexShrink: 0 }} />,
    title: 'When does the round end?',
    body: 'The timer counts up from 0, showing how long it\'s been since the last Bitcoin block. When the next block is mined — usually around 10 minutes, but random — betting closes instantly and the result is revealed. You can bet any time while the timer is running.',
  },
  {
    icon: <Coins size={20} style={{ color: '#bf00ff', flexShrink: 0 }} />,
    title: 'How are payouts calculated?',
    body: 'All bets on both sides go into a shared pool. If your side wins, you receive your proportional share of the losing side\'s pool. A 0.1% house fee is deducted at settlement. The multiplier shown (e.g. 1.96×) is your estimated return if you bet now — it shifts live as more bets come in.',
  },
  {
    icon: <TrendingUp size={20} style={{ color: '#00e5ff', flexShrink: 0 }} />,
    title: 'How do I claim my winnings?',
    body: 'After the round settles, a CLAIM WINNINGS button appears on the winning side panel. Connect your Bitcoin wallet and click it to receive your payout. Winnings are sent directly to your address — no middlemen.',
  },
  {
    icon: <Shield size={20} style={{ color: '#bf00ff', flexShrink: 0 }} />,
    title: 'Is this fair and trustless?',
    body: 'Yes. The result comes from a real Bitcoin block hash — one of the most tamper-proof sources of randomness in existence. The settlement logic runs on a smart contract via OPNet (Bitcoin Layer 1). No one, including the developers, can alter or delay the outcome.',
  },
];

export function HashFlipFAQ({ open, onClose }: Props) {
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
              borderColor: 'rgba(0,229,255,0.25)',
              boxShadow: '0 0 80px rgba(0,229,255,0.12), 0 0 160px rgba(191,0,255,0.08)',
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
                  <span style={{ background: 'linear-gradient(90deg, #00e5ff, #bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    HOW IT WORKS
                  </span>
                </h2>
                <p className="font-mono mt-2" style={{ fontSize: '1rem', color: '#a0a8c8' }}>
                  Everything you need to know before you bet
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border p-2.5 transition-colors"
                style={{ borderColor: 'rgba(0,229,255,0.25)', color: '#a0a8c8', background: 'transparent', cursor: 'pointer', flexShrink: 0, marginLeft: 16 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border p-5"
                  style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {item.icon}
                    <span className="font-display font-black tracking-wide" style={{ fontSize: '1.2rem', color: '#e8eeff' }}>
                      {item.title}
                    </span>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: '1rem', color: '#c4ccee', fontFamily: 'inherit' }}>
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
