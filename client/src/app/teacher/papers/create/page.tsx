"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { PaperForm } from "@/components/shared/papers/PaperForm";

export default function CreatePaperPage() {
  return (
    <TeacherLayout>
      <PaperForm mode="create" basePath="/teacher" />
    </TeacherLayout>
  );
}