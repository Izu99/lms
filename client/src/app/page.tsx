"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Calendar,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  Bell,
  Download,
  User,
  Play,
  ChevronRight,
  Eye,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      window.location.href = "/auth/login";
      return;
    }
    
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/auth/login";
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Different content based on user role
  const getDashboardContent = () => {
    if (user.role === "student") {
      return {
        welcomeMessage: "Welcome back to your learning journey!",
        stats: [
          { label: "Enrolled Courses", value: "3", icon: BookOpen, color: "blue" },
          { label: "Completed Tasks", value: "12", icon: CheckCircle, color: "green" },
          { label: "Total Points", value: "245", icon: Trophy, color: "purple" },
          { label: "Next Deadline", value: "2 days", icon: Clock, color: "red" }
        ],
        quickActions: [
          { label: "Watch Videos", href: "/videos", icon: Video },
          { label: "View Assignments", href: "/assignments", icon: FileText },
          { label: "Check Grades", href: "/grades", icon: Trophy },
          { label: "Class Schedule", href: "/schedule", icon: Calendar }
        ],
        recentActivities: [
          { text: "Completed Python Variables lesson", time: "2 hours ago", icon: CheckCircle },
          { text: "Submitted Database assignment", time: "1 day ago", icon: FileText },
          { text: "Watched HTML/CSS tutorial", time: "2 days ago", icon: Video }
        ]
      };
    }

    if (user.role === "teacher") {
      return {
        welcomeMessage: "Welcome to your teaching dashboard!",
        stats: [
          { label: "Total Students", value: "28", icon: User, color: "blue" },
          { label: "Active Courses", value: "3", icon: BookOpen, color: "green" },
          { label: "Videos Uploaded", value: "15", icon: Video, color: "purple" },
          { label: "Pending Reviews", value: "7", icon: Clock, color: "orange" }
        ],
        quickActions: [
          { label: "Upload Video", href: "/videos", icon: Upload },
          { label: "Create Assignment", href: "/assignments", icon: FileText },
          { label: "Grade Students", href: "/grades", icon: Trophy },
          { label: "View Students", href: "/students", icon: User }
        ],
        recentActivities: [
          { text: "Uploaded new Python tutorial", time: "3 hours ago", icon: Upload },
          { text: "Graded 5 assignments", time: "1 day ago", icon: Trophy },
          { text: "Added new course material", time: "2 days ago", icon: BookOpen }
        ]
      };
    }

    // Default/admin content
    return {
      welcomeMessage: "Welcome to the admin dashboard!",
      stats: [
        { label: "Total Users", value: "156", icon: User, color: "blue" },
        { label: "Active Courses", value: "8", icon: BookOpen, color: "green" },
        { label: "System Status", value: "Good", icon: CheckCircle, color: "green" },
        { label: "Storage Used", value: "67%", icon: Clock, color: "orange" }
      ],
      quickActions: [
        { label: "Manage Users", href: "/users", icon: User },
        { label: "System Settings", href: "/settings", icon: Trophy },
        { label: "View Reports", href: "/reports", icon: FileText },
        { label: "Backup Data", href: "/backup", icon: Download }
      ],
      recentActivities: [
        { text: "New user registration", time: "1 hour ago", icon: User },
        { text: "System backup completed", time: "6 hours ago", icon: CheckCircle },
        { text: "Course updated", time: "1 day ago", icon: BookOpen }
      ]
    };
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600">{content.welcomeMessage}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <action.icon className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.label}</p>
                        <p className="text-sm text-gray-500">Quick access</p>
                      </div>
                      <ChevronRight className="text-gray-400 ml-auto" size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {content.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon className="text-gray-500" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Info */}
          <div className="space-y-6">
            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Bell className="text-blue-500 mt-1" size={16} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      New Programming Resources
                    </h4>
                    <p className="text-sm text-gray-600">
                      Check out the new Python tutorials
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-orange-500 mt-1" size={16} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Assignment Deadline
                    </h4>
                    <p className="text-sm text-gray-600">
                      Database project due in 2 days
                    </p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
              </div>
              <div className="p-6 space-y-3">
                {user.role === "student" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Videos Watched</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Assignments Done</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Study Hours</span>
                      <span className="font-medium">12h</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Videos Uploaded</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Assignments Graded</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Student Messages</span>
                      <span className="font-medium">8</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
