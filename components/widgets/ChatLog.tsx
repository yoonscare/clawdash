'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface ChatMsg {
  time: string;
  from: string;
  text: string;
}

export default function ChatLog() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chatlog');
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
    // 30초마다 새 메시지 폴링
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NeoCard accent="bg-neo-blue" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">🗨️ 클로 대화 로그</h3>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : messages.length === 0 ? (
        <div className="text-sm opacity-50 font-mono">아직 대화 기록이 없어요</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.from === '클로' ? '' : 'flex-row-reverse'}`}>
              <div className={`max-w-[80%] p-2 border-4 border-black dark:border-neo-yellow ${msg.from === '클로' ? 'bg-neo-cyan/20' : 'bg-neo-pink/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold">{msg.from === '클로' ? '🐾 클로' : '👤 윤스케어'}</span>
                  <span className="font-mono text-xs opacity-40">{msg.time}</span>
                </div>
                <div className="text-sm">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
