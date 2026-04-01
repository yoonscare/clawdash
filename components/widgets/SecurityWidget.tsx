'use client';

import NeoCard from '@/components/ui/NeoCard';
import securityData from '@/data/security.json';

interface SecurityItem {
  title: string;
  emoji: string;
  desc: string;
}

export default function SecurityWidget() {
  return (
    <NeoCard span="md">
      <h3 className="font-mono text-xs font-bold mb-3 opacity-60">🛡 보안 원칙</h3>
      <div className="space-y-2">
        {(securityData as SecurityItem[]).map((item, i) => (
          <div key={i} className="rounded-xl border border-red-200/50 dark:border-red-500/20 bg-red-50/30 dark:bg-red-900/10 p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.emoji}</span>
              <span className="text-xs font-bold">{item.title}</span>
            </div>
            <p className="text-[10px] opacity-50 mt-0.5 ml-6">{item.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] font-mono opacity-30 mt-3 text-center">클로 + 루미 공통 적용</p>
    </NeoCard>
  );
}
