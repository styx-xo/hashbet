const SIZE = 180;

export function LogoPot({ size = SIZE }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 280 260" width={size} height={size}>
        <defs>
          <filter id="pt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="pt-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="pt-spark" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="pt-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="pt-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
          </linearGradient>
          <radialGradient id="pt-burst" cx="50%" cy="20%" r="65%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pulsing background burst */}
        <circle cx="140" cy="95" r="120" fill="url(#pt-burst)">
          <animate attributeName="r" values="115;130;115" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Trophy body — gentle float */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="4s" repeatCount="indefinite" />

          {/* Cup */}
          <path d="M68 85 L78 182 C78 200 105 216 140 216 C175 216 202 200 202 182 L212 85 Z"
                fill="url(#pt-fill)" stroke="url(#pt-gold)" strokeWidth="3" filter="url(#pt-glow)" />
          {/* Rim */}
          <ellipse cx="140" cy="85" rx="74" ry="14" fill="rgba(245,158,11,0.08)" stroke="url(#pt-gold)" strokeWidth="2.5" filter="url(#pt-soft)" />
          {/* Band */}
          <path d="M88 140 L192 140" stroke="#f59e0b" strokeWidth="0.8" opacity="0.2" />
          {/* Handles */}
          <path d="M68 93 C34 93 26 126 44 148 C54 160 70 160 78 152" fill="none" stroke="#f59e0b" strokeWidth="3" filter="url(#pt-soft)" opacity="0.7" />
          <path d="M212 93 C246 93 254 126 236 148 C226 160 210 160 202 152" fill="none" stroke="#f59e0b" strokeWidth="3" filter="url(#pt-soft)" opacity="0.7" />
          {/* Base */}
          <rect x="116" y="216" width="48" height="12" rx="4" fill="url(#pt-fill)" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
          <rect x="104" y="228" width="72" height="10" rx="5" fill="url(#pt-fill)" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />
        </g>

        {/* ── Floating ₿ coins — 6 total, staggered rise ─────── */}
        <g filter="url(#pt-soft)">
          <text fontFamily="Arial" fontSize="20" fill="#fbbf24" textAnchor="middle">
            <tspan x="95" y="68">₿</tspan>
            <animate attributeName="opacity" values="0;0.85;0.85;0" dur="3.5s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-10,-45" dur="3.5s" repeatCount="indefinite" />
          </text>

          <text fontFamily="Arial" fontSize="28" fill="#fbbf24" textAnchor="middle">
            <tspan x="140" y="55">₿</tspan>
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" begin="0.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;2,-55" dur="4s" begin="0.4s" repeatCount="indefinite" />
          </text>

          <text fontFamily="Arial" fontSize="18" fill="#fbbf24" textAnchor="middle">
            <tspan x="180" y="62">₿</tspan>
            <animate attributeName="opacity" values="0;0.75;0.75;0" dur="3s" begin="0.9s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;12,-40" dur="3s" begin="0.9s" repeatCount="indefinite" />
          </text>

          <text fontFamily="Arial" fontSize="15" fill="#fbbf24" textAnchor="middle">
            <tspan x="115" y="72">₿</tspan>
            <animate attributeName="opacity" values="0;0.7;0.7;0" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-5,-38" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
          </text>

          <text fontFamily="Arial" fontSize="22" fill="#fbbf24" textAnchor="middle">
            <tspan x="160" y="58">₿</tspan>
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur="3.8s" begin="2.1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;8,-48" dur="3.8s" begin="2.1s" repeatCount="indefinite" />
          </text>

          <text fontFamily="Arial" fontSize="14" fill="#fbbf24" textAnchor="middle">
            <tspan x="78" y="74">₿</tspan>
            <animate attributeName="opacity" values="0;0.6;0.6;0" dur="2.8s" begin="0.3s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-14,-32" dur="2.8s" begin="0.3s" repeatCount="indefinite" />
          </text>
        </g>

        {/* ── Firework burst 1 — top-left ────────────────────── */}
        <g filter="url(#pt-spark)">
          {/* Center flash */}
          <circle cx="70" cy="30" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0;1;0.8;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="r" values="0;0;3;5;0" dur="3s" begin="0s" repeatCount="indefinite" />
          </circle>
          {/* Rays shooting outward */}
          <line x1="70" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70;70;58;50" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="y2" values="30;30;18;10" dur="3s" begin="0s" repeatCount="indefinite" />
          </line>
          <line x1="70" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70;70;82;90" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="y2" values="30;30;20;14" dur="3s" begin="0s" repeatCount="indefinite" />
          </line>
          <line x1="70" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70;70;60;52" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="y2" values="30;30;38;44" dur="3s" begin="0s" repeatCount="indefinite" />
          </line>
          <line x1="70" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70;70;78;86" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="y2" values="30;30;40;48" dur="3s" begin="0s" repeatCount="indefinite" />
          </line>
          <line x1="70" y1="30" x2="70" y2="30" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.7;0" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70;70;70;70" dur="3s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="y2" values="30;30;14;6" dur="3s" begin="0s" repeatCount="indefinite" />
          </line>
        </g>

        {/* ── Firework burst 2 — top-right (offset timing) ──── */}
        <g filter="url(#pt-spark)">
          <circle cx="210" cy="22" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0;1;0.8;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="0;0;3;5;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <line x1="210" y1="22" x2="210" y2="22" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="210;210;198;190" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;22;12;4" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="210" y1="22" x2="210" y2="22" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="210;210;222;230" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;22;14;6" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="210" y1="22" x2="210" y2="22" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="210;210;200;192" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;22;32;40" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="210" y1="22" x2="210" y2="22" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.9;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="210;210;220;228" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;22;30;38" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="210" y1="22" x2="210" y2="22" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.7;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="x2" values="210;210;210;210" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;22;8;0" dur="3.4s" begin="1.5s" repeatCount="indefinite" />
          </line>
        </g>

        {/* ── Firework burst 3 — center-top (offset timing) ─── */}
        <g filter="url(#pt-spark)">
          <circle cx="140" cy="12" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0;1;0.7;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="r" values="0;0;2;4;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
          </circle>
          <line x1="140" y1="12" x2="140" y2="12" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.8;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="140;140;128;120" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="12;12;2;-4" dur="4s" begin="0.7s" repeatCount="indefinite" />
          </line>
          <line x1="140" y1="12" x2="140" y2="12" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.8;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="140;140;152;160" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="12;12;2;-4" dur="4s" begin="0.7s" repeatCount="indefinite" />
          </line>
          <line x1="140" y1="12" x2="140" y2="12" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.8;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="140;140;130;124" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="12;12;22;30" dur="4s" begin="0.7s" repeatCount="indefinite" />
          </line>
          <line x1="140" y1="12" x2="140" y2="12" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round">
            <animate attributeName="opacity" values="0;0;0.8;0" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="x2" values="140;140;150;156" dur="4s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="12;12;22;30" dur="4s" begin="0.7s" repeatCount="indefinite" />
          </line>
        </g>

        {/* ── Extra twinkling sparkles ────────────────────────── */}
        <g>
          <circle cx="82" cy="42" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.9;0" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;4;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="48" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.7;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3.5;1" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="22" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.85;0" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;4.5;1" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="28" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.6;0" dur="2.2s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3;1" dur="2.2s" begin="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="185" cy="32" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.75;0" dur="2.6s" begin="0.6s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3.5;1" dur="2.6s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="55" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.5;0" dur="3s" begin="1.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3;1" dur="3s" begin="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="225" cy="42" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.6;0" dur="2.8s" begin="2.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3.5;1" dur="2.8s" begin="2.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="15" r="2" fill="#fbbf24">
            <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3;1" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
