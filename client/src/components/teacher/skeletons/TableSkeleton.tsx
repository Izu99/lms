"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function TableSkeleton() {
    return (
        <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            {[...Array(5)].map((_, i) => (
                                <th key={i} className="px-6 py-4 text-left">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="bg-card">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
