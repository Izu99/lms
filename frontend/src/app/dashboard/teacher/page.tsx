'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'teacher') {
      router.push('/dashboard/student');
    }
  }, [user, router]);

  if (!user || user.role !== 'teacher') {
    return <div>Loading...</div>;
  }

  return <TeacherDashboard />;
}
