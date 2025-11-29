"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { VideoPlayerView } from "@/components/shared/videos/VideoPlayerView";

export default function VideoViewPage() {
  return (
    <TeacherLayout>
      <VideoPlayerView basePath="/teacher" />
    </TeacherLayout>
  );
}