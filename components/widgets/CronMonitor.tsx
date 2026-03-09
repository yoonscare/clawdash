'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';

interface CronJob {
  name: string;
  schedule: string;
  lastRun: string;
  status: 'success' | 'failed' | 'running';
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
  }, []);

  const statusVariant = (s: CronJob['status']) =>
    s === 'success' ? 'success' as const : s === 'failed' ? 'error' as const : 'warning' as const;

  return (
    <NeoCard accent="bg-neo-yellow" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">Cron Monitor</h3>
      {error ? (
        <div className="text-xs opacity-50 font-mono">Failed to load cron jobs</div>
      ) : jobs.length === 0 ? (
        <div className="text-xs opacity-50 font-mono">Loading...</div>
      ) : (
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
      )}
    </NeoCard>
  );
}
