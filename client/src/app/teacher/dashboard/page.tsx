"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { TeacherDashboard } from "@/modules/teacher/pages/Dashboard";

export default function TeacherDashboardPage() {
  return (
    <TeacherLayout>
      <TeacherDashboard />
    </TeacherLayout>
  );
}