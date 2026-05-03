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

  return (
    <header className="p-4 pb-0">
      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/80 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🦦🐻🦫</span>
          <div>
            <h1 className="font-mono text-3xl font-black tracking-tight">
              Claw<span className="text-neo-pink">Dash</span>
            </h1>
            <p className="font-mono text-xs opacity-60">클로 · 클로아우 · 클로비 협업 대화가 먼저 보이는 화면</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NeoButton onClick={toggle} variant="secondary">
            {dark ? '☀️ Light' : '🌙 Dark'}
          </NeoButton>
        </div>
      </div>
    </header>
  );
}
