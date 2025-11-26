"use client";

import { Suspense } from 'react';
import Link from 'next/link';

function NotFoundPageContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Go back to Home
      </Link>
    </div>
  );
}

export default function NotFoundPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundPageContent />
        </Suspense>
    )
}
