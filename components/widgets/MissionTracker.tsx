'use client';

import { useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoProgress from '@/components/ui/NeoProgress';
import missionsData from '@/data/missions.json';

interface Mission {
  title: string;
  status: string;
  progress: number;
  emoji: string;
}

export default function MissionTracker() {
  const [missions] = useState<Mission[]>(missionsData);

  return (
    <NeoCard span="md">
      <h3 className="font-mono text-xs font-bold mb-3 opacity-60">🎯 미션 트래커</h3>
      <div className="space-y-3">
        {missions.map((m, i) => (
          <div key={i} className="rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-800/50 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{m.emoji} {m.title}</span>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${m.status === 'done' ? 'bg-neo-cyan/20 text-neo-cyan border-neo-cyan/30' : 'bg-neo-yellow/20 text-amber-600 dark:text-neo-yellow border-neo-yellow/30'}`}>
                {m.status === 'done' ? '완료' : '진행중'}
              </span>
            </div>
            <NeoProgress value={m.progress} max={100} />
            <div className="text-right font-mono text-xs opacity-50 mt-1">{m.progress}%</div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}
