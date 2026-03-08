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
    <NeoCard accent="bg-neo-yellow" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">🎯 미션 트래커</h3>
      <div className="space-y-3">
        {missions.map((m, i) => (
          <div key={i} className="border-4 border-black dark:border-neo-yellow p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold">{m.emoji} {m.title}</span>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 border-2 border-black dark:border-neo-yellow ${m.status === 'done' ? 'bg-neo-cyan' : 'bg-neo-yellow'}`}>
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
