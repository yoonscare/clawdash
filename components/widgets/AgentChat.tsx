'use client';

import { useRef, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import CharacterAvatar from '@/components/ui/CharacterAvatar';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

interface AgentMsg {
  time: string;
  from: string;
  to: string;
  text: string;
}

const agentEmoji: Record<string, string> = {
  '클로': '🦦',
  '클로아우': '🐾',
  '클로비': '🦫',
};

const agentCharId: Record<string, string> = {
  '클로': 'claw',
  '클로아우': 'clawau',
  '클로비': 'clovi',
};

const agentBubbleColor: Record<string, string> = {
  '클로': 'border-l-neo-cyan bg-neo-cyan/10 dark:bg-neo-cyan/5',
  '클로아우': 'border-l-amber-500 bg-amber-500/10 dark:bg-amber-500/5',
  '클로비': 'border-l-orange-700 bg-orange-700/10 dark:bg-orange-700/5',
};

const agentNameColor: Record<string, string> = {
  '클로': 'text-neo-cyan',
  '클로아우': 'text-amber-500',
  '클로비': 'text-orange-600',
};

const REALTIME_OPTIONS = {
  table: 'agent_chat',
  fetchUrl: '/api/agent-chat',
} as const;

export default function AgentChat() {
  const { data: messages, loading } = useSupabaseRealtime<AgentMsg>(REALTIME_OPTIONS);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <NeoCard accent="bg-neo-green" span="full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-sm font-bold uppercase opacity-80">
            💬 클로패밀리 대화
          </h3>
          <span className="font-mono text-[10px] px-2 py-0.5 border-2 border-black dark:border-neo-yellow bg-neo-green/30 font-bold">
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CharacterAvatar id="claw" size={24} />
            <span className="font-mono text-[10px] font-bold text-neo-cyan">클로</span>
          </div>
          <div className="flex items-center gap-1">
            <CharacterAvatar id="clawau" size={24} />
            <span className="font-mono text-[10px] font-bold text-amber-500">클로아우</span>
          </div>
          <div className="flex items-center gap-1">
            <CharacterAvatar id="clovi" size={24} />
            <span className="font-mono text-[10px] font-bold text-orange-600">클로비</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center font-mono text-sm animate-pulse">
          대화 불러오는 중...
        </div>
      ) : messages.length === 0 ? (
        <div className="h-32 flex flex-col items-center justify-center opacity-50">
          <span className="text-3xl mb-2">🦦🐻🦫</span>
          <span className="font-mono text-sm">아직 에이전트 간 대화가 없어요</span>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="space-y-3 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin"
        >
          {messages.map((msg, i) => {
            const charId = (agentCharId[msg.from] || 'claw') as 'claw' | 'clawau' | 'clovi';
            const bubbleColor = agentBubbleColor[msg.from] || 'border-l-gray-400 bg-gray-100/10';
            const nameColor = agentNameColor[msg.from] || 'text-gray-400';

            return (
              <div key={i} className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <CharacterAvatar id={charId} size={36} />
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-xs font-bold ${nameColor}`}>
                      {msg.from}
                    </span>
                    <span className="font-mono text-[10px] opacity-30">→</span>
                    <span className="font-mono text-[10px] opacity-50">
                      {agentEmoji[msg.to] || '🤖'} {msg.to}
                    </span>
                    <span className="font-mono text-[10px] opacity-30 ml-auto">
                      {msg.time}
                    </span>
                  </div>
                  <div className={`p-3 border-l-4 border-2 border-black dark:border-zinc-700 ${bubbleColor}`}>
                    <div className="text-sm leading-relaxed break-words">{msg.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </NeoCard>
  );
}
