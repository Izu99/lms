"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { PaperResultsView } from "@/components/shared/papers/PaperResultsView";

export default function PaperResultsPage() {
  return (
    <TeacherLayout>
      <PaperResultsView basePath="/teacher" />
    </TeacherLayout>
  );
}