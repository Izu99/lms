"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Users,
  Search,
  Filter,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Mail,
  Calendar,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface StudentData {
  _id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status?: 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid';

export default function StudentManagementPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: StudentData['status'] | ''; notes: string }>({ status: '', notes: '' });
  const [updating, setUpdating] = useState(false);

  // Get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      // Check if user is teacher or admin
      if (userData.role !== 'teacher' && userData.role !== 'admin') {
        alert('Access denied. Only teachers can access student management.');
        window.location.href = "/dashboard";
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/login";
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fetch students after user is loaded
  useEffect(() => {
    if (user && !userLoading) {
      fetchStudents();
    }
  }, [user, userLoading]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/students", {
        headers: getAuthHeaders(),
      });
      
      console.log("Students fetched:", response.data);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (axios.isAxiosError(error) && error.response?.status === 403) {
        alert('Access denied. Only teachers can view student list.');
        window.location.href = "/dashboard";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (studentId: string) => {
    if (!editForm.status) {
      alert('Please select a status');
      return;
    }

    try {
      setUpdating(true);
      
      const response = await axios.put(
        `http://localhost:5000/api/auth/students/${studentId}/status`,
        {
          status: editForm.status,
          notes: editForm.notes
        },
        {
          headers: getAuthHeaders(),
        }
      );

      // Update the student in the local state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === studentId 
            ? { ...student, status: editForm.status as StudentData['status'], notes: editForm.notes }
            : student
        )
      );

      setEditingStudent(null);
      setEditForm({ status: '', notes: '' });
      
      alert('Student status updated successfully!');
      
    } catch (error) {
      console.error("Error updating student status:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error updating student status");
      } else {
        alert("Error updating student status. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = (student: StudentData) => {
    setEditingStudent(student._id);
    setEditForm({
      status: student.status || 'pending',
      notes: student.notes || ''
    });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setEditForm({ status: '', notes: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} className="text-green-600" />;
      case 'paid': return <DollarSign size={16} className="text-blue-600" />;
      case 'inactive': return <XCircle size={16} className="text-red-600" />;
      case 'unpaid': return <Clock size={16} className="text-yellow-600" />;
      case 'pending': return <Clock size={16} className="text-gray-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getDisplayName = (student: StudentData) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return student.username;
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      getDisplayName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const paidStudents = students.filter(s => s.status === 'paid').length;
  const pendingStudents = students.filter(s => s.status === 'pending').length;

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600">
                Manage student registrations, status, and track payments for physical classes
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Paid Students</p>
                <p className="text-2xl font-bold text-gray-900">{paidStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="text-gray-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Students</p>
                <p className="text-2xl font-bold text-gray-900">{pendingStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search students by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Students ({filteredStudents.length})
              </h3>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No students found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your search or filter criteria"
                    : "No students have registered yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={20} className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {getDisplayName(student)}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{student.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email ? (
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              {student.email}
                            </div>
                          ) : (
                            <span className="text-gray-400">No email</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStudent === student._id ? (
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value as StudentData['status'] })}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          ) : (
                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                              {getStatusIcon(student.status)}
                              {student.status || 'pending'}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(student.createdAt)}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          {editingStudent === student._id ? (
                            <textarea
                              value={editForm.notes}
                              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                              placeholder="Add notes about student..."
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
                              rows={2}
                            />
                          ) : (
                            <div className="truncate">
                              {student.notes ? (
                                <div className="flex items-start gap-1">
                                  <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                  <span>{student.notes}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">No notes</span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingStudent === student._id ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(student._id)}
                                disabled={updating}
                                className="flex items-center gap-1"
                              >
                                {updating ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Save size={14} />
                                )}
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                                disabled={updating}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(student)}
                              className="flex items-center gap-1"
                            >
                              <Edit size={14} />
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
