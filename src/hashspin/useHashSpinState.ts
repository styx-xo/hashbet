import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpinRound, SpinHistoryEntry } from './types';
import { useRealBlocks, fetchBlockHash } from '../hooks/useRealBlocks';
import { CONTRACT_ADDRESSES, OPNET_NETWORK } from '../lib/config';
import { getHashSpinContract, type IHashSpinContract } from '../lib/contracts';

function calcMulti(winnerPool: number, totalPool: number): number {
  if (winnerPool <= 0) return 1;
  const loserPool = totalPool - winnerPool;
  const netLoser = loserPool * 0.99;
  return +((winnerPool + netLoser) / winnerPool).toFixed(2);
}

const contractsDeployed = (CONTRACT_ADDRESSES.hashSpin as string).length > 0;

export function useHashSpinState() {
  const { tip, loading: blocksLoading, error: blocksError, wsConnected } = useRealBlocks();

  const [round, setRoundState] = useState<SpinRound | null>(null);
  const [history, setHistory] = useState<SpinHistoryEntry[]>([]);
  const [userBet, setUserBet] = useState<{ slot: number; amount: number } | null>(null);
  const [txPending, setTxPending] = useState(false);

  const roundRef = useRef<SpinRound | null>(null);
  const nextId = useRef(1);
  const isSettling = useRef(false);
  const initialized = useRef(false);
  const contractRef = useRef<IHashSpinContract | null>(null);

  const setRound = (r: SpinRound | null) => {
    roundRef.current = r;
    setRoundState(r);
  };

  const getContract = useCallback(() => {
    if (!contractsDeployed) return null;
    if (!contractRef.current) {
      contractRef.current = getHashSpinContract();
    }
    return contractRef.current;
  }, []);

  // Poll contract for slot pools
  const pollContractState = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    try {
      const currentRoundResult = await contract._getCurrentRound();
      if ('error' in currentRoundResult) return;
      const roundId = currentRoundResult.properties.roundId;
      if (roundId === 0n) return;

      // Fetch all 16 slot pools
      const pools: number[] = [];
      for (let i = 0; i < 16; i++) {
        const poolResult = await contract._getSlotPool(roundId, i);
        if ('error' in poolResult) {
          pools.push(0);
        } else {
          pools.push(Number(poolResult.properties.amount));
        }
      }

      const totalPool = pools.reduce((a, b) => a + b, 0);

      const roundDataResult = await contract._getRound(roundId);
      if ('error' in roundDataResult) return;
      const data = roundDataResult.properties.data;
      if (!data || data.length < 8) return;

      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const targetBlock = Number(view.getBigUint64(0, true));
      const phase = data.length > 80 ? data[80] : 0;
      const winnerSlot = data.length > 81 ? data[81] : undefined;

      const phaseMap: Record<number, SpinRound['phase']> = { 0: 'BETTING', 1: 'SPINNING', 2: 'SETTLED' };

      setRound({
        id: Number(roundId),
        targetBlock,
        currentBlock: tip?.height ?? targetBlock,
        slotPools: pools,
        totalPool,
        phase: phaseMap[phase] ?? 'BETTING',
        winnerSlot: phase === 2 ? winnerSlot : undefined,
        hashNibble: phase === 2 ? winnerSlot : undefined,
      });
    } catch (err) {
      console.warn('HashSpin contract poll failed:', err);
    }
  }, [getContract, tip]);

  useEffect(() => {
    if (!tip || initialized.current) return;
    initialized.current = true;

    if (contractsDeployed) {
      pollContractState();
    } else {
      setRound({
        id: nextId.current,
        targetBlock: tip.height + 1,
        currentBlock: tip.height,
        slotPools: new Array(16).fill(0),
        totalPool: 0,
        phase: 'BETTING',
      });
    }
  }, [tip, pollContractState]);

  useEffect(() => {
    if (!contractsDeployed || !initialized.current) return;
    const interval = setInterval(pollContractState, 10_000);
    return () => clearInterval(interval);
  }, [pollContractState]);

  // Local mode: react to new blocks
  useEffect(() => {
    if (!tip || contractsDeployed) return;
    const r = roundRef.current;
    if (!r) return;

    if (r.currentBlock !== tip.height && r.phase === 'BETTING') {
      setRound({ ...r, currentBlock: tip.height });
    }

    if (tip.height >= r.targetBlock && r.phase === 'BETTING' && !isSettling.current) {
      isSettling.current = true;
      setRound({ ...r, phase: 'SPINNING', currentBlock: tip.height });

      fetchBlockHash(r.targetBlock)
        .then(hash => {
          const lastNibble = parseInt(hash.trim().slice(-1), 16);
          const winnerPool = r.slotPools[lastNibble];
          const multi = calcMulti(winnerPool, r.totalPool);

          setTimeout(() => {
            setRound({
              ...r,
              phase: 'SETTLED',
              winnerSlot: lastNibble,
              hashNibble: lastNibble,
              currentBlock: tip.height,
            });
            setHistory(prev => [
              { roundId: r.id, winnerSlot: lastNibble, totalPool: r.totalPool, winnerPool, multiplier: multi },
              ...prev.slice(0, 14),
            ]);

            setTimeout(() => {
              isSettling.current = false;
              nextId.current += 1;
              const h = roundRef.current?.currentBlock ?? tip.height;
              setRound({
                id: nextId.current,
                targetBlock: h + 1,
                currentBlock: h,
                slotPools: new Array(16).fill(0),
                totalPool: 0,
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

  useEffect(() => {
    if (!tip || !contractsDeployed) return;
    pollContractState();
  }, [tip, pollContractState]);

  const placeBet = useCallback(async (slot: number, amountBtc: number) => {
    const r = roundRef.current;
    if (!r || r.phase !== 'BETTING' || userBet) return;
    if (slot < 0 || slot > 15) return;
    const sats = Math.round(amountBtc * 100_000_000);

    if (contractsDeployed) {
      const contract = getContract();
      if (!contract) return;

      setTxPending(true);
      try {
        const simulation = await contract._bet(BigInt(r.id), slot, BigInt(sats));
        if ('error' in simulation || simulation.revert) {
          console.error('Bet simulation failed:', 'error' in simulation ? simulation.error : simulation.revert);
          setTxPending(false);
          return;
        }

        const receipt = await simulation.sendTransaction({
          signer: null,
          mldsaSigner: null,
          refundTo: '',
          maximumAllowedSatToSpend: BigInt(sats + 50_000),
          feeRate: 10,
          network: OPNET_NETWORK,
        });

        console.log('Bet TX:', receipt.transactionId);
        setUserBet({ slot, amount: sats });
        await pollContractState();
      } catch (err) {
        console.error('Bet failed:', err);
      } finally {
        setTxPending(false);
      }
    } else {
      setUserBet({ slot, amount: sats });
      const newPools = [...r.slotPools];
      newPools[slot] += sats;
      setRound({ ...r, slotPools: newPools, totalPool: r.totalPool + sats });
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
