'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface TaskItem {
  date: string;
  time: string;
  task: string;
  status: string;
  emoji: string;
}

export default function TaskTracker() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayTasks = tasks.filter(t => {
    const today = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
    return t.date === today;
  });

  return (
    <NeoCard accent="bg-neo-cyan" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">📋 클로 작업 로그</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs opacity-50">오늘 완료: {todayTasks.length}건</span>
        <span className="font-mono text-xs opacity-50">전체: {tasks.length}건</span>
      </div>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : tasks.length === 0 ? (
        <div className="text-sm opacity-50 font-mono">아직 작업 기록이 없어요</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[...tasks].reverse().map((t, i) => (
            <div key={i} className="flex items-start gap-2 border-4 border-black dark:border-neo-yellow p-2">
              <span className="text-lg shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">{t.task}</div>
                <div className="font-mono text-xs opacity-40">{t.date} {t.time}</div>
              </div>
              <span className={`font-mono text-xs font-bold px-1 border-2 border-black dark:border-neo-yellow shrink-0 ${
                t.status === 'done' ? 'bg-neo-cyan' : t.status === 'running' ? 'bg-neo-yellow' : 'bg-neo-pink'
              }`}>
                {t.status === 'done' ? '완료' : t.status === 'running' ? '진행중' : t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
