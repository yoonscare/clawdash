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
  skills: { icon: string; label: string }[];
  tools: string[];
  recentWins: string[];
  signature: string;
  gradient: string;
  statusGlow: string;
  borderColor: string;
  accentColor: string;
}> = {
  claw: {
    charId: 'claw',
    role: '메인 비서 / 오케스트레이터',
    intro: '흐름을 읽고, 도구를 골라, 일을 굴리는 수달 비서',
    skills: [
      { icon: '📅', label: '일정 관리' },
      { icon: '🔄', label: '자동화' },
      { icon: '📝', label: '옵시디언 정리' },
      { icon: '🌐', label: '웹 검색' },
      { icon: '🤝', label: '에이전트 조율' },
    ],
    tools: ['텔레그램', '캘린더', '옵시디언', 'Cron', 'GitHub'],
    recentWins: ['대시보드 카와이 리디자인', '클로패밀리 캐릭터 정리'],
    signature: '한번 씻어볼게 🦦',
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30',
    statusGlow: 'shadow-teal-200 dark:shadow-teal-800',
    borderColor: 'border-teal-200 dark:border-teal-800',
    accentColor: 'bg-teal-500',
  },
  clawau: {
    charId: 'clawau',
    role: '간호교육 전문 브레인 / 문서 감수',
    intro: '기준과 맥락을 지키며, 문서와 내용을 단단하게 만드는 곰 브레인',
    skills: [
      { icon: '📋', label: '인증평가 분석' },
      { icon: '📄', label: '문서 감수' },
      { icon: '🎓', label: '교육과정 검토' },
      { icon: '📊', label: '기준 대조' },
      { icon: '✍️', label: '보고서 작성' },
    ],
    tools: ['HWPX', '옵시디언', '학술DB', 'PDF 분석'],
    recentWins: ['인증평가 앱 기준 검토', '수업계획서 구조화'],
    signature: '기준부터 맞춰볼게요 🐻',
    gradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30',
    statusGlow: 'shadow-amber-200 dark:shadow-amber-800',
    borderColor: 'border-amber-200 dark:border-amber-800',
    accentColor: 'bg-amber-500',
  },
  clovi: {
    charId: 'clovi',
    role: '빌더 / 시스템 메이커',
    intro: '구조를 짓고, 자동화를 엮고, 결과물이 남게 만드는 비버 빌더',
    skills: [
      { icon: '🏗️', label: '앱 개발' },
      { icon: '🎨', label: 'UI/UX 제작' },
      { icon: '⚙️', label: '자동화 흐름' },
      { icon: '📊', label: '대시보드 구축' },
      { icon: '🧪', label: '프로토타입' },
    ],
    tools: ['Next.js', 'Vercel', 'Supabase', 'Python', 'API'],
    recentWins: ['ClawDash 대시보드 제작', '카드뉴스 웹 프로젝트'],
    signature: '기둥부터 세울게 🦫',
    gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30',
    statusGlow: 'shadow-orange-200 dark:shadow-orange-800',
    borderColor: 'border-orange-200 dark:border-orange-800',
    accentColor: 'bg-orange-500',
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
    <NeoCard accent="bg-neo-cyan" span="full">
      <div className="flex items-center gap-2 mb-5">
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
                p-4 transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                ${agent.status === 'online' ? `shadow-md ${profile.statusGlow}` : ''}
              `}
            >
              {/* Header: Avatar + Name + Status */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <CharacterAvatar id={profile.charId} size={48} />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${status.dot} border-2 border-white dark:border-zinc-800 ${status.pulse ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold">{agent.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 font-mono">{profile.role}</p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="mb-2.5">
                <p className="text-xs font-mono font-bold opacity-50 mb-1 uppercase">할 수 있는 일</p>
                <div className="grid grid-cols-2 gap-1">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill.label}
                      className="flex items-center gap-1.5 text-[13px] py-1 px-2 rounded-lg bg-white/60 dark:bg-white/10"
                    >
                      <span>{skill.icon}</span>
                      <span className="opacity-80">{skill.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="mb-2.5">
                <p className="text-xs font-mono font-bold opacity-50 mb-1 uppercase">사용 도구</p>
                <div className="flex flex-wrap gap-1">
                  {profile.tools.map((tool) => (
                    <span
                      key={tool}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full text-white ${profile.accentColor}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Wins */}
              <div className="mb-2">
                <p className="text-xs font-mono font-bold opacity-50 mb-1 uppercase">최근 성과</p>
                {profile.recentWins.map((win) => (
                  <div key={win} className="flex items-center gap-1.5 text-[13px] opacity-75">
                    <span>✅</span>
                    <span>{win}</span>
                  </div>
                ))}
              </div>

              {/* Current Task */}
              <div className="border-t border-black/5 dark:border-white/5 pt-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-mono opacity-40">현재 작업</span>
                  {agent.lastActivity && (
                    <span className="text-[10px] font-mono opacity-30">{agent.lastActivity}</span>
                  )}
                </div>
                <p className="text-xs font-mono opacity-60 truncate">{agent.currentTask}</p>
              </div>

              {/* Signature */}
              <div className="mt-2 text-xs italic opacity-40 text-center">
                &ldquo;{profile.signature}&rdquo;
              </div>
            </div>
          );
        })}
      </div>
    </NeoCard>
  );
}
