"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className }: GlobalFooterProps) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className={cn("py-6 text-center space-y-2", className)}>
        <p className="theme-text-tertiary text-sm">
          Powered by <span className="font-semibold text-blue-500 dark:text-blue-400">ezyICT</span> - Smart Learning Made Easy
        </p>
        <div className="text-xs theme-text-tertiary">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="hover:text-blue-500 transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-sm"
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      <PrivacyPolicyModal open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
    </>
  );
}
