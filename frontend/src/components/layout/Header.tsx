'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't render header on login or register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/dashboard">
          <span className="text-xl font-bold">LMS</span>
        </Link>
        <nav>
          {user && (
            <div className="flex items-center space-x-4">
              {user.role === 'teacher' && (
                <>
                  <Link href="/dashboard/teacher">
                    <span className="text-gray-600 hover:text-gray-900">Dashboard</span>
                  </Link>
                  <Link href="/videos">
                    <span className="text-gray-600 hover:text-gray-900">Manage Videos</span>
                  </Link>
                  <Link href="/allow-students">
                    <span className="text-gray-600 hover:text-gray-900">Allow Students</span>
                  </Link>
                </>
              )}
              {user.role === 'student' && (
                <>
                  <Link href="/dashboard/student">
                    <span className="text-gray-600 hover:text-gray-900">Dashboard</span>
                  </Link>
                  <Link href="/videos">
                    <span className="text-gray-600 hover:text-gray-900">Videos</span>
                  </Link>
                </>
              )}
              <Link href="/profile">
                <span className="text-gray-600 hover:text-gray-900">Profile</span>
              </Link>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
