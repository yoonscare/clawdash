'use client';

import NeoCard from '@/components/ui/NeoCard';
import rolesData from '@/data/roles.json';

interface RoleItem {
  title: string;
  emoji: string;
  status: string;
  desc: string;
}

const statusLabel: Record<string, { text: string; color: string }> = {
  active: { text: '운영 중', color: 'bg-neo-cyan' },
  planned: { text: '예정', color: 'bg-neo-yellow' },
  future: { text: '향후', color: 'bg-zinc-300 dark:bg-zinc-700' },
};

function RoleSection({ title, icon, items, borderColor }: { title: string; icon: string; items: RoleItem[]; borderColor: string }) {
  return (
    <div className="mb-4">
      <h4 className="font-mono text-xs font-bold uppercase mb-2 opacity-70">{icon} {title}</h4>
      <div className="space-y-2">
        {items.map((item, i) => {
          const st = statusLabel[item.status] || statusLabel.future;
          return (
            <div key={i} className={`border-2 ${borderColor} p-2 flex items-center justify-between gap-2`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-xs font-bold truncate">{item.title}</span>
                </div>
                <p className="text-[10px] opacity-50 truncate mt-0.5">{item.desc}</p>
              </div>
              <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border-2 border-black dark:border-neo-yellow whitespace-nowrap ${st.color}`}>
                {st.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RoleDashboard() {
  return (
    <NeoCard accent="bg-neo-purple" span="lg">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">🏗 역할분담 대시보드</h3>
      
      <div className="flex items-center justify-center gap-6 mb-4 text-xs font-mono">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-neo-cyan border-2 border-black inline-block" /> 운영 중</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-neo-yellow border-2 border-black inline-block" /> 예정</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-zinc-300 dark:bg-zinc-700 border-2 border-black inline-block" /> 향후</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RoleSection
          title="클로 — 교수업무 비서"
          icon="🦦"
          items={rolesData.claw}
          borderColor="border-blue-400 dark:border-blue-500"
        />
        <RoleSection
          title="루미 — 자동화 파트너"
          icon="🐻"
          items={rolesData.rumi}
          borderColor="border-purple-400 dark:border-purple-500"
        />
        <RoleSection
          title="공유 영역"
          icon="🤝"
          items={rolesData.shared}
          borderColor="border-yellow-400 dark:border-yellow-500"
        />
      </div>
    </NeoCard>
  );
}
