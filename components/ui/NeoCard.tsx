'use client';

import { ReactNode } from 'react';

interface NeoCardProps {
  children: ReactNode;
  accent?: string;
  className?: string;
  span?: 'sm' | 'md' | 'lg';
}

const spanClasses = {
  sm: '',
  md: 'md:col-span-2',
  lg: 'md:col-span-2 lg:col-span-3',
};

export default function NeoCard({ children, accent = 'bg-neo-yellow', className = '', span = 'sm' }: NeoCardProps) {
  return (
    <div
      className={`
        border-4 border-black dark:border-neo-yellow
        neo-shadow
        bg-white dark:bg-zinc-900
        p-5
        transition-all duration-200
        hover:neo-shadow-hover
        ${spanClasses[span]}
        ${className}
      `}
    >
      <div className={`h-2 ${accent} -mx-5 -mt-5 mb-4 border-b-4 border-black dark:border-neo-yellow`} />
      {children}
    </div>
  );
}
