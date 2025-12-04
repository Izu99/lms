"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Auto-collapse on mobile
  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Check on resize
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile backdrop - Only when expanded */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleCollapse}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out shadow-lg flex flex-col overflow-hidden sidebar-themed z-40",
          // Mobile behavior
          isMobile
            ? isCollapsed
              ? "w-20" // Collapsed on mobile shows icons
              : "w-full" // Expanded on mobile is full-screen
            // Desktop behavior (unchanged)
            : isCollapsed
              ? "w-20"
              : "w-72",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center p-4 flex-shrink-0 theme-border border-b",
        isCollapsed ? "flex-col gap-3 justify-center" : "justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarContent({ children, className, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto overflow-x-hidden py-4", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <div className={cn("p-4 flex-shrink-0 theme-border border-t", className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SidebarMenu({ children, className, ...props }: SidebarMenuProps) {
  const { isCollapsed } = useSidebar();

  return (
    <nav className={cn("space-y-2", isCollapsed ? "px-2" : "px-3", className)} {...props}>
      {children}
    </nav>
  );
}

interface SidebarMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

export function SidebarMenuItem({
  icon,
  children,
  isActive,
  className,
  ...props
}: SidebarMenuItemProps) {
  const { isCollapsed } = useSidebar();

  return (
    <button
      className={cn(
        "flex items-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group relative w-full overflow-hidden",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
          : "theme-text-primary hover:bg-gray-100 dark:hover:bg-gray-800",
        isCollapsed
          ? "justify-center p-2"
          : "gap-3 px-3 py-2.5",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      {!isCollapsed && <span className="truncate text-left flex-1 whitespace-nowrap">{children}</span>}

      {/* Tooltip for collapsed state */}
      {isCollapsed && children && (
        <span className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
          {children}
        </span>
      )}
    </button>
  );
}

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export function SidebarToggle({ icon, className, ...props }: SidebarToggleProps) {
  const { toggleCollapse } = useSidebar();

  return (
    <button
      onClick={toggleCollapse}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors",
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
