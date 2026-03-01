import { useState, useEffect, useRef, useCallback } from 'react';
import type { Round, HistoryEntry, Side } from './types';
import { useRealBlocks, fetchBlockHash } from '../hooks/useRealBlocks';
import { CONTRACT_ADDRESSES, OPNET_NETWORK } from '../lib/config';
import { getHashFlipContract, type IHashFlipContract } from '../lib/contracts';

function calcMulti(myPool: number, theirPool: number): number {
  return myPool > 0 ? +(1 + (theirPool * 0.98) / myPool).toFixed(2) : 1;
}

async function fetchRecentHistory(tipHeight: number, count: number): Promise<HistoryEntry[]> {
  const entries: HistoryEntry[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const height = tipHeight - i;
    try {
      const hash = await fetchBlockHash(height);
      const lastByte = parseInt(hash.trim().slice(-2), 16);
      const winner: Side = lastByte < 128 ? 'LOW' : 'HIGH';
      entries.push({ roundId: height, winner, hashByte: lastByte, multiplier: 0 });
    } catch {
      // skip
    }
  }
  return entries;
}

const contractsDeployed = (CONTRACT_ADDRESSES.hashFlip as string).length > 0;

export function useHashFlipState() {
  const { tip, loading: blocksLoading, error: blocksError, wsConnected } = useRealBlocks();

  const [round, setRoundState] = useState<Round | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [userBet, setUserBet] = useState<{ side: Side; amount: number } | null>(null);
  const [txPending, setTxPending] = useState(false);

  const roundRef = useRef<Round | null>(null);
  const nextId = useRef(1);
  const isSettling = useRef(false);
  const initialized = useRef(false);
  const contractRef = useRef<IHashFlipContract | null>(null);

  const setRound = (r: Round | null) => {
    roundRef.current = r;
    setRoundState(r);
  };

  // Get contract instance
  const getContract = useCallback(() => {
    if (!contractsDeployed) return null;
    if (!contractRef.current) {
      contractRef.current = getHashFlipContract();
    }
    return contractRef.current;
  }, []);

  // Poll contract state for round data
  const pollContractState = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    try {
      const currentRoundResult = await contract._getCurrentRound();
      if (currentRoundResult.revert || !currentRoundResult.properties) return;

      const roundId = currentRoundResult.properties.roundId;
      if (!roundId || roundId === 0n) return; // no rounds yet

      const roundDataResult = await contract._getRound(roundId);
      if (roundDataResult.revert) return;

      // BinaryReader result: targetBlock(u64) | settled(bool) | winnerSide(u8) | poolLow(u256) | poolHigh(u256)
      const reader = roundDataResult.result;
      if (!reader || reader.byteLength < 10) return;
      reader.setOffset(0);

      const targetBlock = Number(reader.readU64());
      const settled = reader.readBoolean();
      const winnerSide = reader.readU8();
      const poolLow = Number(reader.readU256());
      const poolHigh = Number(reader.readU256());

      const currentBlock = tip?.height ?? targetBlock;
      const isSettled = settled;
      const phase: Round['phase'] = isSettled
        ? 'SETTLED'
        : (currentBlock >= targetBlock ? 'AWAITING' : 'BETTING');

      const contractRound: Round = {
        id: Number(roundId),
        targetBlock,
        currentBlock,
        poolLow,
        poolHigh,
        phase,
        winner: isSettled ? (winnerSide === 0 ? 'LOW' : 'HIGH') : undefined,
        hashByte: undefined,
      };

      setRound(contractRound);
    } catch (err) {
      console.warn('Contract poll failed:', err);
    }
  }, [getContract, tip]);

  // Initialize on first block
  useEffect(() => {
    if (!tip || initialized.current) return;
    initialized.current = true;

    if (contractsDeployed) {
      // Try contract, fall back to local mode if no rounds exist
      pollContractState().then(() => {
        if (!roundRef.current) {
          // No rounds on contract yet — use local mode
          setRound({
            id: nextId.current,
            targetBlock: tip.height + 1,
            currentBlock: tip.height,
            poolLow: 0,
            poolHigh: 0,
            phase: 'BETTING',
          });
        }
      });
    } else {
      setRound({
        id: nextId.current,
        targetBlock: tip.height + 1,
        currentBlock: tip.height,
        poolLow: 0,
        poolHigh: 0,
        phase: 'BETTING',
      });
    }

    fetchRecentHistory(tip.height, 13).then(setHistory).catch(() => {});
  }, [tip, pollContractState]);

  // Poll contract state on interval when deployed
  useEffect(() => {
    if (!contractsDeployed || !initialized.current) return;
    const interval = setInterval(pollContractState, 10_000);
    return () => clearInterval(interval);
  }, [pollContractState]);

  // React to new blocks (local mode)
  useEffect(() => {
    if (!tip || contractsDeployed) return;
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
          setRound(settled);
          setHistory(prev => [
            { roundId: r.id, winner, hashByte: lastByte, multiplier: multi },
            ...prev.slice(0, 18),
          ]);

          setTimeout(() => {
            isSettling.current = false;
            nextId.current += 1;
            const h = roundRef.current?.currentBlock ?? tip.height;
            setRound({
              id: nextId.current,
              targetBlock: h + 1,
              currentBlock: h,
              poolLow: 0,
              poolHigh: 0,
              phase: 'BETTING',
            });
            setUserBet(null);
          }, 7000);
        })
        .catch(() => {
          isSettling.current = false;
          setRound(r);
        });
    }
  }, [tip]);

  // Re-poll on new block when contracts deployed
  useEffect(() => {
    if (!tip || !contractsDeployed) return;
    pollContractState();
  }, [tip, pollContractState]);

  const placeBet = useCallback(async (side: Side, amountBtc: number) => {
    const r = roundRef.current;
    if (!r || r.phase !== 'BETTING' || userBet) return;
    const sats = Math.round(amountBtc * 100_000_000);
    console.log('[HashFlip] placeBet:', side, amountBtc, 'BTC =', sats, 'sats | phase:', r.phase);

    if (contractsDeployed) {
      const contract = getContract();
      if (!contract) return;

      setTxPending(true);
      try {
        const sideNum = side === 'LOW' ? 0 : 1;
        const simulation = await contract._bet(BigInt(r.id), sideNum, BigInt(sats));

        if (simulation.revert) {
          console.error('Bet simulation failed:', simulation.revert);
          setTxPending(false);
          return;
        }

        // Frontend: signer=null, mldsaSigner=null — wallet handles signing
        const receipt = await simulation.sendTransaction({
          signer: null,
          mldsaSigner: null,
          refundTo: '', // wallet handles
          maximumAllowedSatToSpend: BigInt(sats + 50_000),
          feeRate: 10,
          network: OPNET_NETWORK,
        });

        console.log('Bet TX:', receipt.transactionId);
        setUserBet({ side, amount: sats });

        // Re-poll to get updated pools
        await pollContractState();
      } catch (err) {
        console.error('Bet failed:', err);
      } finally {
        setTxPending(false);
      }
    } else {
      // Local mode: immediate feedback
      setUserBet({ side, amount: sats });
      const updated = {
        ...r,
        poolLow: side === 'LOW' ? r.poolLow + sats : r.poolLow,
        poolHigh: side === 'HIGH' ? r.poolHigh + sats : r.poolHigh,
      };
      setRound(updated);
    }
  }, [userBet, getContract, pollContractState]);

  return {
    round,
    history,
    userBet,
    placeBet,
    txPending,
    lastBlockTimestamp: tip?.timestamp ?? null,
    blocksLoading,
    blocksError,
    wsConnected,
  };
}
