'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoButton from '@/components/ui/NeoButton';

interface CalEvent {
  time: string;
  title: string;
  color: string;
}

const COLORS = ['bg-neo-cyan', 'bg-neo-pink', 'bg-neo-yellow', 'bg-neo-purple', 'bg-neo-blue'];

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');

  const todayKey = () => new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  useEffect(() => {
    const stored = localStorage.getItem('clawdash-cal-' + todayKey());
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  const save = (updated: CalEvent[]) => {
    const sorted = [...updated].sort((a, b) => a.time.localeCompare(b.time));
    setEvents(sorted);
    localStorage.setItem('clawdash-cal-' + todayKey(), JSON.stringify(sorted));
  };

  const add = () => {
    if (!time || !title.trim()) return;
    const color = COLORS[events.length % COLORS.length];
    save([...events, { time, title: title.trim(), color }]);
    setTime(''); setTitle(''); setShowInput(false);
  };

  const remove = (i: number) => {
    save(events.filter((_, idx) => idx !== i));
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Seoul',
  });

  return (
    <NeoCard accent="bg-neo-purple" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-1 opacity-60">📅 오늘 일정</h3>
      <div className="font-mono text-sm font-bold mb-3">{today}</div>
      <div className="space-y-2 mb-3">
        {events.length === 0 ? (
          <div className="text-sm opacity-50 font-mono">오늘 일정이 없어요 🎉</div>
        ) : (
          events.map((evt, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-zinc-700 p-2 group">
              <div className={`w-2 h-8 shrink-0 ${evt.color}`} />
              <div className="font-mono text-xs font-bold opacity-60 w-12">{evt.time}</div>
              <div className="text-sm font-bold flex-1">{evt.title}</div>
              <button
                onClick={() => remove(i)}
                className="opacity-0 group-hover:opacity-100 text-xs font-bold text-neo-red"
              >✕</button>
            </div>
          ))
        )}
      </div>

      {showInput ? (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-2 space-y-2">
          <div className="flex gap-2">
            <input
              type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-24 p-1 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neo-cyan/30"
            />
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder="일정 이름..."
              className="flex-1 p-1 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-neo-cyan/30"
            />
          </div>
          <div className="flex gap-2">
            <NeoButton variant="primary" onClick={add}>추가</NeoButton>
            <NeoButton variant="secondary" onClick={() => setShowInput(false)}>취소</NeoButton>
          </div>
        </div>
      ) : (
        <NeoButton variant="secondary" onClick={() => setShowInput(true)}>+ 일정 추가</NeoButton>
      )}
    </NeoCard>
  );
}
