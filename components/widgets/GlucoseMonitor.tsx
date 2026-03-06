'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoProgress from '@/components/ui/NeoProgress';
import { NeoLineChart, NeoDonutChart } from '@/components/ui/NeoChart';

interface GlucoseData {
  current: number;
  trend: string;
  trendArrow: string;
  history: { time: string; value: number }[];
  tir: { inRange: number; high: number; low: number };
}

export default function GlucoseMonitor() {
  const [data, setData] = useState<GlucoseData | null>(null);

  useEffect(() => {
    fetch('/api/widgets?type=glucose')
      .then(r => r.json())
      .then(setData)
      .catch(() => {
        setData({
          current: 118,
          trend: 'stable',
          trendArrow: '→',
          history: generateGlucoseHistory(),
          tir: { inRange: 72, high: 18, low: 10 },
        });
      });
  }, []);

  const tirData = data
    ? [
        { name: 'In Range', value: data.tir.inRange, color: '#4ECDC4' },
        { name: 'High', value: data.tir.high, color: '#FFE66D' },
        { name: 'Low', value: data.tir.low, color: '#FF4757' },
      ]
    : [];

  return (
    <NeoCard accent="bg-neo-red" span="lg">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 opacity-60">Glucose Monitor</h3>
      {data ? (
        <>
          <div className="flex items-center gap-4 mb-3">
            <div>
              <span className="font-mono text-4xl font-extrabold">{data.current}</span>
              <span className="font-mono text-lg ml-1">mg/dL</span>
            </div>
            <span className="text-3xl">{data.trendArrow}</span>
            <NeoProgress value={data.tir.inRange} color="bg-neo-cyan" label={`TIR ${data.tir.inRange}%`} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <NeoLineChart data={data.history} dataKey="value" xKey="time" color="#4ECDC4" height={140} />
            </div>
            <div>
              <NeoDonutChart data={tirData} height={140} />
            </div>
          </div>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center font-mono text-sm animate-pulse">Loading...</div>
      )}
    </NeoCard>
  );
}

function generateGlucoseHistory() {
  const points = [];
  for (let i = 23; i >= 0; i--) {
    points.push({ time: `${(24 - i).toString().padStart(2, '0')}:00`, value: Math.round(70 + Math.random() * 130) });
  }
  return points;
}
