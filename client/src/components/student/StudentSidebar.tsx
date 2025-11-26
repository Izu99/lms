"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Package,
  BookOpen, // Add this for Tutes
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarToggle,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface StudentSidebarProps {
  user?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  onLogout: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/student/dashboard",
    colorClass: "sidebar-icon-dashboard",
  },
  {
    title: "Videos",
    icon: Video,
    href: "/student/videos",
    colorClass: "sidebar-icon-videos",
  },
  {
    title: "Papers",
    icon: FileText,
    href: "/student/papers",
    colorClass: "sidebar-icon-papers",
  },
  {
    title: "Tutes",
    icon: BookOpen,
    href: "/student/tutes",
    colorClass: "sidebar-icon-tutes",
  },
  {
    title: "Meeting",
    icon: Video,
    href: "/student/meeting",
    colorClass: "sidebar-icon-zoom",
  },
  {
    title: "Course Packages",
    icon: Package,
    href: "/student/course-packages",
    colorClass: "sidebar-icon-course-packages",
  },
];

export function StudentSidebar({ user, onLogout }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Student";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        {isCollapsed ? (
          <>
            <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <SidebarToggle
              icon={<ChevronRight className="w-5 h-5 text-gray-600" />}
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold theme-text-primary truncate">ezyICT LMS</h2>
                <p className="text-xs theme-text-secondary truncate">Student Portal</p>
              </div>
            </div>
            <SidebarToggle
              icon={<ChevronLeft className="w-5 h-5 text-gray-600" />}
            />
          </>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <SidebarMenuItem
                key={item.href}
                icon={
                  <div className={cn(
                    "sidebar-icon",
                    item.colorClass,
                    isCollapsed && "sidebar-icon-collapsed",
                    isActive && "sidebar-icon-active"
                  )}>
                    <Icon className={cn(isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                  </div>
                }
                isActive={isActive}
                onClick={() => handleNavigation(item.href)}
              >
                {item.title}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className={cn("space-y-3", isCollapsed && "flex flex-col items-center")}>
          {/* Theme Toggle */}
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium theme-text-secondary">Dark Mode</span>
              <ThemeToggle />
            </div>
          )}

          {/* User Profile - Show first when expanded */}
          {!isCollapsed && (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleNavigation("/student/profile")}
            >
              <div className="w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm font-bold">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold theme-text-primary truncate">{getDisplayName()}</p>
                <p className="text-xs theme-text-secondary truncate">Student Account</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={cn(
              "relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 group theme-text-primary shadow-md hover:shadow-lg hover:scale-105",
              isCollapsed
                ? "w-11 h-11 justify-center sidebar-icon sidebar-icon-logout sidebar-icon-collapsed text-white"
                : "w-full gap-3 px-4 py-3 sidebar-icon-logout"
            )}
          >
            <div className={cn(
              "flex items-center justify-center flex-shrink-0",
              isCollapsed ? "" : "w-10 h-10 rounded-xl sidebar-icon sidebar-icon-logout"
            )}>
              <LogOut className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="whitespace-nowrap flex-1 text-left">Logout</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
                Logout
              </span>
            )}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
