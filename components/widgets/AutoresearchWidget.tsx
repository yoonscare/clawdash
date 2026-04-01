'use client';

import NeoCard from '@/components/ui/NeoCard';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

interface AutoresearchItem {
  id: number;
  skill_name: string;
  status: string;
  baseline_score: number;
  best_score: number;
  experiments: unknown[];
  eval_breakdown: unknown[];
  updated_at: string;
}

const REALTIME_OPTIONS = {
  table: 'autoresearch',
  fetchUrl: '/api/autoresearch',
} as const;

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return iso;
  }
}

export default function AutoresearchWidget() {
  const { data: items, loading } = useSupabaseRealtime<AutoresearchItem>(REALTIME_OPTIONS);

  const totalSkills = items.length;
  const completedSkills = items.filter(i => i.status === 'complete').length;

  return (
    <NeoCard accent="bg-neo-green">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">🧬 Autoresearch</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs opacity-50">완료: {completedSkills}/{totalSkills}</span>
      </div>
      {loading ? (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-50 font-mono">아직 실험 결과가 없어요</div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {items.map((item) => {
            const improvement = item.best_score - item.baseline_score;
            const progressPct = item.best_score > 0 ? Math.round(item.best_score) : 0;
            const baselinePct = item.baseline_score > 0 ? Math.round(item.baseline_score) : 0;

            return (
              <div key={item.id ?? item.skill_name} className="border-4 border-black dark:border-neo-yellow p-3">
                {/* Header: name + status badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold truncate">{item.skill_name}</span>
                  <span className={`font-mono text-xs font-bold px-1.5 py-0.5 border-2 border-black dark:border-neo-yellow shrink-0 ${
                    item.status === 'complete' ? 'bg-neo-green' : item.status === 'running' ? 'bg-neo-yellow' : 'bg-neo-pink'
                  }`}>
                    {item.status === 'complete' ? '완료' : item.status === 'running' ? '실행중' : item.status}
                  </span>
                </div>

                {/* Score display */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs opacity-60">{baselinePct}%</span>
                  <span className="font-mono text-xs opacity-40">→</span>
                  <span className="font-mono text-sm font-bold">{progressPct}%</span>
                  {improvement > 0 && (
                    <span className="font-mono text-xs font-bold text-neo-green ml-auto">+{improvement.toFixed(1)}%p</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="relative h-3 border-2 border-black dark:border-neo-yellow bg-white dark:bg-zinc-800">
                  {/* Baseline marker */}
                  <div
                    className="absolute top-0 h-full bg-neo-pink/40"
                    style={{ width: `${baselinePct}%` }}
                  />
                  {/* Best score */}
                  <div
                    className="absolute top-0 h-full bg-neo-green"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Footer: experiments + time */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono text-xs opacity-40">
                    실험 {Array.isArray(item.experiments) ? item.experiments.length : 0}회
                  </span>
                  <span className="font-mono text-xs opacity-40">{formatTime(item.updated_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </NeoCard>
  );
}
