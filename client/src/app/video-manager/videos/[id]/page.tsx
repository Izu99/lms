"use client";

import { VideoManagerLayout } from "@/components/video-manager/VideoManagerLayout";
import { VideoPlayerView } from "@/components/shared/videos/VideoPlayerView";

export default function VideoManagerVideoViewPage() {
    return (
        <VideoManagerLayout>
            <VideoPlayerView basePath="/video-manager" />
        </VideoManagerLayout>
    );
}
