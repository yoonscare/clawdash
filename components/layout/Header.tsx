'use client';

import { useEffect, useState } from 'react';
import NeoButton from '@/components/ui/NeoButton';

export default function Header() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('clawdash-dark');
    const isDark = saved === null ? true : saved === 'true';
    setDark(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('clawdash-dark', String(!dark));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '좋은 아침이야 ☀️' : hour < 18 ? '오후도 화이팅 💪' : '수고했어 오늘도 🌙';

  return (
    <header className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div>
            <h1 className="font-mono text-3xl font-black tracking-tight">
              Claw<span className="text-neo-pink">Dash</span>
            </h1>
            <p className="font-mono text-xs opacity-60">{greeting} 윤스케어!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NeoButton onClick={toggle} variant="secondary">
            {dark ? '☀️ Light' : '🌙 Dark'}
          </NeoButton>
        </div>
      </div>
      <div className="rounded-2xl bg-neo-yellow/10 dark:bg-neo-yellow/5 border border-neo-yellow/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-mono text-sm font-bold">Mission</span>
        </div>
        <p className="text-sm mt-1 opacity-70">
          &quot;간호교육 현장의 반복 업무를 자동화하고, AI 활용 교육을 통해 간호직의 미래를 앞당긴다&quot;
        </p>
      </div>
    </header>
  );
}
