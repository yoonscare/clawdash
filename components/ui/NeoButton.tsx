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
        border-4 border-black dark:border-neo-yellow
        neo-shadow-sm
        font-mono font-bold uppercase text-sm
        transition-all duration-200
        hover:neo-shadow-hover
        active:shadow-none active:translate-x-1 active:translate-y-1
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
