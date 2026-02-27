const SIZE = 180;

export function LogoSpin({ size = SIZE }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {/* Spinning wheel */}
      <svg
        viewBox="0 0 280 280"
        width={size}
        height={size}
        style={{ animation: 'wheel-spin 3.6s linear infinite' }}
      >
        <defs>
          <filter id="sp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="sp-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="sp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bf00ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>

        {/* Outer rim */}
        <circle cx="140" cy="140" r="118" fill="none" stroke="url(#sp-grad)" strokeWidth="5" filter="url(#sp-glow)" opacity="0.8" />
        <circle cx="140" cy="140" r="112" fill="none" stroke="url(#sp-grad)" strokeWidth="1.5" opacity="0.35" />

        {/* Alternating segment fills */}
        <g opacity="0.6">
          <path d="M140 140 L140 28 A112 112 0 0 1 219 68 Z" fill="#bf00ff" opacity="0.08" />
          <path d="M140 140 L219 68 A112 112 0 0 1 252 140 Z" fill="#9020d0" opacity="0.06" />
          <path d="M140 140 L252 140 A112 112 0 0 1 219 212 Z" fill="#6040c0" opacity="0.08" />
          <path d="M140 140 L219 212 A112 112 0 0 1 140 252 Z" fill="#3060b0" opacity="0.06" />
          <path d="M140 140 L140 252 A112 112 0 0 1 61 212 Z" fill="#0080a0" opacity="0.08" />
          <path d="M140 140 L61 212 A112 112 0 0 1 28 140 Z" fill="#00a0b0" opacity="0.06" />
          <path d="M140 140 L28 140 A112 112 0 0 1 61 68 Z" fill="#00c0c0" opacity="0.08" />
          <path d="M140 140 L61 68 A112 112 0 0 1 140 28 Z" fill="#00e5ff" opacity="0.06" />
        </g>

        {/* 16 spokes */}
        <g stroke="url(#sp-grad)" strokeWidth="1" opacity="0.4">
          <line x1="140" y1="28" x2="140" y2="252" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(22.5 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(45 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(67.5 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(90 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(112.5 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(135 140 140)" />
          <line x1="140" y1="28" x2="140" y2="252" transform="rotate(157.5 140 140)" />
        </g>

        {/* Ball track */}
        <circle cx="140" cy="140" r="88" fill="none" stroke="url(#sp-grad)" strokeWidth="1.8" opacity="0.45" />

        {/* Ball pockets */}
        <g fill="none" stroke="url(#sp-grad)" strokeWidth="1" opacity="0.3">
          <circle cx="140" cy="52" r="5" /><circle cx="174" cy="55" r="5" />
          <circle cx="204" cy="70" r="5" /><circle cx="224" cy="96" r="5" />
          <circle cx="228" cy="140" r="5" /><circle cx="224" cy="184" r="5" />
          <circle cx="204" cy="210" r="5" /><circle cx="174" cy="225" r="5" />
          <circle cx="140" cy="228" r="5" /><circle cx="106" cy="225" r="5" />
          <circle cx="76" cy="210" r="5" /><circle cx="56" cy="184" r="5" />
          <circle cx="52" cy="140" r="5" /><circle cx="56" cy="96" r="5" />
          <circle cx="76" cy="70" r="5" /><circle cx="106" cy="55" r="5" />
        </g>

        {/* Hub */}
        <circle cx="140" cy="140" r="38" fill="rgba(191,0,255,0.05)" stroke="url(#sp-grad)" strokeWidth="2.5" filter="url(#sp-soft)" opacity="0.7" />
        <circle cx="140" cy="140" r="24" fill="rgba(191,0,255,0.03)" stroke="#bf00ff" strokeWidth="1" opacity="0.35" />
        <circle cx="140" cy="140" r="8" fill="#bf00ff" filter="url(#sp-glow)" opacity="0.85" />
        <circle cx="140" cy="140" r="4" fill="#e080ff" opacity="0.6" />
      </svg>

      {/* Ball — stays still while wheel spins behind it */}
      <svg
        viewBox="0 0 280 280"
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="ball-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Ball on top-right of track — appears to roll as wheel turns */}
        <circle cx="204" cy="70" r="8" fill="#00e5ff" filter="url(#ball-glow)" opacity="0.9">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 140 140"
            to="-360 140 140"
            dur="2.88s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="204" cy="70" r="4" fill="#80f0ff" opacity="0.7">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 140 140"
            to="-360 140 140"
            dur="2.88s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
