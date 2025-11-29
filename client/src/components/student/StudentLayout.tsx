import { GlobalFooter } from "@/components/common/GlobalFooter";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { useAuth } from "@/modules/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

interface StudentLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

function StudentLayoutContent({ children, hideSidebar }: StudentLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("StudentLayout - Auth State:", { user, isLoading, role: user?.role });

    if (!isLoading && !user) {
      console.log("StudentLayout - No user, redirecting to login");
      router.push("/login");
      return;
    }

    if (!isLoading && user && user.role !== "student") {
      console.log("StudentLayout - User is not student, role:", user.role);
      router.push("/unauthorized");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "student") {
  }

  return (
    <div className="flex h-screen overflow-hidden theme-bg-secondary">
      {!hideSidebar && <StudentSidebar user={user} onLogout={handleLogout} />}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${hideSidebar ? "ml-0" : (isCollapsed ? "ml-20" : "ml-72")
          } flex flex-col h-screen overflow-y-auto relative`}
      >
        <AnimatedBackground variant="student" />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full flex-grow relative z-10">{children}</div>
        <Toaster />
        <GlobalFooter />
      </main>
    </div>
  );
}

export function StudentLayout({ children, hideSidebar }: StudentLayoutProps) {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <StudentLayoutContent hideSidebar={hideSidebar}>{children}</StudentLayoutContent>
    </SidebarProvider>
  );
}
