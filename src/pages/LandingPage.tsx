import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogoFlip } from '../components/LogoFlip';
import { LogoSpin } from '../components/LogoSpin';
import { LogoPot } from '../components/LogoPot';
import { type ReactNode } from 'react';

const games: {
  name: string;
  path: string;
  color: string;
  dimBg: string;
  borderColor: string;
  hoverBorder: string;
  glowColor: string;
  icon: ReactNode;
}[] = [
  {
    name: 'HASHFLIP',
    path: '/flip',
    color: '#00e5ff',
    dimBg: '#001a1f',
    borderColor: 'rgba(0,229,255,0.3)',
    hoverBorder: 'rgba(0,229,255,0.6)',
    glowColor: 'rgba(0,229,255,0.15)',
    icon: <LogoFlip size={180} />,
  },
  {
    name: 'HASHSPIN',
    path: '/spin',
    color: '#bf00ff',
    dimBg: '#190030',
    borderColor: 'rgba(191,0,255,0.3)',
    hoverBorder: 'rgba(191,0,255,0.6)',
    glowColor: 'rgba(191,0,255,0.15)',
    icon: <LogoSpin size={180} />,
  },
  {
    name: 'HASHPOT',
    path: '/pot',
    color: '#f59e0b',
    dimBg: '#1a1200',
    borderColor: 'rgba(245,158,11,0.3)',
    hoverBorder: 'rgba(245,158,11,0.6)',
    glowColor: 'rgba(245,158,11,0.15)',
    icon: <LogoPot size={180} />,
  },
];

export function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(48px, 6vh, 80px)', padding: 'clamp(24px, 3vh, 40px) 0 72px' }}>
      {/* ── Hero ──────────────────────────────────── */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        {/* Ambient glow */}
        <div
          className="animate-hero-glow"
          style={{
            position: 'absolute',
            top: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(0,229,255,0.18) 0%, rgba(191,0,255,0.1) 40%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* HASHBET */}
        <motion.h1
          className="font-display font-black tracking-widest animate-flicker animate-neon-breathe"
          style={{
            fontSize: 'clamp(4.5rem, 12vw, 8.5rem)',
            lineHeight: 1,
            letterSpacing: '0.22em',
            position: 'relative',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ color: '#00e5ff', textShadow: '0 0 50px rgba(0,229,255,0.8), 0 0 100px rgba(0,229,255,0.35), 0 0 160px rgba(0,229,255,0.12)' }}>
            HASH
          </span>
          <span style={{ color: '#bf00ff', textShadow: '0 0 50px rgba(191,0,255,0.8), 0 0 100px rgba(191,0,255,0.35), 0 0 160px rgba(191,0,255,0.12)' }}>
            BET
          </span>
          {/* Shine sweep — clipped to letter shapes via background-clip:text */}
          <span
            aria-hidden="true"
            className="animate-title-shine"
            style={{
              position: 'absolute',
              inset: 0,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              pointerEvents: 'none',
              letterSpacing: '0.22em',
            }}
          >
            HASHBET
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-hero font-medium mt-4"
          style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.85rem)',
            color: '#c4ccee',
            letterSpacing: '0.04em',
            lineHeight: 1.5,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Bet on the next{' '}
          <span
            className="animate-text-shimmer font-bold"
            style={{
              background: 'linear-gradient(90deg, #00e5ff, #bf00ff, #00e5ff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bitcoin block hash.
          </span>
        </motion.p>

        {/* Pill badges */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-7 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: 'PROVABLY FAIR', color: '#00e5ff' },
            { label: 'BITCOIN L1', color: '#bf00ff' },
            { label: 'NO CUSTODY', color: '#7c3aff' },
          ].map((pill) => (
            <span
              key={pill.label}
              className="font-hero font-semibold tracking-wider px-5 py-2 rounded-full border"
              style={{
                fontSize: '0.85rem',
                color: pill.color,
                borderColor: `${pill.color}30`,
                background: `${pill.color}08`,
              }}
            >
              {pill.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Game cards ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, width: '100%', maxWidth: 1140, padding: '0 16px' }}>
        {games.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
          >
            <Link to={game.path} style={{ textDecoration: 'none', display: 'block' }}>
              <motion.div
                className="rounded-2xl border relative overflow-hidden"
                style={{
                  background: `linear-gradient(170deg, ${game.dimBg} 0%, #06060f 60%)`,
                  borderColor: game.borderColor,
                  padding: '44px 32px 36px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 20,
                }}
                whileHover={{
                  scale: 1.04,
                  borderColor: game.hoverBorder,
                  boxShadow: `0 0 50px ${game.glowColor}, 0 0 100px ${game.glowColor}`,
                  y: -8,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {/* Corner glow */}
                <div
                  className="absolute top-0 right-0 pointer-events-none"
                  style={{ width: 220, height: 220, background: `radial-gradient(circle at top right, ${game.color}18 0%, transparent 70%)` }}
                />
                <div
                  className="absolute bottom-0 left-0 pointer-events-none"
                  style={{ width: 160, height: 160, background: `radial-gradient(circle at bottom left, ${game.color}08 0%, transparent 70%)` }}
                />

                {/* Animated logo */}
                {game.icon}

                {/* Game name */}
                <div
                  className="font-display font-black tracking-widest"
                  style={{
                    fontSize: '2.2rem',
                    lineHeight: 1,
                    color: game.color,
                    textShadow: `0 0 28px ${game.color}70, 0 0 56px ${game.color}30`,
                  }}
                >
                  {game.name}
                </div>

                {/* Play button */}
                <div
                  className="font-display font-bold tracking-widest w-full rounded-xl border py-4"
                  style={{
                    fontSize: '1rem',
                    borderColor: `${game.color}45`,
                    color: game.color,
                    background: `linear-gradient(180deg, ${game.color}0d 0%, ${game.color}05 100%)`,
                  }}
                >
                  PLAY NOW
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
