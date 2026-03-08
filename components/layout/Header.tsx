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
    <header className="p-4 mb-6 border-b-4 border-black dark:border-neo-yellow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div>
            <h1 className="font-mono text-3xl font-black uppercase tracking-tight">
              Claw<span className="text-neo-pink">Dash</span>
            </h1>
            <p className="font-mono text-xs opacity-60">{greeting} 윤스케어!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NeoButton onClick={toggle} variant="secondary">
            {dark ? 'LIGHT' : 'DARK'}
          </NeoButton>
        </div>
      </div>
      <div className="border-4 border-black dark:border-neo-yellow bg-neo-yellow/20 dark:bg-neo-yellow/10 p-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-mono text-sm font-black">MISSION STATEMENT</span>
        </div>
        <p className="font-mono text-sm mt-1 font-bold">
          &quot;간호교육 현장의 반복 업무를 자동화하고, AI 활용 교육을 통해 간호직의 미래를 앞당긴다&quot;
        </p>
      </div>
    </header>
  );
}
