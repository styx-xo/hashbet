import { useState, useEffect, useRef, useCallback } from 'react';

const HTTP_API = 'https://mempool.space/api';
const WS_URL   = 'wss://mempool.space/api/v1/ws';

export interface BlockTip {
  height: number;
  hash: string;
  timestamp: number; // unix seconds
}

export async function fetchBlockHash(height: number): Promise<string> {
  const res = await fetch(`${HTTP_API}/block-height/${height}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export function useRealBlocks() {
  const [tip, setTip] = useState<BlockTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const wsRef        = useRef<WebSocket | null>(null);
  const pollTimer    = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef   = useRef(true);

  // ── HTTP fallback: fetch tip + timestamp ────────────────────────
  const fetchTip = useCallback(async () => {
    try {
      const hRes   = await fetch(`${HTTP_API}/blocks/tip/height`);
      const height: number = await hRes.json();

      const hashRes = await fetch(`${HTTP_API}/block-height/${height}`);
      const hash    = await hashRes.text();

      const bRes  = await fetch(`${HTTP_API}/block/${hash}`);
      const block = await bRes.json() as { timestamp: number };

      if (!mountedRef.current) return;
      setTip({ height, hash, timestamp: block.timestamp });
      setError(null);
    } catch {
      if (mountedRef.current) setError('Cannot reach Bitcoin network');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // ── WebSocket connection ────────────────────────────────────────
  const connectWs = useCallback(() => {
    if (!mountedRef.current) return;

    // Clean up any existing socket
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) { ws.close(); return; }
      // Subscribe to new block events
      ws.send(JSON.stringify({ action: 'want', data: ['blocks'] }));
      setWsConnected(true);
      setError(null);
      // Stop the HTTP fallback poll — WS has us covered
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };

    ws.onmessage = async (event: MessageEvent) => {
      if (!mountedRef.current) return;
      try {
        const msg = JSON.parse(event.data as string) as {
          block?: { id: string; height: number; timestamp: number };
        };

        if (msg.block) {
          // New block arrived — instant update
          setTip({
            height:    msg.block.height,
            hash:      msg.block.id,
            timestamp: msg.block.timestamp,
          });
          setLoading(false);
          setError(null);
        }
      } catch {
        // Non-JSON or irrelevant message — ignore
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setWsConnected(false);
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setWsConnected(false);

      // Fall back to HTTP polling while reconnecting
      if (!pollTimer.current) {
        pollTimer.current = setInterval(fetchTip, 15_000);
      }

      // Reconnect after 5s
      reconnectRef.current = setTimeout(() => {
        if (mountedRef.current) connectWs();
      }, 5_000);
    };
  }, [fetchTip]);

  // ── Mount / unmount ─────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    // Always do an initial HTTP fetch so we have data immediately
    fetchTip().then(() => {
      // Then open WebSocket for real-time updates
      if (mountedRef.current) connectWs();
    });

    return () => {
      mountedRef.current = false;

      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (pollTimer.current)    clearInterval(pollTimer.current);

      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect loop on unmount
        wsRef.current.close();
      }
    };
  }, [fetchTip, connectWs]);

  // ── Derived: estimated seconds until next block ─────────────────
  const secondsUntilNextBlock = tip
    ? Math.max(0, 600 - Math.floor(Date.now() / 1000 - tip.timestamp))
    : null;

  return { tip, loading, error, wsConnected, secondsUntilNextBlock };
}
