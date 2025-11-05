"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  role: "student" | "teacher" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function RoleBasedRedirect() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        router.push("/login");
        return;
      }

      if (!savedUser) {
        // If no user data, redirect to login to re-authenticate
        router.push("/login");
        return;
      }

      try {
        const user: User = JSON.parse(savedUser);
        
        // Redirect based on role
        switch (user.role) {
          case "student":
            router.push("/student/dashboard");
            break;
          case "teacher":
            router.push("/teacher/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          default:
            router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ezyICT - Smart Learning Made Easy
        </h1>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}