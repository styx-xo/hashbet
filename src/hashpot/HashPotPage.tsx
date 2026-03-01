import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHashPotState } from './useHashPotState';
import { useBtcPrice } from '../hooks/useBtcPrice';
import { BytePickerModal } from './BytePickerModal';
import { ByteInfoPanel } from './ByteInfoPanel';
import { PotBetInput } from './PotBetInput';
import { PotTimer } from './PotTimer';
import { PotHistory } from './PotHistory';
import { ConnectWallet } from '../components/ConnectWallet';
import { BYTE_LABELS, byteColor } from './types';

interface Props {
  walletConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function HashPotPage({ walletConnected, walletAddress, onConnect, onDisconnect }: Props) {
  const { round, history, userBet, placeBet, lastBlockTimestamp } = useHashPotState();
  const btcPrice = useBtcPrice();
  const [betInput, setBetInput] = useState('0.001');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const toggleSlot = (slot: number) => {
    setSelectedSlot(prev => prev === slot ? null : slot);
  };

  const handleBet = () => {
    if (selectedSlot === null) return;
    const amount = parseFloat(betInput) || 0.001;
    placeBet(selectedSlot, amount);
  };

  const displaySlot = userBet ? userBet.slot : selectedSlot;
  const slotCol = displaySlot !== null ? byteColor(displaySlot) : '#3a4060';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 900, margin: '0 auto', width: '100%' }}>

      {/* Title — compact */}
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-display font-black tracking-widest" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 1 }}>
          <span style={{ color: '#00e5ff' }}>HASH</span>
          <span style={{ color: '#f59e0b' }}>POT</span>
        </h1>
        <p className="font-mono mt-1" style={{ color: '#6872a0', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          GUESS THE EXACT LAST BYTE · 256 OUTCOMES · UP TO ~240× PAYOUT
        </p>
      </div>

      {/* Timer */}
      <PotTimer round={round} lastBlockTimestamp={lastBlockTimestamp} />

      {/* Select byte button + Bet + Wallet */}
      <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '10px 14px' }}>
        {/* Byte selector button */}
        {round?.phase === 'BETTING' && !userBet && (
          <div className="mb-2">
            <motion.button
              onClick={() => setPickerOpen(true)}
              className="btn w-full"
              style={{
                padding: '10px 16px',
                fontSize: '0.8rem',
                background: selectedSlot !== null
                  ? `linear-gradient(135deg, ${slotCol}22 0%, #0c0c1e 100%)`
                  : 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, #0c0c1e 100%)',
                border: `1px solid ${selectedSlot !== null ? slotCol : 'rgba(245,158,11,0.3)'}`,
                color: selectedSlot !== null ? slotCol : '#f59e0b',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {selectedSlot !== null ? (
                <span className="flex items-center gap-2">
                  <span className="font-display font-black" style={{ fontSize: '1.1rem', color: slotCol }}>
                    0x{BYTE_LABELS[selectedSlot]}
                  </span>
                  <span className="font-display tracking-widest" style={{ color: '#a0a8c8', fontSize: '0.65rem' }}>
                    TAP TO CHANGE
                  </span>
                </span>
              ) : (
                <span className="font-display font-bold tracking-widest">
                  SELECT A BYTE (0x00 – 0xFF)
                </span>
              )}
            </motion.button>
          </div>
        )}

        {/* Settled result display */}
        {round?.phase === 'SETTLED' && round.winnerSlot !== undefined && displaySlot !== null && (
          <div className="text-center mb-2">
            <span className="font-display font-black" style={{ fontSize: '1.1rem', color: byteColor(displaySlot) }}>
              0x{BYTE_LABELS[displaySlot]}
            </span>
          </div>
        )}

        {/* Bet input */}
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

        <div style={{ marginTop: (round?.phase === 'BETTING' || userBet) ? 6 : 0 }}>
          <ConnectWallet
            connected={walletConnected}
            address={walletAddress}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>

      {/* Byte info panel */}
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
      <div className="rounded-xl border border-dark-border" style={{ background: '#0a0a1e', padding: '8px 14px' }}>
        <PotHistory entries={history} />
      </div>

      {/* Byte Picker Modal */}
      {round && (
        <BytePickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          selectedSlot={round.phase === 'SETTLED' ? displaySlot : selectedSlot}
          onSelectSlot={toggleSlot}
          slotPools={round.slotPools}
          totalPool={round.totalPool}
          userBetSlot={userBet ? userBet.slot : null}
          phase={round.phase}
          winnerSlot={round.winnerSlot}
          disabled={round.phase !== 'BETTING' || !!userBet}
        />
      )}
    </div>
  );
}
