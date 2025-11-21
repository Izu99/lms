import React from 'react';
import { cn } from '@/lib/utils';

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className }: GlobalFooterProps) {
  return (
    <footer className={cn("py-6 text-center", className)}>
      <p className="theme-text-tertiary text-sm">
        Powered by <span className="font-semibold text-blue-500 dark:text-blue-400">ezyICT</span> - Smart Learning Made Easy
      </p>
    </footer>
  );
}
