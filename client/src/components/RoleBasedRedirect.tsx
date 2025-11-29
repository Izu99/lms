"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";

interface User {
  id: string;
  username: string;
  role: "student" | "teacher" | "admin" | "paper_manager" | "video_manager";
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
          case "paper_manager":
            router.push("/paper-manager/dashboard");
            break;
          case "video_manager":
            router.push("/video-manager/dashboard");
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

  return <LoadingScreen />;
}