import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import type { SpinRound } from './types';
import { SLOT_LABELS, slotColor } from './types';

interface Props {
  round: SpinRound | null;
  selectedSlot: number | null;
  userBetSlot: number | null;
  timerProgress: number;
}

const SIZE = 300;
const CENTER = SIZE / 2;
const OUTER_R = SIZE / 2 - 8;
const INNER_R = OUTER_R - 38;
const LABEL_R = (INNER_R + OUTER_R) / 2;
const BALL_TRACK_R = (INNER_R + OUTER_R) / 2 + 5;
const SEGMENT_ANGLE = (2 * Math.PI) / 16;
const DEG = Math.PI / 180;

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function SpinWheel({ round, selectedSlot, userBetSlot, timerProgress }: Props) {
  const phase = round?.phase ?? 'BETTING';
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const angleRef = useRef(0);
  const settled = useRef(false);

  const motionAngle = useMotionValue(0);
  const [labelAngle, setLabelAngle] = useState(0);

  // Ball angle — spins opposite direction, slightly different speed
  const ballAngleRef = useRef(0);
  const [ballAngle, setBallAngle] = useState(0);

  useEffect(() => {
    const unsub = motionAngle.on('change', v => setLabelAngle(v));
    return unsub;
  }, [motionAngle]);

  // Continuous idle spin during BETTING
  useEffect(() => {
    if (phase !== 'BETTING') return;
    settled.current = false;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const speed = 40;
      angleRef.current += speed * dt;
      motionAngle.set(angleRef.current);
      // Ball spins opposite, 70% speed
      ballAngleRef.current -= speed * 0.7 * dt;
      setBallAngle(ballAngleRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, timerProgress, motionAngle]);

  // Fast spin when block mined
  useEffect(() => {
    if (phase !== 'SPINNING') return;
    cancelAnimationFrame(animFrameRef.current);
    const target = angleRef.current + 360 * (5 + Math.random() * 3);
    animate(motionAngle, target, {
      duration: 4,
      ease: [0.2, 0, 0.2, 1],
    });
    angleRef.current = target;

    // Ball decelerates to a stop
    const ballTarget = ballAngleRef.current - 360 * 2;
    const startTime = performance.now();
    const duration = 3500;
    const startBall = ballAngleRef.current;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      ballAngleRef.current = startBall + (ballTarget - startBall) * ease;
      setBallAngle(ballAngleRef.current);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [phase, motionAngle]);

  // Settle to winner
  useEffect(() => {
    if (phase !== 'SETTLED' || round?.winnerSlot === undefined || settled.current) return;
    settled.current = true;
    cancelAnimationFrame(animFrameRef.current);
    const targetSlotAngle = -(round.winnerSlot * 22.5 + 11.25);
    const current = angleRef.current % 360;
    const extra = 360 * 2;
    const finalRot = angleRef.current - current + extra + targetSlotAngle;
    animate(motionAngle, finalRot, {
      duration: 2,
      ease: [0.33, 1, 0.68, 1],
    });
    angleRef.current = finalRot;
  }, [phase, round?.winnerSlot, motionAngle]);

  const isSettledWinner = phase === 'SETTLED' && round?.winnerSlot !== undefined;
  const winColor = isSettledWinner ? slotColor(round!.winnerSlot!) : '';

  const rotRad = labelAngle * DEG;
  const ballRad = ballAngle * DEG;
  const ballPos = polarToXY(CENTER, CENTER, BALL_TRACK_R, ballRad - Math.PI / 2);

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, margin: '0 auto' }}>
      {/* Winner glow burst ring */}
      {isSettledWinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            border: `2px solid ${winColor}`,
            boxShadow: `0 0 40px ${winColor}88, 0 0 80px ${winColor}44, inset 0 0 40px ${winColor}22`,
          }}
          className="animate-spin-glow"
        />
      )}

      {/* Outer rim glow — static ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="wheel-rim-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bf00ff" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
          <filter id="wheel-rim-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Outer glowing rim */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_R + 2} fill="none" stroke="url(#wheel-rim-grad)" strokeWidth="3" filter="url(#wheel-rim-glow)" opacity="0.7" />
        <circle cx={CENTER} cy={CENTER} r={OUTER_R + 6} fill="none" stroke="url(#wheel-rim-grad)" strokeWidth="1" opacity="0.25" />
        {/* Ball track */}
        <circle cx={CENTER} cy={CENTER} r={BALL_TRACK_R} fill="none" stroke="url(#wheel-rim-grad)" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 6" />
      </svg>

      {/* Spinning wheel segments */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SIZE,
          height: SIZE,
          rotate: motionAngle,
        }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <defs>
            <filter id="seg-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ball pockets on the outer edge (rotate with wheel) */}
          <g opacity="0.3">
            {Array.from({ length: 16 }).map((_, i) => {
              const pocketAngle = -Math.PI / 2 + i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
              const pos = polarToXY(CENTER, CENTER, OUTER_R - 6, pocketAngle);
              return (
                <circle
                  key={`pocket-${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={3}
                  fill="none"
                  stroke={slotColor(i)}
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {Array.from({ length: 16 }).map((_, i) => {
            const startAngle = -Math.PI / 2 + i * SEGMENT_ANGLE;
            const endAngle = startAngle + SEGMENT_ANGLE;
            const midAngle = startAngle + SEGMENT_ANGLE / 2;

            const p1 = polarToXY(CENTER, CENTER, INNER_R, startAngle);
            const p2 = polarToXY(CENTER, CENTER, OUTER_R, startAngle);
            const p3 = polarToXY(CENTER, CENTER, OUTER_R, endAngle);
            const p4 = polarToXY(CENTER, CENTER, INNER_R, endAngle);

            const largeArc = SEGMENT_ANGLE > Math.PI ? 1 : 0;
            const path = `
              M ${p1.x} ${p1.y}
              L ${p2.x} ${p2.y}
              A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${p3.x} ${p3.y}
              L ${p4.x} ${p4.y}
              A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${p1.x} ${p1.y}
              Z
            `;

            const color = slotColor(i);
            const isSelected = selectedSlot === i;
            const isBetSlot = userBetSlot === i;
            const isWinner = phase === 'SETTLED' && round?.winnerSlot === i;
            const isLoser = phase === 'SETTLED' && round?.winnerSlot !== undefined && round.winnerSlot !== i;

            let fillColor = i % 2 === 0 ? '#0e0e24' : '#0a0a1c';
            if (isWinner) fillColor = color;
            else if (isLoser) fillColor = '#08081a';
            else if (isBetSlot) fillColor = `${color}44`;
            else if (isSelected) fillColor = `${color}22`;

            return (
              <g key={i}>
                <path
                  d={path}
                  fill={fillColor}
                  stroke={isWinner ? '#fff' : isBetSlot ? color : isSelected ? `${color}88` : `${color}18`}
                  strokeWidth={isWinner ? 2.5 : isBetSlot ? 2 : isSelected ? 1.5 : 0.5}
                  style={{
                    transition: 'fill 0.3s, stroke 0.3s',
                    filter: isWinner
                      ? `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 32px ${color})`
                      : 'none',
                  }}
                />
                {isBetSlot && !isWinner && (
                  <circle
                    cx={polarToXY(CENTER, CENTER, OUTER_R - 10, midAngle).x}
                    cy={polarToXY(CENTER, CENTER, OUTER_R - 10, midAngle).y}
                    r={3}
                    fill={color}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  />
                )}
              </g>
            );
          })}

          {/* Spoke lines */}
          <g opacity="0.15">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = -Math.PI / 2 + i * SEGMENT_ANGLE;
              const inner = polarToXY(CENTER, CENTER, INNER_R, angle);
              const outer = polarToXY(CENTER, CENTER, OUTER_R, angle);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={slotColor(i)}
                  strokeWidth="1"
                />
              );
            })}
          </g>
        </svg>
      </motion.div>

      {/* Labels — orbit with wheel but stay upright */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const baseAngle = -Math.PI / 2 + i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
          const angle = baseAngle + rotRad;
          const pos = polarToXY(CENTER, CENTER, LABEL_R, angle);
          const color = slotColor(i);
          const isWinner = phase === 'SETTLED' && round?.winnerSlot === i;
          const isLoser = phase === 'SETTLED' && round?.winnerSlot !== undefined && round.winnerSlot !== i;
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isWinner ? '#fff' : isLoser ? '#2a2a40' : color}
              fontSize={11}
              fontFamily="'Orbitron', sans-serif"
              fontWeight={700}
              style={{ transition: 'fill 0.3s' }}
            >
              {SLOT_LABELS[i]}
            </text>
          );
        })}
      </svg>

      {/* Spinning ball */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 3 }}
      >
        <defs>
          <filter id="ball-glow-big" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="ball-shine" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0080a0" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {/* Ball shadow */}
        <circle
          cx={ballPos.x + 2}
          cy={ballPos.y + 2}
          r={9}
          fill="rgba(0,0,0,0.35)"
        />
        {/* Ball */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r={8}
          fill="url(#ball-shine)"
          filter="url(#ball-glow-big)"
        />
        {/* Ball highlight */}
        <circle
          cx={ballPos.x - 2}
          cy={ballPos.y - 2}
          r={3}
          fill="rgba(255,255,255,0.7)"
        />
        {/* Ball trail */}
        {phase === 'BETTING' && (
          <g opacity="0.3">
            {[1, 2, 3].map(n => {
              const trailRad = ballRad - Math.PI / 2 + n * 0.08;
              const tp = polarToXY(CENTER, CENTER, BALL_TRACK_R, trailRad);
              return (
                <circle
                  key={n}
                  cx={tp.x}
                  cy={tp.y}
                  r={7 - n * 2}
                  fill="#00e5ff"
                  opacity={0.4 - n * 0.12}
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* Center hub — roulette style */}
      <div
        style={{
          position: 'absolute',
          top: CENTER - INNER_R + 10,
          left: CENTER - INNER_R + 10,
          width: (INNER_R - 10) * 2,
          height: (INNER_R - 10) * 2,
          borderRadius: '50%',
          background: isSettledWinner
            ? `radial-gradient(circle, ${winColor}15 0%, #06060f 100%)`
            : 'radial-gradient(circle, #111128 0%, #06060f 100%)',
          border: isSettledWinner ? `2px solid ${winColor}66` : '2px solid #1e2048',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transition: 'border-color 0.5s, background 0.5s',
          boxShadow: isSettledWinner
            ? `inset 0 0 40px ${winColor}22`
            : 'inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Inner decorative rings */}
        <div
          style={{
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            border: '1px solid rgba(124,58,255,0.12)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: '50%',
            border: '1px solid rgba(0,229,255,0.08)',
            pointerEvents: 'none',
          }}
        />

        <AnimatePresence mode="wait">
          {phase === 'SETTLED' && round?.winnerSlot !== undefined ? (
            <motion.div
              key="result"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <div
                className="font-display text-xs tracking-widest mb-1"
                style={{ color: '#a0a8c8' }}
              >
                WINNER
              </div>
              <div
                className="font-display font-black"
                style={{
                  fontSize: '2.2rem',
                  lineHeight: 1,
                  color: slotColor(round.winnerSlot),
                  textShadow: `0 0 30px ${slotColor(round.winnerSlot)}, 0 0 60px ${slotColor(round.winnerSlot)}88`,
                }}
              >
                {SLOT_LABELS[round.winnerSlot]}
              </div>
            </motion.div>
          ) : phase === 'SPINNING' ? (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-bold tracking-widest animate-timer-pulse"
              style={{ color: '#a0a8c8', fontSize: '0.7rem' }}
            >
              SPINNING...
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center' }}
            >
              <div className="font-display font-black text-sm tracking-widest">
                <span style={{ color: '#00e5ff', textShadow: '0 0 12px rgba(0,229,255,0.6)' }}>HASH</span>
                <span style={{ color: '#bf00ff', textShadow: '0 0 12px rgba(191,0,255,0.6)' }}>SPIN</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pointer triangle at top */}
      <div
        style={{
          position: 'absolute',
          top: -4,
          left: CENTER - 8,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '14px solid #e8eeff',
          filter: 'drop-shadow(0 0 6px rgba(232,238,255,0.6))',
          zIndex: 10,
        }}
      />
    </div>
  );
}
