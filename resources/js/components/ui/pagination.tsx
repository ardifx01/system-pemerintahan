import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Pagination({ className, children, ...props }: PaginationProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}
