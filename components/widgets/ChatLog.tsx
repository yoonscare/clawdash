'use client';

import NeoCard from '@/components/ui/NeoCard';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

interface ChatMsg {
  time: string;
  from: string;
  text: string;
}

const REALTIME_OPTIONS = {
  table: 'chatlog',
  fetchUrl: '/api/chatlog',
} as const;

export default function ChatLog() {
  const { data: messages, loading } = useSupabaseRealtime<ChatMsg>(REALTIME_OPTIONS);

  return (
    <NeoCard span="md">
      <h3 className="font-mono text-xs font-bold mb-3 opacity-60">🗨️ 클로 대화 로그</h3>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : messages.length === 0 ? (
        <div className="text-sm opacity-50 font-mono">아직 대화 기록이 없어요</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.from === '클로' ? '' : 'flex-row-reverse'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl border border-black/5 dark:border-white/5 ${msg.from === '클로' ? 'bg-neo-cyan/10' : 'bg-neo-pink/10'}`}>
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
