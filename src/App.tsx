import { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BackgroundFX } from './components/BackgroundFX';
import { useRealBlocks } from './hooks/useRealBlocks';
import { LandingPage } from './pages/LandingPage';
import { HashFlipPage } from './hashflip/HashFlipPage';
import { HashSpinPage } from './hashspin/HashSpinPage';
import { HashPotPage } from './hashpot/HashPotPage';
import { HashFlipFAQ } from './hashflip/FAQModal';
import { HashSpinFAQ } from './hashspin/FAQModal';
import { HashPotFAQ } from './hashpot/FAQModal';
import { HashBetFAQ } from './components/HashBetFAQ';
import { connectWallet, disconnectWallet, type WalletState, INITIAL_WALLET_STATE } from './lib/wallet';

type GameRoute = '/' | '/flip' | '/spin' | '/pot';

const GAME_NAMES: Record<string, string> = {
  '/': 'HASHBET',
  '/flip': 'HASHFLIP',
  '/spin': 'HASHSPIN',
  '/pot': 'HASHPOT',
};

export default function App() {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [faqOpen, setFaqOpen] = useState(false);

  const { tip, error: blocksError, wsConnected } = useRealBlocks();
  const location = useLocation();

  const currentPath = location.pathname as GameRoute;
  const gameName = GAME_NAMES[currentPath] ?? 'HASHBET';
  const isLanding = currentPath === '/';

  const handleConnect = useCallback(async () => {
    try {
      const state = await connectWallet();
      setWallet(state);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setWallet(disconnectWallet());
  }, []);

  const walletProps = {
    walletConnected: wallet.connected,
    walletAddress: wallet.address,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  };

  return (
    <div
      className="bg-grid scanlines"
      style={{ background: '#06060f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <BackgroundFX />

      <div style={{ position: 'relative', zIndex: 1, display: 'contents' }}>
        <Header
          gameName={gameName}
          isLanding={isLanding}
          blockHeight={tip?.height ?? null}
          wsConnected={wsConnected}
          error={blocksError}
          onFaq={() => setFaqOpen(true)}
        />

        {/* FAQ modals */}
        {currentPath === '/' && <HashBetFAQ open={faqOpen} onClose={() => setFaqOpen(false)} />}
        {currentPath === '/flip' && <HashFlipFAQ open={faqOpen} onClose={() => setFaqOpen(false)} />}
        {currentPath === '/spin' && <HashSpinFAQ open={faqOpen} onClose={() => setFaqOpen(false)} />}
        {currentPath === '/pot' && <HashPotFAQ open={faqOpen} onClose={() => setFaqOpen(false)} />}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: isLanding ? 'center' : 'flex-start', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div className="page-content" style={{ width: '100%', maxWidth: 1200, padding: '14px 20px 20px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/flip" element={<HashFlipPage {...walletProps} />} />
            <Route path="/spin" element={<HashSpinPage {...walletProps} />} />
            <Route path="/pot" element={<HashPotPage {...walletProps} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
