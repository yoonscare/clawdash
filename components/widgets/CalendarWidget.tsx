'use client';

import { useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface CalEvent {
  time: string;
  title: string;
  color: string;
}

const SAMPLE_EVENTS: CalEvent[] = [
  { time: '09:00', title: 'Team Standup', color: 'bg-neo-cyan' },
  { time: '11:00', title: 'Design Review', color: 'bg-neo-pink' },
  { time: '13:30', title: 'Lunch with Alex', color: 'bg-neo-yellow' },
  { time: '15:00', title: 'Sprint Planning', color: 'bg-neo-purple' },
  { time: '17:00', title: 'Code Review', color: 'bg-neo-blue' },
];

export default function CalendarWidget() {
  const [events] = useState<CalEvent[]>(SAMPLE_EVENTS);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <NeoCard accent="bg-neo-purple" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-1 opacity-60">Calendar</h3>
      <div className="font-mono text-sm font-bold mb-3">{today}</div>
      <div className="space-y-2">
        {events.map((evt, i) => (
          <div key={i} className="flex items-center gap-3 border-4 border-black dark:border-neo-yellow p-2">
            <div className={`w-2 h-8 shrink-0 ${evt.color}`} />
            <div className="font-mono text-xs font-bold opacity-60 w-12">{evt.time}</div>
            <div className="text-sm font-bold">{evt.title}</div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}
