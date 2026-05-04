'use client';

import { useEffect, useState } from 'react';
import NeoButton from '@/components/ui/NeoButton';

export default function Header() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('clawdash-theme');
    const isDark = saved === null ? true : saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('clawdash-theme', nextDark ? 'dark' : 'light');
  };

  return (
    <header className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,247,251,0.9))] px-6 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(24,24,27,0.96),rgba(9,9,11,0.9))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_22%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
              Live workspace
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 dark:text-white md:text-4xl">
              Claw<span className="text-teal-500">Dash</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
              클로 · 클로아우 · 클로비 협업 흐름을 가장 먼저 읽는 대시보드
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-right shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] md:block">
              <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">View mode</div>
              <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversation first</div>
            </div>
            <NeoButton onClick={toggle} variant="secondary" className="rounded-2xl border-white/70 bg-white/75 px-4 dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
              {dark ? '라이트 모드' : '다크 모드'}
            </NeoButton>
          </div>
        </div>
      </div>
    </header>
  );
}
