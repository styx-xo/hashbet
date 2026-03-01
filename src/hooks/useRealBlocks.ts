import { useState, useEffect, useRef, useCallback } from 'react';
import { OPNET_RPC_URL } from '../lib/config';

const RPC_ENDPOINT = OPNET_RPC_URL + '/api/v1/json-rpc';

export interface BlockTip {
  height: number;
  hash: string;
  timestamp: number; // unix seconds
}

async function rpc(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const json = await res.json() as { result?: unknown; error?: unknown };
  if (json.error) throw new Error(String(json.error));
  return json.result;
}

export async function fetchBlockHash(height: number): Promise<string> {
  const hex = '0x' + height.toString(16);
  const block = await rpc('btc_getBlockByNumber', [hex, false]) as {
    hash?: string;
  } | null;
  if (!block) throw new Error(`Block ${height} not found`);
  return block.hash ?? '';
}

export function useRealBlocks() {
  const [tip, setTip] = useState<BlockTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const pollTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchTip = useCallback(async () => {
    try {
      const heightHex = await rpc('btc_blockNumber') as string;
      const height = parseInt(heightHex, 16);

      const block = await rpc('btc_getBlockByNumber', [heightHex, false]) as {
        hash?: string;
        height?: string;
        time?: number;
      } | null;

      if (!mountedRef.current) return;

      const hash = block?.hash ?? '';
      // time is in milliseconds, convert to seconds
      const timestamp = block?.time
        ? Math.floor(block.time / 1000)
        : Math.floor(Date.now() / 1000);

      setTip({ height, hash, timestamp });
      setError(null);
      setWsConnected(true);
    } catch {
      if (mountedRef.current) {
        setError('Cannot reach OPNet testnet');
        setWsConnected(false);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    fetchTip();
    pollTimer.current = setInterval(fetchTip, 10_000);

    return () => {
      mountedRef.current = false;
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [fetchTip]);

  const secondsUntilNextBlock = tip
    ? Math.max(0, 600 - Math.floor(Date.now() / 1000 - tip.timestamp))
    : null;

  return { tip, loading, error, wsConnected, secondsUntilNextBlock };
}
