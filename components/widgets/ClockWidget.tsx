'use client';

import { useEffect, useState } from 'react';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('ko-KR', { hour12: false, timeZone: 'Asia/Seoul' });
  const date = now.toLocaleDateString('ko-KR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' });

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 flex items-center gap-3">
      <span className="text-lg">🕐</span>
      <span className="font-mono text-2xl font-black tracking-tight">{time}</span>
      <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">{date}</span>
    </div>
  );
}
