import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, circle }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 border border-white/5',
        {
          'rounded-full': circle,
          'rounded-xl': !circle,
        },
        className
      )}
    />
  );
};
export default Skeleton;
