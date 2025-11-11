"use client";

import { useAuth } from "@/modules/shared/hooks/useAuth";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
}

interface LocalStorageData {
  hasToken: boolean;
  token: string | null;
  rawUser: string | null;
  parsedUser: User | null;
}

export default function DebugAuthPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<LocalStorageData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    setLocalStorageData({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      rawUser: savedUser,
      parsedUser: savedUser ? JSON.parse(savedUser) : null,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Page</h1>

        <div className="space-y-6">
          {/* useAuth Hook Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">useAuth Hook Data</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="font-bold">isLoading:</span>{" "}
                <span className={isLoading ? "text-yellow-600" : "text-green-600"}>
                  {isLoading.toString()}
                </span>
              </div>
              <div>
                <span className="font-bold">isAuthenticated:</span>{" "}
                <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {isAuthenticated.toString()}
                </span>
              </div>
              <div>
                <span className="font-bold">user:</span>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* LocalStorage Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
            <div className="space-y-2 font-mono text-sm">
              <pre className="p-4 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Role Check */}
          {user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Role Check</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Current Role:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'student' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Is Teacher:</span>
                  <span className={user.role === 'teacher' ? 'text-green-600' : 'text-red-600'}>
                    {(user.role === 'teacher').toString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Is Student:</span>
                  <span className={user.role === 'student' ? 'text-green-600' : 'text-red-600'}>
                    {(user.role === 'student').toString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/teacher/dashboard'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Teacher Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/student/dashboard'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Go to Student Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear & Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
