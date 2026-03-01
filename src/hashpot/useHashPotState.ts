import { useState, useEffect, useRef, useCallback } from 'react';
import type { PotRound, PotHistoryEntry } from './types';
import { useRealBlocks, fetchBlockHash } from '../hooks/useRealBlocks';
import { CONTRACT_ADDRESSES, OPNET_NETWORK } from '../lib/config';
import { getHashPotContract, fetchOpnetBlockHeight, type IHashPotContract } from '../lib/contracts';

function calcMulti(winnerPool: number, totalPool: number): number {
  if (winnerPool <= 0) return 1;
  const loserPool = totalPool - winnerPool;
  const netLoser = loserPool * 0.999;
  return +((winnerPool + netLoser) / winnerPool).toFixed(2);
}

const contractsDeployed = (CONTRACT_ADDRESSES.hashPot as string).length > 0;

export function useHashPotState() {
  const { tip, loading: blocksLoading, error: blocksError, wsConnected } = useRealBlocks();

  const [round, setRoundState] = useState<PotRound | null>(null);
  const [history, setHistory] = useState<PotHistoryEntry[]>([]);
  const [userBet, setUserBet] = useState<{ slot: number; amount: number } | null>(null);
  const [txPending, setTxPending] = useState(false);
  const [opnetTip, setOpnetTip] = useState<{ height: number; timestamp: number } | null>(null);

  const roundRef = useRef<PotRound | null>(null);
  const nextId = useRef(1);
  const isSettling = useRef(false);
  const initialized = useRef(false);
  const contractRef = useRef<IHashPotContract | null>(null);

  const setRound = (r: PotRound | null) => {
    roundRef.current = r;
    setRoundState(r);
  };

  const getContract = useCallback(() => {
    if (!contractsDeployed) return null;
    if (!contractRef.current) {
      contractRef.current = getHashPotContract();
    }
    return contractRef.current;
  }, []);

  // Poll contract using batch queries for 256 slots
  const pollContractState = useCallback(async () => {
    const contract = getContract();
    if (!contract) return;

    try {
      // Fetch OPNet block height (same chain as contracts)
      const opnetBlock = await fetchOpnetBlockHeight();
      setOpnetTip(opnetBlock);

      const currentRoundResult = await contract._getCurrentRound();
      if (currentRoundResult.revert || !currentRoundResult.properties) return;
      const roundId = currentRoundResult.properties.roundId;
      if (!roundId || roundId === 0n) return;

      // _getRound returns: targetBlock(u64) | settled(bool) | winnerSlot(u16) | totalPool(u256) = 43 bytes
      const roundDataResult = await contract._getRound(roundId);
      if (roundDataResult.revert) return;

      const reader = roundDataResult.result;
      if (!reader || reader.byteLength < 11) return;
      reader.setOffset(0);

      const targetBlock = Number(reader.readU64());
      const isSettled = reader.readBoolean();
      const winnerSlot = reader.readU16();
      const totalPool = Number(reader.readU256());

      // Fetch slot pools via batch queries (256 slots, each u256)
      const pools: number[] = new Array(256).fill(0);
      for (let batch = 0; batch < 8; batch++) {
        const start = batch * 32;
        try {
          const batchResult = await contract._getSlotPoolBatch(roundId, start, 32);
          if (!batchResult.revert && batchResult.result) {
            const bReader = batchResult.result;
            bReader.setOffset(0);
            for (let i = 0; i < 32; i++) {
              try {
                pools[start + i] = Number(bReader.readU256());
              } catch {
                break;
              }
            }
          }
        } catch {
          // skip failed batch
        }
      }

      const currentBlock = opnetBlock.height;
      const phase: PotRound['phase'] = isSettled
        ? 'SETTLED'
        : (currentBlock >= targetBlock ? 'DRAWING' : 'BETTING');

      setRound({
        id: Number(roundId),
        targetBlock,
        currentBlock,
        slotPools: pools,
        totalPool,
        phase,
        winnerSlot: isSettled ? winnerSlot : undefined,
        hashByte: isSettled ? winnerSlot : undefined,
      });
    } catch (err) {
      console.warn('HashPot contract poll failed:', err);
    }
  }, [getContract]);

  useEffect(() => {
    if (!tip || initialized.current) return;
    initialized.current = true;

    if (contractsDeployed) {
      pollContractState().then(() => {
        if (!roundRef.current) {
          setRound({
            id: nextId.current,
            targetBlock: tip.height + 1,
            currentBlock: tip.height,
            slotPools: new Array(256).fill(0),
            totalPool: 0,
            phase: 'BETTING',
          });
        }
      });
    } else {
      setRound({
        id: nextId.current,
        targetBlock: tip.height + 1,
        currentBlock: tip.height,
        slotPools: new Array(256).fill(0),
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
      setRound({ ...r, phase: 'DRAWING', currentBlock: tip.height });

      fetchBlockHash(r.targetBlock)
        .then(hash => {
          const lastByte = parseInt(hash.trim().slice(-2), 16);
          const winnerPool = r.slotPools[lastByte];
          const multi = calcMulti(winnerPool, r.totalPool);

          setTimeout(() => {
            setRound({
              ...r,
              phase: 'SETTLED',
              winnerSlot: lastByte,
              hashByte: lastByte,
              currentBlock: tip.height,
            });
            setHistory(prev => [
              { roundId: r.id, winnerSlot: lastByte, totalPool: r.totalPool, winnerPool, multiplier: multi },
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
                slotPools: new Array(256).fill(0),
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
    if (slot < 0 || slot > 255) return;
    const sats = Math.round(amountBtc * 100_000_000);

    if (contractsDeployed) {
      const contract = getContract();
      if (!contract) return;

      setTxPending(true);
      try {
        const simulation = await contract._bet(BigInt(r.id), slot, BigInt(sats));
        if (simulation.revert) {
          console.error('Bet simulation failed:', simulation.revert);
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
    lastBlockTimestamp: contractsDeployed ? (opnetTip?.timestamp ?? null) : (tip?.timestamp ?? null),
    blocksLoading,
    blocksError,
    wsConnected,
  };
}
