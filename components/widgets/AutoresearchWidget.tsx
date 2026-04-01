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
    <NeoCard>
      <h3 className="font-mono text-xs font-bold mb-3 opacity-60">🧬 Autoresearch</h3>
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
              <div key={item.id ?? item.skill_name} className="rounded-xl border border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-zinc-800/50 p-3">
                {/* Header: name + status badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold truncate">{item.skill_name}</span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    item.status === 'complete' ? 'bg-neo-green/20 text-neo-green border-neo-green/30' : item.status === 'running' ? 'bg-neo-yellow/20 text-amber-600 dark:text-neo-yellow border-neo-yellow/30' : 'bg-neo-pink/20 text-neo-pink border-neo-pink/30'
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
                <div className="relative h-3 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 overflow-hidden">
                  {/* Baseline marker */}
                  <div
                    className="absolute top-0 h-full bg-neo-pink/30 rounded-full"
                    style={{ width: `${baselinePct}%` }}
                  />
                  {/* Best score */}
                  <div
                    className="absolute top-0 h-full bg-neo-green rounded-full"
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
