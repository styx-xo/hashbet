import { useState, useEffect } from 'react';

export function useBtcPrice(): number | null {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        const data = await res.json() as { bitcoin: { usd: number } };
        setPrice(data.bitcoin.usd);
      } catch {
        // silent — keep last known price
      }
    };
    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, []);

  return price;
}
