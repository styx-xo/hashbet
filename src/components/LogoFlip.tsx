const SIZE = 180;
const R = 72; // coin radius

export function LogoFlip({ size = SIZE }: { size?: number }) {
  const scale = size / SIZE;
  return (
    <div style={{ width: size, height: size, perspective: 600 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'coin-flip 3s ease-in-out infinite',
        }}
      >
        {/* Front — teal UP */}
        <svg
          viewBox="0 0 180 180"
          width={size}
          height={size}
          style={{ position: 'absolute', backfaceVisibility: 'hidden' }}
        >
          <defs>
            <filter id="fl-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="fl-bg" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.03" />
            </radialGradient>
          </defs>
          {/* Coin body */}
          <circle cx="90" cy="90" r={R} fill="url(#fl-bg)" stroke="#00e5ff" strokeWidth="3" filter="url(#fl-glow)" />
          <circle cx="90" cy="90" r={R - 12} fill="none" stroke="#00e5ff" strokeWidth="1.2" opacity="0.3" />
          {/* UP arrow */}
          <polygon points="90,42 68,78 80,78 80,100 100,100 100,78 112,78" fill="#00e5ff" opacity="0.9" filter="url(#fl-glow)" />
          {/* HIGH label */}
          <text x="90" y="125" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="700" fontSize="14" fill="#00e5ff" opacity="0.7" letterSpacing="3">HIGH</text>
        </svg>

        {/* Back — purple DOWN */}
        <svg
          viewBox="0 0 180 180"
          width={size}
          height={size}
          style={{ position: 'absolute', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <defs>
            <filter id="fl-glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="fl-bg2" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#bf00ff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#bf00ff" stopOpacity="0.03" />
            </radialGradient>
          </defs>
          {/* Coin body */}
          <circle cx="90" cy="90" r={R} fill="url(#fl-bg2)" stroke="#bf00ff" strokeWidth="3" filter="url(#fl-glow2)" />
          <circle cx="90" cy="90" r={R - 12} fill="none" stroke="#bf00ff" strokeWidth="1.2" opacity="0.3" />
          {/* DOWN arrow */}
          <polygon points="90,138 68,102 80,102 80,80 100,80 100,102 112,102" fill="#bf00ff" opacity="0.9" filter="url(#fl-glow2)" />
          {/* LOW label */}
          <text x="90" y="68" textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="700" fontSize="14" fill="#bf00ff" opacity="0.7" letterSpacing="3">LOW</text>
        </svg>
      </div>
    </div>
  );
}
