'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface HealthData {
  steps: number;
  heartRate: number;
  sleep: number;
  calories: number;
}

export default function AppleHealthSync() {
  const [data, setData] = useState<HealthData | null>(null);

  useEffect(() => {
    fetch('/api/widgets?type=health')
      .then(r => r.json())
      .then(setData)
      .catch(() => {
        setData({ steps: 8432, heartRate: 72, sleep: 7.2, calories: 2150 });
      });
  }, []);

  const items = data
    ? [
        { label: 'Steps', value: data.steps.toLocaleString(), icon: '👟', color: 'bg-neo-cyan' },
        { label: 'Heart Rate', value: `${data.heartRate} bpm`, icon: '❤️', color: 'bg-neo-pink' },
        { label: 'Sleep', value: `${data.sleep}h`, icon: '😴', color: 'bg-neo-purple' },
        { label: 'Calories', value: `${data.calories} kcal`, icon: '🔥', color: 'bg-neo-yellow' },
      ]
    : [];

  return (
    <NeoCard accent="bg-neo-pink" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">Apple Health</h3>
      {data ? (
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => (
            <div
              key={item.label}
              className="border-4 border-black dark:border-neo-yellow p-3 text-center"
            >
              <div className={`h-1 ${item.color} -mx-3 -mt-3 mb-2`} />
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="font-mono text-lg font-bold">{item.value}</div>
              <div className="text-xs opacity-60">{item.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center font-mono text-sm animate-pulse">Loading...</div>
      )}
    </NeoCard>
  );
}
