'use client';

import { ReactNode } from 'react';

interface NeoBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

const variants = {
  success: 'bg-neo-cyan text-black',
  warning: 'bg-neo-yellow text-black',
  error: 'bg-neo-red text-white',
  info: 'bg-neo-blue text-white',
};

export default function NeoBadge({ children, variant = 'info' }: NeoBadgeProps) {
  return (
    <span
      className={`
        inline-block px-3 py-1
        border-2 border-black dark:border-neo-yellow
        font-mono text-xs font-bold uppercase
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
