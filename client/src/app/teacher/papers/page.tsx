/**
 * TEACHER - PAPERS PAGE (UPDATED)
 * 
 * This page NOW USES the SHARED PapersManagement component.
 * All paper CRUD logic is in /components/shared/papers/PapersManagement.tsx
 * 
 * Changes to paper management functionality should be made in the shared component,
 * not here. This ensures both teachers and paper managers have the same features.
 */

"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { PapersManagement } from "@/components/shared/papers/PapersManagement";

export default function TeacherPapersPage() {
  return (
    <TeacherLayout>
      <PapersManagement basePath="/teacher" />
    </TeacherLayout>
  );
}