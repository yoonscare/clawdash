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
        rounded-[28px]
        border border-white/65 dark:border-white/10
        bg-white/72 dark:bg-white/[0.03]
        shadow-[0_20px_60px_rgba(15,23,42,0.08)]
        backdrop-blur-xl
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]
        ${spanClasses[span]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
