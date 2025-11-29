"use client";

import { VideoManagerLayout } from "@/components/video-manager/VideoManagerLayout";
import { Video, Play, TrendingUp, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

export default function VideoManagerDashboard() {
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalViews: 0,
        totalWatchTime: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/videos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats({
                totalVideos: response.data.length || 0,
                totalViews: 0,
                totalWatchTime: 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VideoManagerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 sidebar-icon sidebar-icon-dashboard">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Video Management Overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading ? "-" : stats.totalVideos}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                <Play className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading ? "-" : stats.totalViews}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Watch Time (hrs)</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading ? "-" : stats.totalWatchTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to Video Management
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        You have access to manage all videos. Use the sidebar to navigate to the Videos section to upload, edit, and manage video content.
                    </p>
                </div>
            </div>
        </VideoManagerLayout>
    );
}
