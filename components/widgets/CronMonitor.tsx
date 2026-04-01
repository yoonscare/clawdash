'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';

interface CronJob {
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'success' | 'failed' | 'running';
  enabled: boolean;
}

export default function CronMonitor() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/cron')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
        else setError(true);
      })
      .catch(() => setError(true));

    const interval = setInterval(() => {
      fetch('/api/cron').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setJobs(data);
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusVariant = (s: CronJob['status']) =>
    s === 'success' ? 'success' as const : s === 'failed' ? 'error' as const : 'warning' as const;

  return (
    <NeoCard accent="bg-neo-yellow">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">⏰ Cron Monitor</h3>
      {error ? (
        <div className="text-xs opacity-50 font-mono">크론 정보를 가져올 수 없어요</div>
      ) : jobs.length === 0 ? (
        <div className="text-xs opacity-50 font-mono">등록된 크론 잡이 없어요</div>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.name} className={`rounded-xl border border-gray-200 dark:border-zinc-700 p-2 ${!job.enabled ? 'opacity-40' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold truncate">{job.name}</span>
                <NeoBadge variant={statusVariant(job.status)}>
                  {job.status === 'success' ? '✅' : job.status === 'failed' ? '❌' : '⏳'}
                </NeoBadge>
              </div>
              <div className="font-mono text-[10px] opacity-50 space-y-0.5">
                <div>📋 {job.schedule}</div>
                <div>⏮ {job.lastRun}</div>
                {job.nextRun && <div>⏭ {job.nextRun}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
