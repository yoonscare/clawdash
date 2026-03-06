'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';
import { NeoLineChart } from '@/components/ui/NeoChart';

interface CryptoData {
  price: number;
  change24h: number;
  history: { time: string; price: number }[];
}

export default function CryptoTracker() {
  const [data, setData] = useState<CryptoData | null>(null);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
      .then(r => r.json())
      .then(json => {
        const btc = json.bitcoin;
        const price = btc?.usd ?? 65000;
        const change = btc?.usd_24h_change ?? 2.5;
        setData({ price, change24h: change, history: generateHistory(price) });
      })
      .catch(() => {
        setData({ price: 65432, change24h: 2.34, history: generateHistory(65432) });
      });
  }, []);

  return (
    <NeoCard accent="bg-neo-purple" span="lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-xs font-bold uppercase opacity-60">Crypto</h3>
        <NeoBadge variant="info">BTC/USD</NeoBadge>
      </div>
      {data ? (
        <>
          <div className="flex items-end gap-3 mb-3">
            <span className="font-mono text-3xl font-extrabold">
              ${data.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className={`font-mono text-sm font-bold ${data.change24h >= 0 ? 'text-neo-cyan' : 'text-neo-red'}`}>
              {data.change24h >= 0 ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
            </span>
          </div>
          <NeoLineChart data={data.history} dataKey="price" xKey="time" color="#A855F7" height={160} />
        </>
      ) : (
        <div className="h-48 flex items-center justify-center font-mono text-sm animate-pulse">Loading...</div>
      )}
    </NeoCard>
  );
}

function generateHistory(current: number) {
  const points = [];
  for (let i = 23; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * current * 0.03;
    points.push({ time: `${(24 - i).toString().padStart(2, '0')}:00`, price: Math.round(current + variance) });
  }
  return points;
}
