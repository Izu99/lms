'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'student') {
      router.push('/dashboard/teacher');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return <div>Loading...</div>;
  }

  return <StudentDashboard />;
}
