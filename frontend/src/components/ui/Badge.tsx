import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase',
        {
          'bg-blue-500/15 text-blue-400 border border-blue-500/20': variant === 'primary',
          'bg-white/10 text-white/70': variant === 'secondary',
          'bg-green-500/15 text-green-400 border border-green-500/20': variant === 'success',
          'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20': variant === 'warning',
          'bg-red-500/15 text-red-400 border border-red-500/20': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
export default Badge;
