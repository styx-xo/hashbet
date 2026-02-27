import { useState } from 'react';
import { useHashPotState } from './useHashPotState';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { ByteSelector } from './ByteSelector';
import { ByteInfoPanel } from './ByteInfoPanel';
import { PotBetInput } from './PotBetInput';
import { PotTimer } from './PotTimer';
import { PotHistory } from './PotHistory';
import { ConnectWallet } from '../components/ConnectWallet';

interface Props {
  walletConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function HashPotPage({ walletConnected, walletAddress, onConnect, onDisconnect }: Props) {
  const { round, history, userBet, placeBet, lastBlockTimestamp, blocksLoading } = useHashPotState();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1
          className="font-display font-black tracking-widest animate-flicker"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: 1 }}
        >
          <span style={{ color: '#00e5ff', textShadow: '0 0 30px rgba(0,229,255,0.6), 0 0 60px rgba(0,229,255,0.25)' }}>HASH</span>
          <span style={{ color: '#f59e0b', textShadow: '0 0 30px rgba(245,158,11,0.6), 0 0 60px rgba(245,158,11,0.25)' }}>POT</span>
        </h1>
        <p className="font-mono text-xs mt-2 tracking-wider" style={{ color: '#c4ccee' }}>
          GUESS THE EXACT LAST BYTE · 256 OUTCOMES · UP TO ~240× PAYOUT
        </p>
        {blocksLoading && (
          <p className="font-mono text-xs mt-1 animate-pulse" style={{ color: '#a0a8c8' }}>
            Connecting to Bitcoin network...
          </p>
        )}
      </div>

      {/* Timer (left, compact) + Bet/Wallet (right, expanded) — single control row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        {/* Timer — 60% */}
        <div style={{ flex: '0 0 60%', minWidth: 0 }}>
          <PotTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />
        </div>

        {/* Bet + Wallet — 35%, vertically centered */}
        <div
          className="rounded-2xl border border-dark-border flex flex-col justify-center"
          style={{ background: '#0c0c1e', padding: '14px 18px', flex: 1, minWidth: 0 }}
        >
          {(round?.phase === 'BETTING' || userBet) && (
            <PotBetInput
              value={betInput}
              onChange={setBetInput}
              onBet={handleBet}
              selectedSlot={selectedSlot}
              userBet={userBet}
              disabled={round?.phase !== 'BETTING'}
              btcPrice={btcPrice}
              compact
            />
          )}

          <div style={{ marginTop: (round?.phase === 'BETTING' || userBet) ? 10 : 0 }}>
            <ConnectWallet
              connected={walletConnected}
              address={walletAddress}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          </div>
        </div>
      </div>

      {/* Full-width byte grid */}
      {round && (
        <div
          className="rounded-2xl border border-dark-border"
          style={{ background: '#0c0c1e', padding: '16px 16px' }}
        >
          <ByteSelector
            selectedSlot={round.phase === 'SETTLED' ? displaySlot : selectedSlot}
            onSelectSlot={toggleSlot}
            slotPools={round.slotPools}
            totalPool={round.totalPool}
            userBetSlot={userBet ? userBet.slot : null}
            phase={round.phase}
            winnerSlot={round.winnerSlot}
            disabled={round.phase !== 'BETTING' || !!userBet}
          />
        </div>
      )}

      {/* Byte info panel — full width below grid */}
      {round && displaySlot !== null && (
        <ByteInfoPanel
          selectedSlot={displaySlot}
          slotPools={round.slotPools}
          totalPool={round.totalPool}
          userBet={userBet}
          phase={round.phase}
          winnerSlot={round.winnerSlot}
          btcPrice={btcPrice}
        />
      )}

      {/* History */}
      <div className="rounded-2xl border border-dark-border" style={{ background: '#0c0c1e', padding: '14px 20px' }}>
        <PotHistory entries={history} />
      </div>
    </div>
  );
}
