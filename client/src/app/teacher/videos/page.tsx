/**
 * TEACHER - VIDEOS PAGE (UPDATED)
 * 
 * This page NOW USES the SHARED VideosManagement component.
 * All video CRUD logic is in /components/shared/videos/VideosManagement.tsx
 * 
 * Changes to video management functionality should be made in the shared component,
 * not here. This ensures both teachers and video managers have the same features.
 */

"use client";

import { Suspense } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { VideosManagement } from "@/components/shared/videos/VideosManagement";
import { ClientLayoutProvider } from "@/components/common/ClientLayoutProvider";

function TeacherVideosPageContent() {
  return (
    <TeacherLayout>
      <VideosManagement basePath="/teacher" />
    </TeacherLayout>
  );
}

export default function TeacherVideosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLayoutProvider>
        <TeacherVideosPageContent />
      </ClientLayoutProvider>
    </Suspense>
  );
}
