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
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Bell,
  Download,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [user, setUser] = useState({ username: "student123", role: "student" as const });

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = "/auth/login";
  };

  // Mock data - replace with real API calls
  const stats = {
    coursesEnrolled: 3,
    assignmentsCompleted: 12,
    totalPoints: 245,
    nextDeadline: "2 days"
  };

  const recentCourses = [
    {
      id: 1,
      title: "Programming Fundamentals",
      progress: 85,
      lastAccessed: "2 hours ago",
      nextLesson: "Functions and Procedures"
    },
    {
      id: 2,
      title: "Database Design",
      progress: 67,
      lastAccessed: "1 day ago", 
      nextLesson: "SQL Queries Advanced"
    },
    {
      id: 3,
      title: "Web Development",
      progress: 42,
      lastAccessed: "3 days ago",
      nextLesson: "JavaScript Basics"
    }
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: "Database Design Project",
      course: "Database Design",
      dueDate: "Nov 15, 2024",
      priority: "high",
      status: "pending"
    },
    {
      id: 2,
      title: "Python Programming Task",
      course: "Programming Fundamentals", 
      dueDate: "Nov 20, 2024",
      priority: "medium",
      status: "pending"
    },
    {
      id: 3,
      title: "HTML/CSS Portfolio",
      course: "Web Development",
      dueDate: "Nov 25, 2024",
      priority: "low",
      status: "pending"
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "New Programming Resources Available",
      message: "Check out the new Python tutorials in your course materials.",
      time: "2 hours ago",
      type: "info"
    },
    {
      id: 2,
      title: "Assignment Deadline Extension",
      message: "Database project deadline extended to November 20th.",
      time: "1 day ago",
      type: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}!
          </h2>
          <p className="text-gray-600">
            Continue your A-Level ICT journey. You have {upcomingAssignments.length} pending assignments.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.coursesEnrolled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assignmentsCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Deadline</p>
                <p className="text-2xl font-bold text-gray-900">{stats.nextDeadline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
              </div>
              <div className="p-6 space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500">Next: {course.nextLesson}</p>
                        <p className="text-xs text-gray-400">Last accessed {course.lastAccessed}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        Continue <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-gray-600">Completed "Variables and Data Types" lesson</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="text-blue-500" size={16} />
                    <span className="text-gray-600">Submitted "Python Basics" assignment</span>
                    <span className="text-gray-400">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Video className="text-purple-500" size={16} />
                    <span className="text-gray-600">Watched "Database Relationships" video</span>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Assignments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                        <p className="text-xs text-gray-400">Due: {assignment.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assignment.priority === 'high' ? 'bg-red-100 text-red-700' :
                        assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {assignment.priority}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Assignments
                </Button>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
              </div>
              <div className="p-6 space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      {announcement.type === 'warning' ? (
                        <AlertCircle className="text-orange-500 mt-0.5" size={16} />
                      ) : (
                        <Bell className="text-blue-500 mt-0.5" size={16} />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                        <p className="text-sm text-gray-600">{announcement.message}</p>
                        <p className="text-xs text-gray-400">{announcement.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Announcements
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText size={16} className="mr-2" />
                  Submit Assignment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar size={16} className="mr-2" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download Resources
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User size={16} className="mr-2" />
                  Contact Teacher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
