'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoButton from '@/components/ui/NeoButton';
import defaultTodos from '@/data/todos.json';

interface Todo {
  text: string;
  done: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('clawdash-todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  const save = (updated: Todo[]) => {
    setTodos(updated);
    localStorage.setItem('clawdash-todos', JSON.stringify(updated));
  };

  const toggle = (i: number) => {
    const updated = [...todos];
    updated[i].done = !updated[i].done;
    save(updated);
  };

  const add = () => {
    if (!input.trim()) return;
    save([...todos, { text: input.trim(), done: false }]);
    setInput('');
  };

  const remove = (i: number) => {
    save(todos.filter((_, idx) => idx !== i));
  };

  return (
    <NeoCard accent="bg-neo-pink">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">✅ 할 일</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
        {todos.map((t, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <button
              onClick={() => toggle(i)}
              className={`w-5 h-5 shrink-0 border-3 border-black dark:border-neo-yellow font-mono text-xs font-bold flex items-center justify-center ${t.done ? 'bg-neo-cyan' : ''}`}
            >
              {t.done ? '✓' : ''}
            </button>
            <span className={`text-sm flex-1 ${t.done ? 'line-through opacity-40' : ''}`}>{t.text}</span>
            <button
              onClick={() => remove(i)}
              className="opacity-0 group-hover:opacity-100 text-xs font-bold text-neo-red"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="새 할 일..."
          className="flex-1 p-1 border-4 border-black dark:border-neo-yellow bg-transparent text-sm focus:outline-none focus:border-neo-pink"
        />
        <NeoButton variant="primary" onClick={add}>+</NeoButton>
      </div>
    </NeoCard>
  );
}
