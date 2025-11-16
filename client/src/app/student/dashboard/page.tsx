"use client";

import { StudentLayout } from "@/components/student/StudentLayout";
import { StudentDashboard } from "@/modules/student/pages/Dashboard";

export default function StudentDashboardPage() {
  return (
    <StudentLayout>
      <StudentDashboard />
    </StudentLayout>
  );
}