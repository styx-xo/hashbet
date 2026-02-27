import { motion } from 'framer-motion';
import { Wallet, CheckCircle, ChevronDown } from 'lucide-react';

interface Props {
  connected: boolean;
  address?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function truncate(addr: string) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export function ConnectWallet({ connected, address, onConnect, onDisconnect }: Props) {
  if (connected && address) {
    return (
      <motion.button
        onClick={onDisconnect}
        className="w-full rounded-2xl border font-mono text-sm flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(135deg, #001a1f 0%, #190030 100%)',
          borderColor: 'rgba(0,229,255,0.25)',
          color: '#a0a8c8',
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle size={14} style={{ color: '#00e5ff' }} />
          <span style={{ color: '#00e5ff', fontWeight: 700 }}>{truncate(address)}</span>
        </div>
        <div className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: '#6872a0' }}>
          CONNECTED <ChevronDown size={11} />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onConnect}
      className="w-full rounded-2xl font-display font-black tracking-widest flex items-center justify-center gap-3 relative overflow-hidden"
      style={{
        padding: '16px 24px',
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #001f2e 0%, #1f0040 100%)',
        border: '1px solid transparent',
        backgroundClip: 'padding-box',
        color: '#ffffff',
        cursor: 'pointer',
        boxShadow: '0 0 24px rgba(0,229,255,0.15), 0 0 48px rgba(191,0,255,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
        outline: '1px solid',
        outlineColor: 'rgba(0,229,255,0.3)',
        outlineOffset: '-1px',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 32px rgba(0,229,255,0.3), 0 0 64px rgba(191,0,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
        outlineColor: 'rgba(0,229,255,0.6)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient sweep shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(0,229,255,0.07) 50%, rgba(191,0,255,0.07) 55%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <Wallet size={20} style={{ color: '#00e5ff', flexShrink: 0 }} />
      <span
        style={{
          background: 'linear-gradient(90deg, #00e5ff, #bf00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        CONNECT WALLET
      </span>
    </motion.button>
  );
}
