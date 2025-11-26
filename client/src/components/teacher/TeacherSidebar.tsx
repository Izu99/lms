import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  School,
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
import { TeacherFooter } from "./TeacherFooter";

interface TeacherSidebarProps {
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
    href: "/teacher",
    colorClass: "sidebar-icon-dashboard",
  },
  {
    title: "Videos",
    icon: Video,
    href: "/teacher/videos",
    colorClass: "sidebar-icon-videos",
  },
  {
    title: "Papers",
    icon: FileText,
    href: "/teacher/papers",
    colorClass: "sidebar-icon-papers",
  },
  {
    title: "Tutes",
    icon: BookOpen,
    href: "/teacher/tutes",
    colorClass: "sidebar-icon-tutes",
  },
  {
    title: "Students",
    icon: Users,
    href: "/teacher/students",
    colorClass: "sidebar-icon-students",
  },
  {
    title: "Institute & Year Setup",
    icon: School,
    href: "/teacher/institute-year",
    colorClass: "sidebar-icon-institute-year",
  },
  {
    title: "Meeting",
    icon: Video,
    href: "/teacher/meeting",
    colorClass: "sidebar-icon-zoom",
  },
  {
    title: "Course Packages",
    icon: Package,
    href: "/teacher/course-packages",
    colorClass: "sidebar-icon-course-packages",
  },
];

export function TeacherSidebar({ user, onLogout }: TeacherSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed } = useSidebar();

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
            {/* <SidebarToggle
              icon={<ChevronRight className="w-5 h-5 text-gray-600" />}
            /> */}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold theme-text-primary truncate">ezyICT LMS</h2>
                <p className="text-xs theme-text-secondary truncate">Teacher Portal</p>
              </div>
            </div>
            {/* <SidebarToggle
              icon={<ChevronLeft className="w-5 h-5 text-gray-600" />}
            /> */}
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
        <TeacherFooter user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
