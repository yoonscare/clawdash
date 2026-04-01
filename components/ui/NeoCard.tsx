'use client';

import { ReactNode } from 'react';

interface NeoCardProps {
  children: ReactNode;
  accent?: string;
  className?: string;
  span?: 'sm' | 'md' | 'lg' | 'full';
}

const spanClasses = {
  sm: '',
  md: 'md:col-span-2',
  lg: 'md:col-span-2 lg:col-span-3',
  full: 'md:col-span-2 lg:col-span-4',
};

export default function NeoCard({ children, className = '', span = 'sm' }: NeoCardProps) {
  return (
    <div
      className={`
        border-2 border-black/10 dark:border-white/10
        rounded-2xl
        neo-shadow
        bg-white dark:bg-zinc-900/80
        p-5
        h-full
        transition-all duration-200
        hover:neo-shadow-hover
        ${spanClasses[span]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
