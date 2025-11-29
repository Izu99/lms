/**
 * VIDEO MANAGER - VIDEOS PAGE
 * 
 * This page uses the SHARED VideosManagement component.
 * All video CRUD logic is in /components/shared/videos/VideosManagement.tsx
 * 
 * Changes to video management functionality should be made in the shared component,
 * not here. This ensures both teachers and video managers have the same features.
 */

"use client";

import { Suspense } from "react";
import { VideoManagerLayout } from "@/components/video-manager/VideoManagerLayout";
import { VideosManagement } from "@/components/shared/videos/VideosManagement";
import { ClientLayoutProvider } from "@/components/common/ClientLayoutProvider";

function VideoManagerVideosContent() {
    return (
        <VideoManagerLayout>
            <VideosManagement basePath="/video-manager" />
        </VideoManagerLayout>
    );
}

export default function VideoManagerVideosPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientLayoutProvider>
                <VideoManagerVideosContent />
            </ClientLayoutProvider>
        </Suspense>
    );
}
