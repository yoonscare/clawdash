'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface NewsItem {
  title: string;
  source: string;
  timestamp: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/widgets?type=news')
      .then(r => r.json())
      .then(data => setNews(Array.isArray(data) ? data : data.items || []))
      .catch(() => {
        setNews([
          { title: 'OpenClaw v2.0 Released with Agent Framework', source: 'OpenClaw Blog', timestamp: '2h ago' },
          { title: 'AI Dashboard Tools Comparison 2026', source: 'TechCrunch', timestamp: '4h ago' },
          { title: 'New CGM Integration Standards Published', source: 'Health API Weekly', timestamp: '5h ago' },
          { title: 'TypeScript 6.0 Beta Announced', source: 'Microsoft Dev Blog', timestamp: '8h ago' },
          { title: 'Tailwind CSS v4 Performance Benchmarks', source: 'CSS Weekly', timestamp: '12h ago' },
        ]);
      });
  }, []);

  return (
    <NeoCard accent="bg-neo-blue" span="lg">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">News Feed</h3>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {news.map((item, i) => (
          <div
            key={i}
            className="border-4 border-black dark:border-neo-yellow p-3 hover:bg-neo-yellow/20 transition-colors cursor-pointer"
          >
            <div className="font-mono text-sm font-bold leading-tight">{item.title}</div>
            <div className="flex justify-between mt-1">
              <span className="text-xs opacity-60">{item.source}</span>
              <span className="text-xs opacity-40">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}
