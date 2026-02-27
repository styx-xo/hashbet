import { useState, useEffect, useRef } from 'react';
import type { Round, HistoryEntry, Side } from './types';
import { useRealBlocks, fetchBlockHash } from '../hooks/useRealBlocks';

export interface LiveBet {
  id: number;
  side: Side;
  amount: number; // satoshis
  ts: number;     // Date.now()
}

function rndPools(): [number, number] {
  const total = 15_000_000 + Math.floor(Math.random() * 25_000_000);
  const r = 0.35 + Math.random() * 0.3;
  return [Math.floor(total * r), Math.floor(total * (1 - r))];
}

function calcMulti(myPool: number, theirPool: number): number {
  return myPool > 0 ? +(1 + (theirPool * 0.98) / myPool).toFixed(2) : 1;
}

// Realistic-ish bet sizes (sats)
const BET_SIZES = [10_000, 20_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_000_000];

function rndBet(): { side: Side; amount: number } {
  const side: Side = Math.random() < 0.5 ? 'LOW' : 'HIGH';
  const amount = BET_SIZES[Math.floor(Math.random() * BET_SIZES.length)];
  return { side, amount };
}

async function fetchRecentHistory(tipHeight: number, count: number): Promise<HistoryEntry[]> {
  const entries: HistoryEntry[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const height = tipHeight - i;
    try {
      const hash = await fetchBlockHash(height);
      const lastByte = parseInt(hash.trim().slice(-2), 16);
      const winner: Side = lastByte < 128 ? 'LOW' : 'HIGH';
      const multi = 1.7 + Math.random() * 0.3;
      entries.push({ roundId: height, winner, hashByte: lastByte, multiplier: +multi.toFixed(2) });
    } catch {
      // Skip failed fetches, continue with rest
    }
  }
  return entries;
}

export function useHashFlipState() {
  const { tip, loading: blocksLoading, error: blocksError, wsConnected } = useRealBlocks();

  const [round, setRoundState] = useState<Round | null>(null);
  const [history, setHistory]   = useState<HistoryEntry[]>([]);
  const [userBet, setUserBet]   = useState<{ side: Side; amount: number } | null>(null);
  const [recentBets, setRecentBets] = useState<LiveBet[]>([]);

  const roundRef     = useRef<Round | null>(null);
  const nextId       = useRef(43);
  const isSettling   = useRef(false);
  const initialized  = useRef(false);
  const betTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setRound = (r: Round | null) => {
    roundRef.current = r;
    setRoundState(r);
  };

  // ── Simulated live bets ───────────────────────────────────────────
  const scheduleBet = () => {
    const delay = 5_000 + Math.random() * 13_000; // 5–18s
    betTimerRef.current = setTimeout(() => {
      const r = roundRef.current;
      if (!r || r.phase !== 'BETTING') return;

      const { side, amount } = rndBet();
      const bet: LiveBet = { id: Date.now(), side, amount, ts: Date.now() };

      setRecentBets(prev => [bet, ...prev.slice(0, 9)]);
      const updated = {
        ...r,
        poolLow:  side === 'LOW'  ? r.poolLow  + amount : r.poolLow,
        poolHigh: side === 'HIGH' ? r.poolHigh + amount : r.poolHigh,
      };
      roundRef.current = updated;
      setRoundState(updated);

      scheduleBet(); // chain next
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

  // ── Initialize on first block ─────────────────────────────────────
  useEffect(() => {
    if (!tip || initialized.current) return;
    initialized.current = true;
    const [low, high] = rndPools();
    setRound({
      id: nextId.current,
      targetBlock: tip.height + 1,
      currentBlock: tip.height,
      poolLow: low,
      poolHigh: high,
      phase: 'BETTING',
    });
    // Fetch real history from recent blocks
    fetchRecentHistory(tip.height, 13).then(setHistory).catch(() => {});
  }, [tip]);

  // ── React to new blocks ───────────────────────────────────────────
  useEffect(() => {
    if (!tip) return;
    const r = roundRef.current;
    if (!r) return;

    if (r.currentBlock !== tip.height && r.phase === 'BETTING') {
      roundRef.current = { ...r, currentBlock: tip.height };
      setRoundState({ ...r, currentBlock: tip.height });
    }

    if (tip.height >= r.targetBlock && r.phase === 'BETTING' && !isSettling.current) {
      isSettling.current = true;
      const settling = { ...r, phase: 'AWAITING' as const, currentBlock: tip.height };
      roundRef.current = settling;
      setRoundState(settling);

      fetchBlockHash(r.targetBlock)
        .then(hash => {
          const lastByte = parseInt(hash.trim().slice(-2), 16);
          const winner: Side = lastByte < 128 ? 'LOW' : 'HIGH';
          const multi = winner === 'LOW'
            ? calcMulti(r.poolLow, r.poolHigh)
            : calcMulti(r.poolHigh, r.poolLow);

          const settled: Round = { ...r, phase: 'SETTLED', hashByte: lastByte, winner, currentBlock: tip.height };
          roundRef.current = settled;
          setRoundState(settled);
          setHistory(prev => [
            { roundId: r.id, winner, hashByte: lastByte, multiplier: multi },
            ...prev.slice(0, 18),
          ]);

          setTimeout(() => {
            isSettling.current = false;
            nextId.current += 1;
            const h = roundRef.current?.currentBlock ?? tip.height;
            const [low, high] = rndPools();
            const next: Round = { id: nextId.current, targetBlock: h + 1, currentBlock: h, poolLow: low, poolHigh: high, phase: 'BETTING' };
            roundRef.current = next;
            setRoundState(next);
            setUserBet(null);
            setRecentBets([]);
          }, 7000);
        })
        .catch(() => {
          isSettling.current = false;
          roundRef.current = r;
          setRoundState(r);
        });
    }
  }, [tip]);

  const placeBet = (side: Side, amountBtc: number) => {
    const r = roundRef.current;
    if (!r || r.phase !== 'BETTING' || userBet) return;
    const sats = Math.round(amountBtc * 100_000_000);
    setUserBet({ side, amount: sats });
    const bet: LiveBet = { id: Date.now(), side, amount: sats, ts: Date.now() };
    setRecentBets(prev => [bet, ...prev.slice(0, 9)]);
    const updated = {
      ...r,
      poolLow:  side === 'LOW'  ? r.poolLow  + sats : r.poolLow,
      poolHigh: side === 'HIGH' ? r.poolHigh + sats : r.poolHigh,
    };
    roundRef.current = updated;
    setRoundState(updated);
  };

  return {
    round,
    history,
    userBet,
    recentBets,
    placeBet,
    lastBlockTimestamp: tip?.timestamp ?? null,
    blocksLoading,
    blocksError,
    wsConnected,
  };
}
