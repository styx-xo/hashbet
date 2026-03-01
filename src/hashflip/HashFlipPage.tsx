import { useState } from 'react';
import { useHashFlipState } from './useHashFlipState';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { BlockTimer } from './BlockTimer';
import { SidePanel } from './SidePanel';
import { PoolBar } from './PoolBar';
import { BetInput } from './BetInput';
import { History } from './History';
import { ConnectWallet } from '../components/ConnectWallet';
import type { Side } from './types';

interface Props {
  walletConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function HashFlipPage({ walletConnected, walletAddress, onConnect, onDisconnect }: Props) {
  const { round, history, userBet, placeBet, lastBlockTimestamp, blocksLoading } = useHashFlipState();
  const btcPrice = useBtcPrice();
  const [betInput, setBetInput] = useState('0.001');

  const handleBet = (side: Side) => {
    const amount = parseFloat(betInput) || 0.001;
    placeBet(side, amount);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1
          className="font-display font-black tracking-widest animate-flicker"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1, letterSpacing: '0.15em' }}
        >
          <span style={{ color: '#00e5ff', textShadow: '0 0 30px rgba(0,229,255,0.6), 0 0 60px rgba(0,229,255,0.25)' }}>HASH</span>
          <span style={{ color: '#bf00ff', textShadow: '0 0 30px rgba(191,0,255,0.6), 0 0 60px rgba(191,0,255,0.25)' }}>FLIP</span>
        </h1>
        <p className="font-mono text-xs mt-1 tracking-wider" style={{ color: '#c4ccee' }}>
          BET ON THE LAST BYTE OF THE NEXT BITCOIN BLOCK HASH
        </p>
        {blocksLoading && (
          <p className="font-mono text-xs mt-1 animate-pulse" style={{ color: '#a0a8c8' }}>
            Connecting to Bitcoin network...
          </p>
        )}
      </div>

      {/* Timer */}
      <BlockTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />

      {/* LOW / HIGH panels side by side */}
      {round && (
        <div className="flip-panels-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
          <SidePanel side="LOW" pool={round.poolLow} otherPool={round.poolHigh} phase={round.phase} winner={round.winner} userBet={userBet} btcPrice={btcPrice} />
          <SidePanel side="HIGH" pool={round.poolHigh} otherPool={round.poolLow} phase={round.phase} winner={round.winner} userBet={userBet} btcPrice={btcPrice} />
        </div>
      )}

      {/* Bet input + Wallet */}
      <div
        className="flip-bet-box rounded-xl border border-dark-border"
        style={{ background: '#0c0c1e', padding: '16px 28px', marginTop: 10 }}
      >
        {(round?.phase === 'BETTING' || userBet) && (
          <BetInput
            value={betInput}
            onChange={setBetInput}
            onBet={handleBet}
            userBet={userBet}
            disabled={round?.phase !== 'BETTING'}
            btcPrice={btcPrice}
          />
        )}
        <div style={{ marginTop: round?.phase === 'BETTING' || userBet ? 10 : 0 }}>
          <ConnectWallet
            connected={walletConnected}
            address={walletAddress}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>

      {/* Pool distribution */}
      {round && (
        <div className="rounded-xl border border-dark-border" style={{ background: '#0c0c1e', padding: '12px 28px', marginTop: 10 }}>
          <PoolBar poolLow={round.poolLow} poolHigh={round.poolHigh} btcPrice={btcPrice} />
        </div>
      )}

      {/* History */}
      <div className="rounded-xl border border-dark-border" style={{ background: '#0c0c1e', padding: '14px 28px', marginTop: 10 }}>
        <History entries={history} />
      </div>
    </div>
  );
}
