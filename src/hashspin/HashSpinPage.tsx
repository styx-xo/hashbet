import { useState, useEffect, useRef } from 'react';
import { useHashSpinState } from './useHashSpinState';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { SpinWheel } from './SpinWheel';
import { SlotSelector } from './SlotSelector';
import { SpinBetInput } from './SpinBetInput';
import { SpinTimer } from './SpinTimer';
import { SpinPoolBar } from './SpinPoolBar';
import { SpinHistory } from './SpinHistory';
import { ConnectWallet } from '../components/ConnectWallet';

interface Props {
  walletConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function HashSpinPage({ walletConnected, walletAddress, onConnect, onDisconnect }: Props) {
  const { round, history, userBet, placeBet, lastBlockTimestamp } = useHashSpinState();
  const btcPrice = useBtcPrice();
  const [betInput, setBetInput] = useState('0.001');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const toggleSlot = (slot: number) => {
    setSelectedSlot(prev => prev === slot ? null : slot);
  };

  const handleBet = () => {
    if (selectedSlot === null) return;
    placeBet(selectedSlot, parseFloat(betInput) || 0.001);
  };

  // Timer progress for wheel speed
  const [timerProgress, setTimerProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (lastBlockTimestamp === null || round?.phase !== 'BETTING') { setTimerProgress(0); return; }
    const update = () => setTimerProgress(Math.min((Date.now() / 1000 - lastBlockTimestamp) / 600, 1));
    update();
    timerRef.current = setInterval(update, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lastBlockTimestamp, round?.phase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 900, margin: '0 auto', width: '100%' }}>

      {/* Title — compact */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-display font-black tracking-widest" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 1 }}>
          <span style={{ color: '#00e5ff' }}>HASH</span>
          <span style={{ color: '#bf00ff' }}>SPIN</span>
        </h1>
        <p className="font-mono mt-1" style={{ color: '#6872a0', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          BET ON THE LAST DIGIT OF THE NEXT BLOCK HASH
        </p>
      </div>

      {/* Timer — ultra compact, full width */}
      <SpinTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />

      {/* Two-column: Wheel | Controls */}
      <div className="spin-layout" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Wheel */}
        <div className="spin-wheel-col" style={{ flex: '0 0 auto' }}>
          {round && (
            <div className="spin-wheel-wrap">
              <SpinWheel
                round={round}
                selectedSlot={userBet ? userBet.slot : selectedSlot}
                userBetSlot={userBet?.slot ?? null}
                timerProgress={timerProgress}
              />
            </div>
          )}
        </div>

        {/* Controls — compact stack */}
        <div className="spin-controls-col" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Slot selector — always visible */}
          {round && (
            <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 10px' }}>
              <div className="font-display font-bold tracking-widest text-center mb-1.5" style={{ fontSize: '0.65rem', color: '#6872a0' }}>
                {round.phase === 'SETTLED' ? 'RESULT' : 'SELECT SLOT'}
              </div>
              <SlotSelector
                selectedSlot={userBet ? userBet.slot : selectedSlot}
                onSelectSlot={toggleSlot}
                slotPools={round.slotPools}
                totalPool={round.totalPool}
                userBetSlot={userBet?.slot ?? null}
                phase={round.phase}
                winnerSlot={round.winnerSlot}
                disabled={round.phase !== 'BETTING' || !!userBet}
              />
            </div>
          )}

          {/* Bet input + Wallet — compact */}
          <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 10px' }}>
            {(round?.phase === 'BETTING' || userBet) && (
              <SpinBetInput
                value={betInput}
                onChange={setBetInput}
                onBet={handleBet}
                selectedSlot={selectedSlot}
                userBet={userBet}
                disabled={round?.phase !== 'BETTING'}
                btcPrice={btcPrice}
              />
            )}
            <div style={{ marginTop: (round?.phase === 'BETTING' || userBet) ? 6 : 0 }}>
              <ConnectWallet
                connected={walletConnected}
                address={walletAddress}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
              />
            </div>
          </div>

          {/* Pool bar — compact */}
          {round && (
            <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 10px' }}>
              <SpinPoolBar round={round} btcPrice={btcPrice} />
            </div>
          )}
        </div>
      </div>

      {/* History — full width, compact */}
      <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 12px' }}>
        <SpinHistory entries={history} />
      </div>
    </div>
  );
}
