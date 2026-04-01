'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface DigestItem {
  date: string;
  title: string;
  summary: string;
}

export default function AIDigest() {
  const [items, setItems] = useState<DigestItem[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/digest')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else setError(true);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <NeoCard accent="bg-neo-purple" span="lg">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">AI Daily Digest</h3>
      {error ? (
        <div className="text-xs opacity-50 font-mono">Failed to load digest</div>
      ) : items.length === 0 ? (
        <div className="text-xs opacity-50 font-mono">Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs opacity-40">{item.date}</span>
              </div>
              <div className="font-bold text-sm mb-1">{item.title}</div>
              <div className="text-xs opacity-70">{item.summary}</div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}
