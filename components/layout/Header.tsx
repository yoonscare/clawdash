'use client';

import { useEffect, useState } from 'react';
import NeoButton from '@/components/ui/NeoButton';

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('clawdash-dark');
    if (saved === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('clawdash-dark', String(!dark));
  };

  return (
    <header className="flex items-center justify-between p-4 mb-6 border-b-4 border-black dark:border-neo-yellow">
      <div className="flex items-center gap-3">
        <span className="text-4xl">&#129438;</span>
        <h1 className="font-mono text-3xl font-black uppercase tracking-tight">
          Claw<span className="text-neo-pink">Dash</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <NeoButton onClick={toggle} variant="secondary">
          {dark ? 'LIGHT' : 'DARK'}
        </NeoButton>
      </div>
    </header>
  );
}
