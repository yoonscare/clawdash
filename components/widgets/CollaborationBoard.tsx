'use client';

import { useMemo, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

type AgentId = 'claw' | 'clawau' | 'clawbi';

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
  updatedAt: string;
  messages: Message[];
  artifacts: Artifact[];
}

const AGENTS: Record<AgentId, { label: string; tone: string; bubble: string; chip: string }> = {
  claw: {
    label: '클로',
    tone: '오케스트레이터',
    bubble: 'bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800',
    chip: 'text-teal-700 bg-teal-100 dark:text-teal-300 dark:bg-teal-900/40',
  },
  clawau: {
    label: '클로아우',
    tone: '기준·감수',
    bubble: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800',
    chip: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40',
  },
  clawbi: {
    label: '클로비',
    tone: '구현·구조',
    bubble: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
    chip: 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/40',
  },
};

const THREADS: Thread[] = [
  {
    id: 'clawdash-redesign',
    title: 'ClawDash 재설계',
    status: 'running',
    summary: '대화 본문 우선 구조로 재정의',
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
    artifacts: [
      { name: '진단 노트', href: '#', description: '복구 과정 기록' },
    ],
  },
];

export default function CollaborationBoard() {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(THREADS[0].id);
  const [selectedAgent, setSelectedAgent] = useState<'all' | AgentId>('all');

  const selectedThread = THREADS.find((thread) => thread.id === selectedThreadId) ?? THREADS[0];

  const visibleMessages = useMemo(() => {
    if (selectedAgent === 'all') return selectedThread.messages;
    return selectedThread.messages.filter((message) => message.agent === selectedAgent);
  }, [selectedAgent, selectedThread]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/80 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">협업 대화가 먼저 보이는 ClawDash</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">작업 목록 / 실제 협업 대화 / 결과물 링크만 남긴 심플 MVP 구조</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'claw', 'clawau', 'clawbi'] as const).map((agent) => (
            <button
              key={agent}
              type="button"
              onClick={() => setSelectedAgent(agent)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${selectedAgent === agent ? 'border-teal-400 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/30 dark:text-teal-300' : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}
            >
              {agent === 'all' ? '전체' : AGENTS[agent].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <NeoCard className="p-0 overflow-hidden">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-semibold dark:border-white/10">작업 목록</div>
          <div className="space-y-2 p-3">
            {THREADS.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${thread.id === selectedThreadId ? 'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/20' : 'border-black/5 bg-white hover:border-teal-200 dark:border-white/10 dark:bg-zinc-900/50'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{thread.title}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{thread.summary}</div>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{thread.status}</span>
                </div>
                <div className="mt-2 text-[11px] text-zinc-400">{thread.updatedAt}</div>
              </button>
            ))}
          </div>
        </NeoCard>

        <NeoCard className="p-0 overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div>
              <h3 className="text-lg font-semibold">{selectedThread.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{selectedThread.summary}</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{selectedThread.status}</span>
          </div>
          <div className="max-h-[70vh] space-y-3 overflow-y-auto p-4">
            {visibleMessages.map((message) => {
              const meta = AGENTS[message.agent];
              return (
                <article key={message.id} className={`rounded-2xl border p-4 ${meta.bubble}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold">{meta.label}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{message.role} · {meta.tone}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${meta.chip}`}>{message.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-100">{message.text}</p>
                </article>
              );
            })}
            {visibleMessages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                선택한 에이전트 필터에 해당하는 대화가 없습니다.
              </div>
            )}
          </div>
        </NeoCard>

        <NeoCard className="p-0 overflow-hidden">
          <div className="border-b border-black/5 px-4 py-3 text-sm font-semibold dark:border-white/10">결과물 / 링크</div>
          <div className="space-y-4 p-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">현재 상태</div>
              <div className="mt-2 rounded-2xl border border-black/5 bg-zinc-50 p-3 text-sm dark:border-white/10 dark:bg-zinc-950/40">{selectedThread.status}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">최근 요약</div>
              <div className="mt-2 rounded-2xl border border-black/5 bg-zinc-50 p-3 text-sm leading-6 dark:border-white/10 dark:bg-zinc-950/40">{selectedThread.summary}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">결과물</div>
              <div className="mt-2 space-y-2">
                {selectedThread.artifacts.map((artifact) => (
                  <a key={artifact.name} href={artifact.href} className="block rounded-2xl border border-black/5 bg-white p-3 transition hover:border-teal-200 hover:bg-teal-50/50 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-teal-800 dark:hover:bg-teal-950/20">
                    <div className="font-medium">{artifact.name}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{artifact.description}</div>
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
