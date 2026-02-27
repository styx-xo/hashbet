import { useState, useEffect, useRef } from 'react';
import { useHashSpinState } from './useHashSpinState';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { SpinWheel } from './SpinWheel';
import { SlotSelector } from './SlotSelector';
import { SlotInfoPanel } from './SlotInfoPanel';
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
  const { round, history, userBet, placeBet, lastBlockTimestamp, blocksLoading } = useHashSpinState();
  const btcPrice = useBtcPrice();
  const [betInput, setBetInput] = useState('0.001');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const toggleSlot = (slot: number) => {
    setSelectedSlot(prev => prev === slot ? null : slot);
  };

  const handleBet = () => {
    if (selectedSlot === null) return;
    const amount = parseFloat(betInput) || 0.001;
    placeBet(selectedSlot, amount);
  };

  const displaySlot = userBet ? userBet.slot : selectedSlot;

  // Timer progress for wheel speed (0 to 1+)
  const [timerProgress, setTimerProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (lastBlockTimestamp === null || round?.phase !== 'BETTING') {
      setTimerProgress(0);
      return;
    }
    const update = () => {
      const elapsed = Date.now() / 1000 - lastBlockTimestamp;
      setTimerProgress(Math.min(elapsed / 600, 1));
    };
    update();
    timerRef.current = setInterval(update, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lastBlockTimestamp, round?.phase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Title ──────────────────────────────────────── */}
      <div style={{ textAlign: 'center' }}>
        <h1
          className="font-display font-black tracking-widest animate-flicker"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: 1 }}
        >
          <span style={{ color: '#00e5ff', textShadow: '0 0 30px rgba(0,229,255,0.6), 0 0 60px rgba(0,229,255,0.25)' }}>HASH</span>
          <span style={{ color: '#bf00ff', textShadow: '0 0 30px rgba(191,0,255,0.6), 0 0 60px rgba(191,0,255,0.25)' }}>SPIN</span>
        </h1>
        <p className="font-mono text-xs mt-2 tracking-wider" style={{ color: '#c4ccee' }}>
          BET ON THE LAST DIGIT OF THE NEXT BITCOIN BLOCK HASH
        </p>
        {blocksLoading && (
          <p className="font-mono text-xs mt-1 animate-pulse" style={{ color: '#a0a8c8' }}>
            Connecting to Bitcoin network...
          </p>
        )}
      </div>

      {/* ── Two-column layout: Wheel | Controls ────────── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>

        {/* Left column — Wheel only */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {round && (
            <SpinWheel
              round={round}
              selectedSlot={userBet ? userBet.slot : selectedSlot}
              userBetSlot={userBet?.slot ?? null}
              timerProgress={timerProgress}
            />
          )}
        </div>

        {/* Right column — Timer, Selector, Bet, Wallet */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Timer — compact */}
          <SpinTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />

          {/* Slot selector */}
          {round?.phase === 'BETTING' && !userBet && (
            <SlotSelector
              selectedSlot={selectedSlot}
              onSelectSlot={toggleSlot}
              slotPools={round.slotPools}
              totalPool={round.totalPool}
              userBetSlot={null}
              phase={round.phase}
              winnerSlot={round.winnerSlot}
              disabled={round.phase !== 'BETTING'}
            />
          )}

          {round?.phase === 'SETTLED' && round.winnerSlot !== undefined && (
            <SlotSelector
              selectedSlot={displaySlot}
              onSelectSlot={toggleSlot}
              slotPools={round.slotPools}
              totalPool={round.totalPool}
              userBetSlot={userBet ? userBet.slot : null}
              phase={round.phase}
              winnerSlot={round.winnerSlot}
              disabled
            />
          )}

          {/* Slot info panel */}
          {round && displaySlot !== null && (
            <SlotInfoPanel
              selectedSlot={displaySlot}
              slotPools={round.slotPools}
              totalPool={round.totalPool}
              userBet={userBet}
              phase={round.phase}
              winnerSlot={round.winnerSlot}
              btcPrice={btcPrice}
            />
          )}

          {/* Bet input */}
          <div className="rounded-2xl border border-dark-border" style={{ background: '#0c0c1e', padding: '18px 24px' }}>
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

            <div style={{ marginTop: round?.phase === 'BETTING' || userBet ? 12 : 0 }}>
              <ConnectWallet
                connected={walletConnected}
                address={walletAddress}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Pool bar — full width ────────────────────────── */}
      {round && (
        <div className="rounded-2xl border border-dark-border" style={{ background: '#0c0c1e', padding: '16px 24px' }}>
          <SpinPoolBar round={round} btcPrice={btcPrice} />
        </div>
      )}

      {/* ── History — full width below ─────────────────── */}
      <div className="rounded-2xl border border-dark-border" style={{ background: '#0c0c1e', padding: '16px 24px' }}>
        <SpinHistory entries={history} />
      </div>
    </div>
  );
}
