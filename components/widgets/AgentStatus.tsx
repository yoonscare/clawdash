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
      name: '클로 🐾',
      status: 'online',
      uptime: '항상 대기중',
      lastPing: '방금 전',
    });
  }, []);

  return (
    <NeoCard accent="bg-neo-cyan">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 opacity-60">🤖 에이전트</h3>
      {agent && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-3 h-3 rounded-full ${agent.status === 'online' ? 'bg-neo-cyan' : 'bg-neo-red'}`}
            />
            <span className="font-mono font-bold">{agent.name}</span>
          </div>
          <NeoBadge variant={agent.status === 'online' ? 'success' : 'error'}>
            {agent.status === 'online' ? '온라인' : '오프라인'}
          </NeoBadge>
          <div className="mt-3 space-y-1">
            <div className="text-xs"><span className="font-bold">상태:</span> {agent.uptime}</div>
            <div className="text-xs"><span className="font-bold">마지막 응답:</span> {agent.lastPing}</div>
          </div>
        </>
      )}
    </NeoCard>
  );
}
