'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';

interface AgentData {
  name: string;
  status: 'online' | 'offline';
  uptime: string;
  lastPing: string;
}

export default function AgentStatus() {
  const [agent, setAgent] = useState<AgentData | null>(null);

  useEffect(() => {
    setAgent({
      name: 'OpenClaw Agent',
      status: 'online',
      uptime: '12d 4h 32m',
      lastPing: '3s ago',
    });
  }, []);

  return (
    <NeoCard accent="bg-neo-cyan">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 opacity-60">Agent Status</h3>
      {agent && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-3 h-3 border-2 border-black dark:border-neo-yellow ${agent.status === 'online' ? 'bg-neo-cyan' : 'bg-neo-red'}`}
            />
            <span className="font-mono font-bold">{agent.name}</span>
          </div>
          <NeoBadge variant={agent.status === 'online' ? 'success' : 'error'}>
            {agent.status}
          </NeoBadge>
          <div className="mt-3 space-y-1">
            <div className="text-xs"><span className="font-bold">Uptime:</span> {agent.uptime}</div>
            <div className="text-xs"><span className="font-bold">Last ping:</span> {agent.lastPing}</div>
          </div>
        </>
      )}
    </NeoCard>
  );
}
