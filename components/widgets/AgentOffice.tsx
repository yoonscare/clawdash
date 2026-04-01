'use client';

import { useEffect, useState, useCallback } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import CharacterAvatar from '@/components/ui/CharacterAvatar';

interface AgentData {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
  currentTask: string;
  model: string;
  tokenUsage: number;
}

const agentProfiles: Record<string, {
  charId: 'claw' | 'clawau' | 'clovi';
  role: string;
  intro: string;
  keywords: string[];
  signature: string;
  gradient: string;
  statusGlow: string;
  borderColor: string;
}> = {
  claw: {
    charId: 'claw',
    role: '메인 비서 / 오케스트레이터',
    intro: '흐름을 읽고, 도구를 골라, 일을 굴리는 수달 비서',
    keywords: ['차분함', '유연함', '실용적'],
    signature: '한번 씻어볼게 🦦',
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30',
    statusGlow: 'shadow-teal-200 dark:shadow-teal-800',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  clawau: {
    charId: 'clawau',
    role: '간호교육 전문 브레인 / 문서 감수',
    intro: '기준과 맥락을 지키며, 문서와 내용을 단단하게 만드는 곰 브레인',
    keywords: ['든든함', '성실함', '꼼꼼함'],
    signature: '기준부터 맞춰볼게요 🐻',
    gradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30',
    statusGlow: 'shadow-amber-200 dark:shadow-amber-800',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  clovi: {
    charId: 'clovi',
    role: '빌더 / 시스템 메이커',
    intro: '구조를 짓고, 자동화를 엮고, 결과물이 남게 만드는 비버 빌더',
    keywords: ['뚝심', '제작자 기질', '공학적 사고'],
    signature: '기둥부터 세울게 🦫',
    gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    statusGlow: 'shadow-orange-200 dark:shadow-orange-800',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
};

const defaultAgents: AgentData[] = [
  { id: 'claw', name: '클로', emoji: '🦦', status: 'online', lastActivity: '', currentTask: '대기 중', model: '', tokenUsage: 0 },
  { id: 'clawau', name: '클로아우', emoji: '🐻', status: 'idle', lastActivity: '', currentTask: '대기 중', model: '', tokenUsage: 0 },
  { id: 'clovi', name: '클로비', emoji: '🦫', status: 'offline', lastActivity: '', currentTask: '대기 중', model: '', tokenUsage: 0 },
];

const statusConfig: Record<string, { label: string; color: string; dot: string; pulse?: boolean }> = {
  online: { label: '작업 중', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-400', pulse: true },
  idle: { label: '대기 중', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-400' },
  offline: { label: '오프라인', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
};

export default function AgentOffice() {
  const [agents, setAgents] = useState<AgentData[]>(defaultAgents);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agent-office');
      if (!res.ok) return;
      const data = await res.json();
      setAgents(data.agents);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return (
    <NeoCard accent="bg-neo-cyan" span="lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-mono text-sm font-bold opacity-70">
          🏠 클로패밀리
        </h3>
        <span className="text-xs opacity-40 font-mono">Family Dashboard</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const profile = agentProfiles[agent.id] || agentProfiles.claw;
          const status = statusConfig[agent.status] || statusConfig.offline;

          return (
            <div
              key={agent.id}
              className={`
                relative rounded-2xl border-2 ${profile.borderColor}
                bg-gradient-to-br ${profile.gradient}
                p-5 transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                ${agent.status === 'online' ? `shadow-md ${profile.statusGlow}` : ''}
              `}
            >
              {/* Avatar + Status */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <CharacterAvatar id={profile.charId} size={64} />
                  {/* Status dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${status.dot} border-2 border-white dark:border-zinc-800 ${status.pulse ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold">{agent.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 font-mono mt-0.5">{profile.role}</p>
                </div>
              </div>

              {/* Intro */}
              <p className="text-sm leading-relaxed opacity-70 mb-3">
                {profile.intro}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {profile.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 opacity-70"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Current Task */}
              <div className="border-t border-black/5 dark:border-white/5 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono opacity-40">현재 작업</span>
                  {agent.lastActivity && (
                    <span className="text-[10px] font-mono opacity-30">{agent.lastActivity}</span>
                  )}
                </div>
                <p className="text-xs font-mono mt-0.5 opacity-60 truncate">{agent.currentTask}</p>
              </div>

              {/* Signature quote */}
              <div className="mt-3 text-[11px] italic opacity-40 text-center">
                &ldquo;{profile.signature}&rdquo;
              </div>
            </div>
          );
        })}
      </div>
    </NeoCard>
  );
}
