"use client";

import { useAuth } from "@/hooks/useAuth";
import { StudentDashboard } from "@/modules/student/pages/Dashboard";
import { TeacherDashboard } from "@/modules/teacher/pages/Dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div>
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'teacher' && <TeacherDashboard />}
    </div>
  );
}
