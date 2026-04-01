'use client';

interface NeoProgressProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
}

export default function NeoProgress({ value, max = 100, color = 'bg-neo-cyan', label }: NeoProgressProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {label && <span className="font-mono text-xs font-bold mb-1 block">{label}</span>}
      <div className="w-full h-4 rounded-full border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
