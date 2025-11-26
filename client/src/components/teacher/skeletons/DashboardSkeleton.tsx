"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Welcome Header Skeleton */}
            <div className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 p-6 sm:p-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-full">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>

            {/* Dashboard Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>

            {/* Performance Overview and Content Distribution Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student Performance Overview Skeleton */}
                <div className="lg:col-span-2 bg-[#1a2332] rounded-2xl border border-[#2d3748] p-6 h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-8 w-64 bg-gray-700" />
                        <Skeleton className="h-8 w-32 bg-gray-700" />
                    </div>
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32 bg-gray-700" />
                                    <Skeleton className="h-4 w-12 bg-gray-700" />
                                </div>
                                <Skeleton className="h-4 w-full rounded-full bg-gray-700" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Distribution Skeleton */}
                <div className="bg-[#1a2332] rounded-2xl border border-[#2d3748] p-6 h-[400px]">
                    <Skeleton className="h-8 w-48 mb-8 bg-gray-700" />
                    <div className="flex items-center justify-center h-48 mb-6">
                        <Skeleton className="h-40 w-40 rounded-full bg-gray-700" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full rounded-lg bg-gray-700" />
                        <Skeleton className="h-12 w-full rounded-lg bg-gray-700" />
                    </div>
                </div>
            </div>

            {/* Activity Timeline Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 h-[400px]">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>

            {/* Content Overview Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[#1a2332] rounded-2xl border border-[#2d3748] p-6 h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-8 w-32 bg-gray-700" />
                            <Skeleton className="h-8 w-24 bg-gray-700" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-lg bg-gray-700" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full bg-gray-700" />
                                        <Skeleton className="h-3 w-2/3 bg-gray-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
