'use client';

import { useAuth } from '@/contexts/AuthContext';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome, {user.username}</p>
      {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
}
