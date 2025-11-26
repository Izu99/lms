import { GlobalFooter } from "@/components/common/GlobalFooter";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { useAuth } from "@/modules/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

function TeacherLayoutContent({ children }: TeacherLayoutProps) {
  const { isCollapsed } = useSidebar();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("TeacherLayout - Auth State:", { user, isLoading, role: user?.role });
    
    if (!isLoading && !user) {
      console.log("TeacherLayout - No user, redirecting to login");
      router.push("/login");
      return;
    }
    
    if (!isLoading && user && user.role !== "teacher") {
      console.log("TeacherLayout - User is not teacher, role:", user.role);
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

  if (user.role !== "teacher") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden theme-bg-secondary">
      <TeacherSidebar user={user} onLogout={handleLogout} />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-72"
        } flex flex-col h-screen overflow-y-auto`}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] flex-grow">{children}</div>
        <Toaster />
        <GlobalFooter />
      </main>
    </div>
  );
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <TeacherLayoutContent>{children}</TeacherLayoutContent>
    </SidebarProvider>
  );
}
