'use client';

import { useMemo, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import CharacterAvatar from '@/components/ui/CharacterAvatar';

type AgentId = 'claw' | 'clawau' | 'clawbi';

const agentAvatarIdMap: Record<AgentId, 'claw' | 'clawau' | 'clovi'> = {
  claw: 'claw',
  clawau: 'clawau',
  clawbi: 'clovi',
};

interface Message {
  id: string;
  agent: AgentId;
  role: string;
  time: string;
  text: string;
}

interface Artifact {
  name: string;
  href: string;
  description: string;
}

interface Thread {
  id: string;
  title: string;
  status: 'running' | 'done' | 'waiting';
  summary: string;
  focus: string;
  updatedAt: string;
  messages: Message[];
  artifacts: Artifact[];
}

const AGENTS: Record<AgentId, { label: string; tone: string; bubble: string; chip: string; ring: string }> = {
  claw: {
    label: '클로',
    tone: '오케스트레이터',
    bubble: 'bg-white/90 border-white/70 dark:bg-white/[0.04] dark:border-white/10',
    chip: 'text-teal-700 bg-teal-100 dark:text-teal-300 dark:bg-teal-500/15',
    ring: 'from-teal-400/30 to-cyan-400/10',
  },
  clawau: {
    label: '클로아우',
    tone: '기준·감수',
    bubble: 'bg-white/90 border-white/70 dark:bg-white/[0.04] dark:border-white/10',
    chip: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/15',
    ring: 'from-amber-400/25 to-orange-400/10',
  },
  clawbi: {
    label: '클로비',
    tone: '구현·구조',
    bubble: 'bg-white/90 border-white/70 dark:bg-white/[0.04] dark:border-white/10',
    chip: 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-500/15',
    ring: 'from-orange-400/25 to-rose-400/10',
  },
};

const STATUS_LABEL: Record<Thread['status'], string> = {
  running: '진행 중',
  done: '완료',
  waiting: '대기',
};

const STATUS_TONE: Record<Thread['status'], string> = {
  running: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/15',
  done: 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-500/15',
  waiting: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/15',
};

const THREADS: Thread[] = [
  {
    id: 'clawdash-redesign',
    title: 'ClawDash 재설계',
    status: 'running',
    summary: '대화 본문 우선 구조로 재정의',
    focus: '왼쪽은 작업 흐름, 가운데는 실제 협업 대화, 오른쪽은 핵심 요약과 결과물만 남기는 방향.',
    updatedAt: '방금 전',
    messages: [
      {
        id: 'm1',
        agent: 'claw',
        role: '역할 분담',
        time: '00:20',
        text: '지금 ClawDash는 잡기능이 많고 핵심이 흐려졌다. 상태판보다 실제 협업 대화가 먼저 보이게 재설계하자.',
      },
      {
        id: 'm2',
        agent: 'clawau',
        role: '검토 코멘트',
        time: '00:22',
        text: '사용자가 실제로 보고 싶은 건 협업 의미와 판단 흐름입니다. 누가 어떤 기준 코멘트를 남겼는지가 살아 보여야 해요.',
      },
      {
        id: 'm3',
        agent: 'clawbi',
        role: '구현 판단',
        time: '00:25',
        text: '첫 화면을 3단으로 줄이겠습니다. 왼쪽 작업 목록, 가운데 협업 대화 본문, 오른쪽 결과물 링크 구조로 가면 됩니다.',
      },
      {
        id: 'm4',
        agent: 'claw',
        role: '결정',
        time: '00:29',
        text: '좋아. 상태보다 실제 대화 본문이 먼저 읽히는 구조로 고정하자. 클로아우 코멘트도 묻히지 않게 가자.',
      },
    ],
    artifacts: [
      { name: '핵심화면 명세', href: '#', description: '3단 구조 기준 문서' },
      { name: '첫화면 와이어프레임', href: '#', description: '심플 버전 화면안' },
      { name: '로그 데이터구조 초안', href: '#', description: '대화 저장 구조' },
    ],
  },
  {
    id: 'lecture-material',
    title: '동아보건대 강의자료',
    status: 'running',
    summary: '슬라이드와 대본 작업 진행',
    focus: '교육 대상 난이도와 실제 활용 장면을 살리면서 2차시 구조를 명확하게 정리하는 작업.',
    updatedAt: '12분 전',
    messages: [
      {
        id: 'm5',
        agent: 'claw',
        role: '역할 분담',
        time: '23:41',
        text: '동아보건대 강의자료 작업 들어간다. 클로아우는 학생 난이도와 교육적 표현 점검, 클로비는 슬라이드 구조와 감마 흐름 정리 맡아줘.',
      },
      {
        id: 'm6',
        agent: 'clawau',
        role: '검토 코멘트',
        time: '23:45',
        text: '나이 많은 학생도 있다는 점을 반영해야 합니다. 기능 설명보다 실제 활용 장면을 먼저 보여주는 쪽이 교육적으로 더 낫습니다.',
      },
      {
        id: 'm7',
        agent: 'clawbi',
        role: '구현 판단',
        time: '23:50',
        text: '강의자료는 2차시 구조로 나누고, 1교시는 기초 이해, 2교시는 학습 활용 + Gems 쪽으로 정리하겠습니다.',
      },
    ],
    artifacts: [
      { name: '슬라이드별 강의대본', href: '#', description: '녹화용 스크립트 초안' },
      { name: '감마용 프롬프트', href: '#', description: '슬라이드 자동 생성용' },
    ],
  },
  {
    id: 'telegram-recovery',
    title: '클로비 텔레그램 복구',
    status: 'done',
    summary: '응답 복구 상태 확인',
    focus: '지금은 정상 응답 상태이며, 이후에는 왜 복구됐는지 안정화 문서로 남기는 단계.',
    updatedAt: '완료',
    messages: [
      {
        id: 'm8',
        agent: 'claw',
        role: '진단 요청',
        time: '18:02',
        text: '클로비가 왜 polling을 시작하지 않는지 계속 좁혀본다. 설정 문제가 아니라 런타임 문제인지 먼저 확인하자.',
      },
      {
        id: 'm9',
        agent: 'clawbi',
        role: '구현 코멘트',
        time: '18:14',
        text: '토큰과 발신은 정상 확인했다. 문제는 account startup 쪽으로 더 가까워 보인다.',
      },
      {
        id: 'm10',
        agent: 'claw',
        role: '상태 정리',
        time: '00:02',
        text: '사용자 보고 기준으로 현재는 다시 응답하는 상태다. 왜 살아났는지는 후속 안정화 문서로 남긴다.',
      },
    ],
    artifacts: [{ name: '진단 노트', href: '#', description: '복구 과정 기록' }],
  },
];

function getThreadHighlights(thread: Thread) {
  const participants = Array.from(new Set(thread.messages.map((message) => message.agent)));
  return [
    `참여 에이전트 ${participants.length}명`,
    `대화 ${thread.messages.length}개`,
    `결과물 ${thread.artifacts.length}개`,
  ];
}

export default function CollaborationBoard() {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(THREADS[0].id);
  const [selectedAgent, setSelectedAgent] = useState<'all' | AgentId>('all');

  const selectedThread = THREADS.find((thread) => thread.id === selectedThreadId) ?? THREADS[0];

  const visibleMessages = useMemo(() => {
    if (selectedAgent === 'all') return selectedThread.messages;
    return selectedThread.messages.filter((message) => message.agent === selectedAgent);
  }, [selectedAgent, selectedThread]);

  const participants = Array.from(new Set(selectedThread.messages.map((message) => message.agent)));
  const highlights = getThreadHighlights(selectedThread);

  return (
    <div className="space-y-5 px-4 pb-6 pt-3">
      <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.9))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.15),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.12),_transparent_24%),linear-gradient(135deg,_rgba(24,24,27,0.96),_rgba(9,9,11,0.92))]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30 dark:opacity-10" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              협업 로그 중심 리디자인
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white md:text-4xl">
                ClawDash를 더 세련되게,
                <br className="hidden md:block" /> 오른쪽은 정말 필요한 것만 남겼다.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 md:text-base">
                상태판보다 실제 협업 대화가 먼저 읽히고, 오른쪽은 요약과 결과물만 빠르게 확인하는 집중형 레이아웃.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            {[
              { label: '활성 작업', value: `${THREADS.filter((thread) => thread.status === 'running').length}개` },
              { label: '오늘 업데이트', value: '3건' },
              { label: '표시 모드', value: '대화 우선' },
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
        {(['all', 'claw', 'clawau', 'clawbi'] as const).map((agent) => (
          <button
            key={agent}
            type="button"
            onClick={() => setSelectedAgent(agent)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedAgent === agent ? 'border-teal-300 bg-teal-500 text-white shadow-sm shadow-teal-500/20 dark:border-teal-400 dark:bg-teal-400 dark:text-zinc-950' : 'border-black/5 bg-white/70 text-zinc-600 hover:border-teal-200 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-teal-500/40 dark:hover:text-white'}`}
          >
            {agent === 'all' ? '전체 대화' : AGENTS[agent].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_280px]">
        <NeoCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div>
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">작업 흐름</div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">지금 무엇을 굴리고 있는지 한 번에</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-500 dark:bg-white/5 dark:text-zinc-300">{THREADS.length}개</span>
          </div>
          <div className="space-y-3 p-3">
            {THREADS.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${thread.id === selectedThreadId ? 'border-teal-300 bg-[linear-gradient(135deg,rgba(20,184,166,0.1),rgba(255,255,255,0.95))] shadow-[0_16px_40px_rgba(20,184,166,0.12)] dark:border-teal-500/40 dark:bg-[linear-gradient(135deg,rgba(20,184,166,0.14),rgba(255,255,255,0.03))]' : 'border-black/5 bg-white/75 hover:border-teal-200 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.05]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-zinc-950 dark:text-white">{thread.title}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{thread.summary}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE[thread.status]}`}>{STATUS_LABEL[thread.status]}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span>{thread.updatedAt}</span>
                  <span>{thread.messages.length} logs</span>
                </div>
              </button>
            ))}
          </div>
        </NeoCard>

        <NeoCard className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-6 py-5 dark:border-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">{selectedThread.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TONE[selectedThread.status]}`}>{STATUS_LABEL[selectedThread.status]}</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">{selectedThread.focus}</p>
              </div>
              <div className="flex -space-x-2">
                {participants.map((agent) => (
                  <div key={agent} className={`rounded-full bg-gradient-to-br p-[1px] ${AGENTS[agent].ring}`}>
                    <div className="rounded-full border border-white/70 bg-white/85 p-1 shadow-sm dark:border-white/10 dark:bg-zinc-950/85">
                      <CharacterAvatar id={agentAvatarIdMap[agent]} size={34} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-h-[74vh] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent_18%)] p-5 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]">
            {visibleMessages.map((message) => {
              const meta = AGENTS[message.agent];
              return (
                <article key={message.id} className={`rounded-[28px] border p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur ${meta.bubble}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full bg-gradient-to-br p-[1px] ${meta.ring}`}>
                        <div className="rounded-full border border-white/70 bg-white/85 p-1 shadow-sm dark:border-white/10 dark:bg-zinc-950/85">
                          <CharacterAvatar id={agentAvatarIdMap[message.agent]} size={42} />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-950 dark:text-white">{meta.label}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{message.role} · {meta.tone}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}>{message.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-100">{message.text}</p>
                </article>
              );
            })}
            {visibleMessages.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-zinc-300 bg-white/70 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                선택한 에이전트 필터에 해당하는 대화가 없습니다.
              </div>
            )}
          </div>
        </NeoCard>

        <NeoCard className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">핵심만 보기</div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">오른쪽은 요약과 결과물만 남겼다.</p>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-[24px] border border-black/5 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">핵심 요약</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">{selectedThread.focus}</p>
            </div>

            <div className="space-y-2">
              {highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
                  {highlight}
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">결과물</div>
              <div className="space-y-2">
                {selectedThread.artifacts.map((artifact) => (
                  <a
                    key={artifact.name}
                    href={artifact.href}
                    className="block rounded-[22px] border border-black/5 bg-white/85 p-3 transition hover:border-teal-200 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-teal-500/40"
                  >
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{artifact.name}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{artifact.description}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </NeoCard>
      </div>
    </div>
  );
}
