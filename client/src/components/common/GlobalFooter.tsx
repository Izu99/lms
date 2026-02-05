"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className }: GlobalFooterProps) {
  return (
    <footer className={cn("py-8 border-t border-slate-200 dark:border-slate-800", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Branding */}
          <div className="text-center">
            <p className="theme-text-tertiary text-sm font-medium">
              Powered by <span className="font-bold text-blue-600 dark:text-blue-400">ezyICT</span>
            </p>
            <p className="theme-text-tertiary text-xs mt-1">Smart Learning Made Easy</p>
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs theme-text-tertiary">
            <Link
              href="/privacy-policy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <Link
              href="/refund-policy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Refund Policy
            </Link>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <Link
              href="/terms-conditions"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs theme-text-tertiary">
            &copy; {new Date().getFullYear()} ezyICT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
