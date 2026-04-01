'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('ko-KR', { hour12: false, timeZone: 'Asia/Seoul' });
  const date = now.toLocaleDateString('ko-KR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' });

  return (
    <NeoCard>
      <h3 className="font-mono text-xs font-bold mb-2 text-zinc-500 dark:text-zinc-400">🕐 시계</h3>
      <div className="font-mono text-5xl font-black tracking-tight">{time}</div>
      <div className="font-mono text-sm mt-2 text-zinc-600 dark:text-zinc-400">{date}</div>
    </NeoCard>
  );
}
