'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface AgentMsg {
  time: string;
  from: string;
  to: string;
  text: string;
}

const agentEmoji: Record<string, string> = {
  '클로': '🦦',
  '클로아우': '🐾',
};

const agentColor: Record<string, string> = {
  '클로': 'bg-neo-cyan/20 border-neo-cyan',
  '클로아우': 'bg-neo-purple/20 border-neo-purple',
};

export default function AgentChat() {
  const [messages, setMessages] = useState<AgentMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/agent-chat');
      const data = await res.json();
      setMessages(data);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NeoCard accent="bg-neo-green" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">
        🦦↔🐾 에이전트 대화
      </h3>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : messages.length === 0 ? (
        <div className="text-sm opacity-50 font-mono text-center py-4">
          아직 에이전트 간 대화가 없어요
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className="relative">
              {/* 방향 표시 */}
              <div className="font-mono text-xs opacity-40 mb-1">
                {agentEmoji[msg.from] || '🤖'} {msg.from} → {agentEmoji[msg.to] || '🤖'} {msg.to}
                <span className="ml-2">{msg.time}</span>
              </div>
              {/* 메시지 버블 */}
              <div className={`p-3 border-4 border-black dark:border-neo-yellow ${agentColor[msg.from] || 'bg-neo-purple/20'}`}>
                <div className="text-sm leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
