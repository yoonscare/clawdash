'use client';

import { useRef, useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import CharacterAvatar from '@/components/ui/CharacterAvatar';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

interface AgentMsg {
  time: string;
  from: string;
  to: string;
  text: string;
}

const agentCharId: Record<string, 'claw' | 'clawau' | 'clovi'> = {
  '클로': 'claw',
  '클로아우': 'clawau',
  '클로비': 'clovi',
};

const agentEmoji: Record<string, string> = {
  '클로': '🦦',
  '클로아우': '🐾',
  '클로비': '🦫',
};

const agentBubbleColor: Record<string, string> = {
  '클로': 'border-l-teal-400 bg-teal-50 dark:bg-teal-950/20',
  '클로아우': 'border-l-amber-400 bg-amber-50 dark:bg-amber-950/20',
  '클로비': 'border-l-orange-400 bg-orange-50 dark:bg-orange-950/20',
};

const agentNameColor: Record<string, string> = {
  '클로': 'text-teal-600 dark:text-teal-400',
  '클로아우': 'text-amber-600 dark:text-amber-400',
  '클로비': 'text-orange-600 dark:text-orange-400',
};

const REALTIME_OPTIONS = {
  table: 'agent_chat',
  fetchUrl: '/api/agent-chat',
} as const;

export default function AgentChat() {
  const { data: messages, loading } = useSupabaseRealtime<AgentMsg>(REALTIME_OPTIONS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (scrollRef.current && expanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, expanded]);

  const previewMessages = messages.slice(-2);
  const displayMessages = expanded ? messages : previewMessages;

  return (
    <NeoCard accent="bg-neo-green" span="full">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-sm font-bold text-zinc-700 dark:text-zinc-200">
            💬 클로패밀리 대화
          </h3>
          {messages.length > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 animate-pulse">
              LIVE · {messages.length}건
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <CharacterAvatar id="claw" size={20} />
            <CharacterAvatar id="clawau" size={20} />
            <CharacterAvatar id="clovi" size={20} />
          </div>
          <span className="text-sm text-zinc-400 transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-12 flex items-center justify-center font-mono text-sm animate-pulse mt-2">
          대화 불러오는 중...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-3 mt-2 opacity-50">
          <span className="text-xl">🦦🐻🦫</span>
          <span className="font-mono text-sm">아직 대화가 없어요</span>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className={`mt-3 space-y-2 overflow-y-auto transition-all duration-300 ${expanded ? 'max-h-[400px]' : 'max-h-[120px]'}`}
        >
          {displayMessages.map((msg, i) => {
            const charId = agentCharId[msg.from] || 'claw';
            const bubbleColor = agentBubbleColor[msg.from] || 'border-l-gray-300 bg-gray-50';
            const nameColor = agentNameColor[msg.from] || 'text-gray-500';

            return (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex-shrink-0 mt-0.5">
                  <CharacterAvatar id={charId} size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`font-mono text-xs font-bold ${nameColor}`}>{msg.from}</span>
                    <span className="text-[10px] opacity-30">→</span>
                    <span className="text-[10px] opacity-40">{agentEmoji[msg.to]} {msg.to}</span>
                    <span className="text-[10px] opacity-25 ml-auto">{msg.time}</span>
                  </div>
                  <div className={`px-3 py-2 border-l-3 rounded-lg text-sm leading-relaxed ${bubbleColor}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expand hint */}
      {!expanded && messages.length > 2 && (
        <div
          className="mt-2 text-center text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 transition-colors"
          onClick={() => setExpanded(true)}
        >
          ↓ {messages.length - 2}건 더 보기
        </div>
      )}
    </NeoCard>
  );
}
