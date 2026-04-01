'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variants = {
  primary: 'bg-neo-yellow text-black',
  secondary: 'bg-neo-cyan text-black',
  danger: 'bg-neo-red text-white',
};

export default function NeoButton({ children, variant = 'primary', className = '', ...props }: NeoButtonProps) {
  return (
    <button
      className={`
        px-4 py-2
        border-2 border-black/10 dark:border-white/10
        rounded-xl
        neo-shadow-sm
        font-mono font-bold text-sm
        transition-all duration-200
        hover:neo-shadow-hover
        active:shadow-none active:translate-y-0.5
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
