'use client';

import { ReactNode } from 'react';

interface NeoBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

const variants = {
  success: 'bg-neo-cyan/20 text-neo-cyan border-neo-cyan/30',
  warning: 'bg-neo-yellow/20 text-amber-600 dark:text-neo-yellow border-neo-yellow/30',
  error: 'bg-neo-red/20 text-neo-red border-neo-red/30',
  info: 'bg-neo-blue/20 text-neo-blue border-neo-blue/30',
};

export default function NeoBadge({ children, variant = 'info' }: NeoBadgeProps) {
  return (
    <span
      className={`
        inline-block px-3 py-1
        border
        rounded-full
        font-mono text-xs font-bold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
