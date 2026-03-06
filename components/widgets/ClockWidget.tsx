'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('en-US', { hour12: false });
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <NeoCard accent="bg-neo-yellow">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 text-zinc-500 dark:text-zinc-400">Clock</h3>
      <div className="font-mono text-5xl font-black tracking-tight">{time}</div>
      <div className="font-mono text-sm mt-2 text-zinc-600 dark:text-zinc-400">{date}</div>
    </NeoCard>
  );
}
