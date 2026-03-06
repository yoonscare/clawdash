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
      {label && <span className="font-mono text-xs font-bold uppercase mb-1 block">{label}</span>}
      <div className="w-full h-6 border-4 border-black dark:border-neo-yellow bg-white dark:bg-zinc-800">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
