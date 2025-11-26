"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { CoursePackageForm } from "@/components/teacher/CoursePackageForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateCoursePackagePage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Course package created successfully!");
    router.push("/teacher/course-packages");
  };

  const handleCancel = () => {
    router.push("/teacher/course-packages");
  };

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold theme-text-primary mb-6">Create New Course Package</h1>
        <div className="theme-card p-8">
          <CoursePackageForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </TeacherLayout>
  );
}
