"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function PaperResultsRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const paperId = pathname.split('/')[3]; // Extract paper ID from path

    useEffect(() => {
        const fetchAttemptAndRedirect = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/papers/${paperId}/attempt`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const attemptId = response.data.studentAttempt._id;
                router.replace(`/student/papers/answers/${attemptId}`);
            } catch (error) {
                console.error("Error fetching attempt:", error);
                // If no attempt found or error, redirect back to papers list
                router.replace('/student/papers');
            }
        };

        if (paperId) {
            fetchAttemptAndRedirect();
        }
    }, [paperId, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading your results...</p>
            </div>
        </div>
    );
}
