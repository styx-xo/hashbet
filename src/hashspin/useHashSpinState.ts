import { useState, useEffect, useRef } from 'react';
import type { SpinRound, SpinHistoryEntry } from './types';
import { useRealBlocks, fetchBlockHash } from '../hooks/useRealBlocks';

function rndSlotPools(): number[] {
  const pools = new Array(16).fill(0);
  const numBets = 6 + Math.floor(Math.random() * 10);
  for (let i = 0; i < numBets; i++) {
    const slot = Math.floor(Math.random() * 16);
    pools[slot] += 50_000 + Math.floor(Math.random() * 500_000);
  }
  return pools;
}

const BET_SIZES = [10_000, 20_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

function calcMulti(winnerPool: number, totalPool: number): number {
  if (winnerPool <= 0) return 1;
  const loserPool = totalPool - winnerPool;
  const netLoser = loserPool * 0.99;
  return +((winnerPool + netLoser) / winnerPool).toFixed(2);
}

const SEED_HISTORY: SpinHistoryEntry[] = [
  { roundId: 20, winnerSlot: 0x3, totalPool: 4_200_000, winnerPool: 310_000, multiplier: 13.4 },
  { roundId: 21, winnerSlot: 0xA, totalPool: 5_100_000, winnerPool: 280_000, multiplier: 18.0 },
  { roundId: 22, winnerSlot: 0x7, totalPool: 3_800_000, winnerPool: 450_000, multiplier: 8.4 },
  { roundId: 23, winnerSlot: 0xF, totalPool: 6_000_000, winnerPool: 520_000, multiplier: 11.4 },
  { roundId: 24, winnerSlot: 0x1, totalPool: 4_500_000, winnerPool: 200_000, multiplier: 22.3 },
  { roundId: 25, winnerSlot: 0xC, totalPool: 3_200_000, winnerPool: 400_000, multiplier: 7.9 },
  { roundId: 26, winnerSlot: 0x5, totalPool: 5_500_000, winnerPool: 350_000, multiplier: 15.6 },
  { roundId: 27, winnerSlot: 0x9, totalPool: 4_800_000, winnerPool: 600_000, multiplier: 7.9 },
  { roundId: 28, winnerSlot: 0x2, totalPool: 3_600_000, winnerPool: 250_000, multiplier: 14.3 },
  { roundId: 29, winnerSlot: 0xE, totalPool: 5_000_000, winnerPool: 380_000, multiplier: 13.0 },
];

export function useHashSpinState() {
  const { tip, loading: blocksLoading, error: blocksError, wsConnected } = useRealBlocks();

  const [round, setRoundState] = useState<SpinRound | null>(null);
  const [history, setHistory] = useState<SpinHistoryEntry[]>(SEED_HISTORY);
  const [userBet, setUserBet] = useState<{ slot: number; amount: number } | null>(null);

  const roundRef = useRef<SpinRound | null>(null);
  const nextId = useRef(30);
  const isSettling = useRef(false);
  const initialized = useRef(false);
  const betTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setRound = (r: SpinRound | null) => {
    roundRef.current = r;
    setRoundState(r);
  };

  const scheduleBet = () => {
    const delay = 4_000 + Math.random() * 10_000;
    betTimerRef.current = setTimeout(() => {
      const r = roundRef.current;
      if (!r || r.phase !== 'BETTING') return;

      const slot = Math.floor(Math.random() * 16);
      const amount = BET_SIZES[Math.floor(Math.random() * BET_SIZES.length)];

      const newPools = [...r.slotPools];
      newPools[slot] += amount;
      const updated: SpinRound = {
        ...r,
        slotPools: newPools,
        totalPool: r.totalPool + amount,
      };
      setRound(updated);
      scheduleBet();
    }, delay);
  };

  useEffect(() => {
    if (!round || round.phase !== 'BETTING') {
      if (betTimerRef.current) clearTimeout(betTimerRef.current);
      return;
    }
    scheduleBet();
    return () => { if (betTimerRef.current) clearTimeout(betTimerRef.current); };
  }, [round?.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!tip || initialized.current) return;
    initialized.current = true;
    const pools = rndSlotPools();
    const total = pools.reduce((a, b) => a + b, 0);
    setRound({
      id: nextId.current,
      targetBlock: tip.height + 1,
      currentBlock: tip.height,
      slotPools: pools,
      totalPool: total,
      phase: 'BETTING',
    });
  }, [tip]);

  useEffect(() => {
    if (!tip) return;
    const r = roundRef.current;
    if (!r) return;

    if (r.currentBlock !== tip.height && r.phase === 'BETTING') {
      const updated = { ...r, currentBlock: tip.height };
      setRound(updated);
    }

    if (tip.height >= r.targetBlock && r.phase === 'BETTING' && !isSettling.current) {
      isSettling.current = true;
      const spinning: SpinRound = { ...r, phase: 'SPINNING', currentBlock: tip.height };
      setRound(spinning);

      fetchBlockHash(r.targetBlock)
        .then(hash => {
          const lastNibble = parseInt(hash.trim().slice(-1), 16);
          const winnerPool = r.slotPools[lastNibble];
          const multi = calcMulti(winnerPool, r.totalPool);

          setTimeout(() => {
            const settled: SpinRound = {
              ...r,
              phase: 'SETTLED',
              winnerSlot: lastNibble,
              hashNibble: lastNibble,
              currentBlock: tip.height,
            };
            setRound(settled);
            setHistory(prev => [
              {
                roundId: r.id,
                winnerSlot: lastNibble,
                totalPool: r.totalPool,
                winnerPool,
                multiplier: multi,
              },
              ...prev.slice(0, 14),
            ]);

            setTimeout(() => {
              isSettling.current = false;
              nextId.current += 1;
              const h = roundRef.current?.currentBlock ?? tip.height;
              const pools = rndSlotPools();
              const total = pools.reduce((a, b) => a + b, 0);
              setRound({
                id: nextId.current,
                targetBlock: h + 1,
                currentBlock: h,
                slotPools: pools,
                totalPool: total,
                phase: 'BETTING',
              });
              setUserBet(null);
            }, 7000);
          }, 4000);
        })
        .catch(() => {
          isSettling.current = false;
          setRound(r);
        });
    }
  }, [tip]);

  const placeBet = (slot: number, amountBtc: number) => {
    const r = roundRef.current;
    if (!r || r.phase !== 'BETTING' || userBet) return;
    if (slot < 0 || slot > 15) return;
    const sats = Math.round(amountBtc * 100_000_000);
    setUserBet({ slot, amount: sats });

    const newPools = [...r.slotPools];
    newPools[slot] += sats;
    const updated: SpinRound = {
      ...r,
      slotPools: newPools,
      totalPool: r.totalPool + sats,
    };
    setRound(updated);
  };

  return {
    round,
    history,
    userBet,
    placeBet,
    lastBlockTimestamp: tip?.timestamp ?? null,
    blocksLoading,
    blocksError,
    wsConnected,
  };
}
