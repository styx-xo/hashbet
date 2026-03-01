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
  const { round, history, userBet, placeBet, lastBlockTimestamp } = useHashFlipState();
  const btcPrice = useBtcPrice();
  const [betInput, setBetInput] = useState('0.001');

  const handleBet = (side: Side) => {
    placeBet(side, parseFloat(betInput) || 0.001);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Title — compact */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-display font-black tracking-widest" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 1 }}>
          <span style={{ color: '#00e5ff' }}>HASH</span>
          <span style={{ color: '#bf00ff' }}>FLIP</span>
        </h1>
        <p className="font-mono mt-1" style={{ color: '#6872a0', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          BET ON THE LAST BYTE OF THE NEXT BLOCK HASH
        </p>
      </div>

      {/* Timer */}
      <BlockTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />

      {/* LOW / HIGH panels */}
      {round && (
        <div className="flip-panels-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <SidePanel side="LOW" pool={round.poolLow} otherPool={round.poolHigh} phase={round.phase} winner={round.winner} userBet={userBet} btcPrice={btcPrice} />
          <SidePanel side="HIGH" pool={round.poolHigh} otherPool={round.poolLow} phase={round.phase} winner={round.winner} userBet={userBet} btcPrice={btcPrice} />
        </div>
      )}

      {/* Bet input + Wallet */}
      <div className="flip-bet-box rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '10px 14px' }}>
        {(round?.phase === 'BETTING' || userBet) && (
          <BetInput value={betInput} onChange={setBetInput} onBet={handleBet} userBet={userBet} disabled={round?.phase !== 'BETTING'} btcPrice={btcPrice} />
        )}
        <div style={{ marginTop: (round?.phase === 'BETTING' || userBet) ? 6 : 0 }}>
          <ConnectWallet connected={walletConnected} address={walletAddress} onConnect={onConnect} onDisconnect={onDisconnect} />
        </div>
      </div>

      {/* Pool distribution */}
      {round && (
        <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 14px' }}>
          <PoolBar poolLow={round.poolLow} poolHigh={round.poolHigh} btcPrice={btcPrice} />
        </div>
      )}

      {/* History */}
      <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 14px' }}>
        <History entries={history} />
      </div>
    </div>
  );
}
