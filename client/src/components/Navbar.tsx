"use client";
import { useState } from "react";
import { 
  GraduationCap, 
  User, 
  Bell, 
  Menu, 
  X,
  LogOut,
  Settings,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Video,
  Calendar,
  Upload,
  School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  user: {
    username: string;
    role: "student" | "teacher" | "admin";
  };
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Different navigation tabs based on user role
  const getNavTabs = () => {
    if (user.role === "student") {
      return [
        { href: "/", label: "Dashboard", icon: BarChart3 },
        { href: "/videos", label: "Video Lessons", icon: Video },
        { href: "/assignments", label: "Assignments", icon: FileText },
        { href: "/grades", label: "My Grades", icon: BarChart3 },
        { href: "/schedule", label: "Schedule", icon: Calendar }
      ];
    }

    if (user.role === "teacher") {
      return [
        { href: "/", label: "Dashboard", icon: BarChart3 },
        { href: "/videos", label: "Video Management", icon: Video },
        { href: "/settings", label: "Class & Year Setup", icon: School },
        { href: "/students", label: "Students", icon: Users },
        { href: "/assignments", label: "Assignments", icon: FileText },
        // { href: "/grades", label: "Gradebook", icon: BarChart3 }
      ];
    }

    // Admin role
    return [
      { href: "/", label: "Dashboard", icon: BarChart3 },
      { href: "/videos", label: "All Videos", icon: Video },
      { href: "/settings", label: "System Settings", icon: Settings },
      { href: "/users", label: "Users", icon: Users },
      { href: "/reports", label: "Reports", icon: BarChart3 }
    ];
  };

  const navTabs = getNavTabs();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <GraduationCap size={32} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                EduForm
              </h1>
              <p className="text-xs text-gray-500 font-medium">A-Level Learning Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                <tab.icon size={16} />
                {tab.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 h-auto p-2"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </Button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            {/* Mobile Navigation Tabs */}
            <nav className="space-y-1 px-4">
              {navTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
}
