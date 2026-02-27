import { Link } from 'react-router-dom';
import { Wifi, WifiOff, HelpCircle, ArrowLeft } from 'lucide-react';

interface Props {
  gameName?: string;
  isLanding: boolean;
  blockHeight: number | null;
  wsConnected: boolean;
  error?: string | null;
  onFaq: () => void;
}

export function Header({ isLanding, blockHeight, wsConnected, error, onFaq }: Props) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-dark-border"
      style={{ background: 'rgba(6,6,15,0.94)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px' }}
      >
        {/* Logo + back arrow */}
        <div className="flex items-center gap-3">
          {!isLanding ? (
            <Link
              to="/"
              className="flex items-center justify-center rounded-xl border transition-colors"
              style={{
                width: 72,
                height: 48,
                borderColor: 'rgba(0,229,255,0.25)',
                color: '#a0a8c8',
                background: 'rgba(0,229,255,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)';
                e.currentTarget.style.color = '#00e5ff';
                e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)';
                e.currentTarget.style.color = '#a0a8c8';
                e.currentTarget.style.background = 'rgba(0,229,255,0.04)';
              }}
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
            </Link>
          ) : (
            <span
              className="font-display font-bold tracking-widest"
              style={{ fontSize: '0.95rem', color: '#6872a0' }}
            >
              POWERED BY{' '}
              <span style={{
                background: 'linear-gradient(90deg, #00e5ff, #bf00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                OPNET
              </span>
            </span>
          )}
        </div>

        {/* Network status */}
        <div className="flex items-center gap-3 font-mono text-sm">
          {error ? (
            <div className="flex items-center gap-2" style={{ color: '#ff4444' }}>
              <WifiOff size={13} />
              <span className="text-xs">OFFLINE</span>
            </div>
          ) : blockHeight ? (
            <div className="flex items-center gap-2 text-text-secondary">
              {wsConnected ? (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#22c55e',
                    boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                    display: 'inline-block',
                  }}
                />
              ) : (
                <Wifi size={13} style={{ color: '#f59e0b' }} />
              )}
              <span>
                BLK <span className="text-text-primary font-bold">#{blockHeight.toLocaleString()}</span>
              </span>
              {wsConnected && (
                <span className="text-xs" style={{ color: '#22c55e' }}>LIVE</span>
              )}
            </div>
          ) : (
            <span className="text-text-dim text-xs animate-pulse">CONNECTING...</span>
          )}
        </div>

        {/* FAQ button */}
        <button
          onClick={onFaq}
          className="rounded-xl border flex items-center gap-2 font-display font-black tracking-widest transition-colors"
          style={{
            padding: '10px 18px',
            fontSize: '0.95rem',
            borderColor: isLanding ? 'rgba(124,58,255,0.3)' : 'rgba(0,229,255,0.3)',
            color: '#c4ccee',
            background: isLanding ? 'rgba(124,58,255,0.05)' : 'rgba(0,229,255,0.05)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = isLanding ? 'rgba(124,58,255,0.6)' : 'rgba(0,229,255,0.6)';
            e.currentTarget.style.color = isLanding ? '#c4b5fd' : '#00e5ff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = isLanding ? 'rgba(124,58,255,0.3)' : 'rgba(0,229,255,0.3)';
            e.currentTarget.style.color = '#c4ccee';
          }}
        >
          <HelpCircle size={16} />
          HOW IT WORKS
        </button>
      </div>
    </header>
  );
}
