'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import CharacterAvatar from '@/components/ui/CharacterAvatar';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

type AgentId = 'claw' | 'clawau' | 'clawbi' | 'user';

interface AgentMessage {
  id?: number;
  time: string;
  from: string;
  to: string;
  text: string;
}

interface AgentOfficeItem {
  id: 'claw' | 'clawau' | 'clovi';
  name: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
  currentTask: string;
  model: string;
  tokenUsage: number;
}

const AVATAR_MAP: Record<Exclude<AgentId, 'user'>, 'claw' | 'clawau' | 'clovi'> = {
  claw: 'claw',
  clawau: 'clawau',
  clawbi: 'clovi',
};

const PERSON_META: Record<AgentId, { label: string; accent: string; chip: string }> = {
  claw: {
    label: '클로',
    accent: 'from-teal-400/25 to-cyan-400/10',
    chip: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  },
  clawau: {
    label: '클로아우',
    accent: 'from-amber-400/25 to-orange-400/10',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  clawbi: {
    label: '클로비',
    accent: 'from-orange-400/25 to-rose-400/10',
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  },
  user: {
    label: '윤 스케어',
    accent: 'from-violet-400/20 to-fuchsia-400/10',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
};

const STATUS_META = {
  online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  idle: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  offline: 'bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400',
} as const;

function toAgentId(name: string): AgentId {
  if (name === '클로') return 'claw';
  if (name === '클로아우') return 'clawau';
  if (name === '클로비') return 'clawbi';
  return 'user';
}

function UserAvatar() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#d946ef)] text-sm font-semibold text-white">
      윤
    </div>
  );
}

export default function CollaborationBoard() {
  const [agents, setAgents] = useState<AgentOfficeItem[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<'all' | AgentId>('all');
  const { data: messages, loading } = useSupabaseRealtime<AgentMessage>({
    table: 'agent_chat',
    fetchUrl: '/api/agent-chat',
  });

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agent-office');
      if (!res.ok) return;
      const data = await res.json();
      setAgents(data.agents || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  const visibleMessages = useMemo(() => {
    if (selectedSpeaker === 'all') return messages;
    return messages.filter((message) => toAgentId(message.from) === selectedSpeaker || toAgentId(message.to) === selectedSpeaker);
  }, [messages, selectedSpeaker]);

  const lastMessage = messages[messages.length - 1];
  const activeAgents = agents.filter((agent) => agent.status !== 'offline').length;

  return (
    <div className="space-y-5 px-4 pb-6 pt-3">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.9))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.15),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.12),_transparent_24%),linear-gradient(135deg,_rgba(24,24,27,0.96),_rgba(9,9,11,0.92))]">
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white md:text-3xl">실시간 협업 보기</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">실제 로그가 들어오면 여기서 바로 갱신됩니다.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            {[
              { label: '대화 수', value: `${messages.length}` },
              { label: '활성 에이전트', value: `${activeAgents}` },
              { label: '상태', value: loading ? '연결 중' : '수신 중' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">{item.label}</div>
                <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'claw', 'clawau', 'clawbi', 'user'] as const).map((speaker) => (
          <button
            key={speaker}
            type="button"
            onClick={() => setSelectedSpeaker(speaker)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedSpeaker === speaker ? 'border-teal-300 bg-teal-500 text-white shadow-sm shadow-teal-500/20 dark:border-teal-400 dark:bg-teal-400 dark:text-zinc-950' : 'border-black/5 bg-white/70 text-zinc-600 hover:border-teal-200 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-teal-500/40 dark:hover:text-white'}`}
          >
            {speaker === 'all' ? '전체' : PERSON_META[speaker].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_280px]">
        <NeoCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">에이전트 상태</div>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-white/5 dark:text-zinc-300">{agents.length || 3}명</span>
          </div>
          <div className="space-y-3 p-3">
            {agents.map((agent) => {
              const key = agent.id === 'clovi' ? 'clawbi' : (agent.id as Exclude<AgentId, 'user'>);
              return (
                <div key={agent.id} className="rounded-[24px] border border-black/5 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full bg-gradient-to-br p-[1px] ${PERSON_META[key].accent}`}>
                      <div className="rounded-full border border-white/70 bg-white/85 p-1 dark:border-white/10 dark:bg-zinc-950/85">
                        <CharacterAvatar id={AVATAR_MAP[key]} size={38} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-zinc-950 dark:text-white">{agent.name}</div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_META[agent.status]}`}>{agent.status}</span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{agent.lastActivity || '알 수 없음'}</div>
                      <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">{agent.currentTask}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </NeoCard>

        <NeoCard className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-6 py-5 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">실시간 대화</h3>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-white/5 dark:text-zinc-300">{visibleMessages.length}개</span>
            </div>
          </div>

          <div className="max-h-[74vh] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent_18%)] p-5 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]">
            {visibleMessages.map((message, index) => {
              const fromId = toAgentId(message.from);
              const meta = PERSON_META[fromId];
              return (
                <article key={`${message.time}-${message.from}-${index}`} className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full bg-gradient-to-br p-[1px] ${meta.accent}`}>
                        <div className="rounded-full border border-white/70 bg-white/85 p-1 shadow-sm dark:border-white/10 dark:bg-zinc-950/85">
                          {fromId === 'user' ? <UserAvatar /> : <CharacterAvatar id={AVATAR_MAP[fromId]} size={40} />}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-950 dark:text-white">{message.from}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">→ {message.to}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}>{message.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-100">{message.text}</p>
                </article>
              );
            })}

            {!loading && visibleMessages.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-zinc-300 bg-white/70 p-6 text-sm leading-6 text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                아직 들어온 실제 로그가 없습니다.
                <br />
                로컬 브리지가 agent_chat 테이블로 밀어주기 시작하면 여기서 바로 보입니다.
              </div>
            )}
          </div>
        </NeoCard>

        <NeoCard className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">요약</div>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-[24px] border border-black/5 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">최근 업데이트</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">{lastMessage ? `${lastMessage.from} → ${lastMessage.to}` : '아직 없음'}</p>
            </div>

            <div className="rounded-[24px] border border-black/5 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">최근 문장</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">{lastMessage?.text || '로그가 들어오면 마지막 대화가 여기에 표시됩니다.'}</p>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}
