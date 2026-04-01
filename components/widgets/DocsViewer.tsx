'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface DocItem {
  title: string;
  path: string;
  date: string;
  emoji: string;
}

export default function DocsViewer() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then(r => r.json())
      .then(setDocs)
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
    const interval = setInterval(() => {
      fetch('/api/docs').then(r => r.json()).then(setDocs).catch(() => {});
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NeoCard accent="bg-neo-blue" span="md">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">📄 문서 & 보고서</h3>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : docs.length === 0 ? (
        <div className="text-sm opacity-50 font-mono">등록된 문서가 없어요</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-zinc-700 p-2 hover:bg-neo-blue/10 transition-colors">
              <span className="text-xl shrink-0">{doc.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{doc.title}</div>
                <div className="font-mono text-xs opacity-40 truncate">{doc.path}</div>
              </div>
              <div className="font-mono text-xs opacity-40 shrink-0">{doc.date}</div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
