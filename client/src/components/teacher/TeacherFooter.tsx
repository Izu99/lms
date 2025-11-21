"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

interface TeacherFooterProps {
  user?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  onLogout: () => void;
}

export function TeacherFooter({ user, onLogout }: TeacherFooterProps) {
  const { isCollapsed } = useSidebar();
  const router = useRouter();

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Teacher";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
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
          onClick={() => handleNavigation("/teacher/profile")}
        >
          <div className="w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm font-bold">{getInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold theme-text-primary truncate">{getDisplayName()}</p>
            <p className="text-xs theme-text-secondary truncate">Teacher Account</p>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={cn(
          "relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 group text-white shadow-md hover:shadow-lg hover:scale-105",
          isCollapsed 
            ? "w-11 h-11 justify-center sidebar-icon sidebar-icon-logout sidebar-icon-collapsed" 
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
  );
}
