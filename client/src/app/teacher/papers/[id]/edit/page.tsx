"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { PaperForm } from "@/components/shared/papers/PaperForm";
import { useParams } from "next/navigation";

export default function EditPaperPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <TeacherLayout>
      <PaperForm mode="edit" paperId={id} basePath="/teacher" />
    </TeacherLayout>
  );
}