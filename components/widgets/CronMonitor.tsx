'use client';

import { useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';

interface CronJob {
  name: string;
  schedule: string;
  lastRun: string;
  status: 'success' | 'failed' | 'running';
}

const SAMPLE_JOBS: CronJob[] = [
  { name: 'health-sync', schedule: '*/15 * * * *', lastRun: '2 min ago', status: 'success' },
  { name: 'news-fetch', schedule: '0 * * * *', lastRun: '32 min ago', status: 'success' },
  { name: 'crypto-update', schedule: '*/5 * * * *', lastRun: '1 min ago', status: 'running' },
  { name: 'backup-data', schedule: '0 0 * * *', lastRun: '8h ago', status: 'failed' },
];

export default function CronMonitor() {
  const [jobs] = useState<CronJob[]>(SAMPLE_JOBS);

  const statusVariant = (s: CronJob['status']) =>
    s === 'success' ? 'success' as const : s === 'failed' ? 'error' as const : 'warning' as const;

  return (
    <NeoCard accent="bg-neo-yellow" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">Cron Monitor</h3>
      <div className="space-y-2">
        {jobs.map(job => (
          <div key={job.name} className="flex items-center justify-between border-4 border-black dark:border-neo-yellow p-2 px-3">
            <div>
              <div className="font-mono text-sm font-bold">{job.name}</div>
              <div className="text-xs opacity-50 font-mono">{job.schedule}</div>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-xs opacity-50">{job.lastRun}</span>
              <NeoBadge variant={statusVariant(job.status)}>{job.status}</NeoBadge>
            </div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}
