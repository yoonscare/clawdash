'use client';

import { useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import digestData from '@/data/digest.json';

interface DigestItem {
  date: string;
  title: string;
  summary: string;
}

export default function AIDigest() {
  const [items] = useState<DigestItem[]>(digestData);

  return (
    <NeoCard accent="bg-neo-purple" span="lg">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">📰 AI Daily Digest</h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border-4 border-black dark:border-neo-yellow p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs opacity-40">{item.date}</span>
            </div>
            <div className="font-bold text-sm mb-1">{item.title}</div>
            <div className="text-xs opacity-70">{item.summary}</div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}
