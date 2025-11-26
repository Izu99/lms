"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    {/* Thumbnail Skeleton */}
                    <Skeleton className="w-full h-48" />

                    <div className="p-4 space-y-4">
                        {/* Title Skeleton */}
                        <Skeleton className="h-6 w-3/4" />

                        {/* Description Skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        {/* Tags Skeleton */}
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>

                        {/* Actions Skeleton */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <Skeleton className="h-9 flex-1 rounded-lg" />
                            <Skeleton className="h-9 flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
