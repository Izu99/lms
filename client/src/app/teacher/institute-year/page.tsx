"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import InstituteYearForm from "@/components/InstituteYearForm";
import YearForm from "@/components/YearForm";
import {
  Plus,
  Edit,
  Trash2,
  School,
  Calendar,
  Settings,
  MapPin,
  Users,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";

interface InstituteData {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface YearData {
  _id: string;
  year: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [years, setYears] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [showInstituteForm, setShowInstituteForm] = useState(false);
  const [showYearForm, setShowYearForm] = useState(false);
  const [editingInstitute, setEditingInstitute] = useState<InstituteData | null>(null);
  const [editingYear, setEditingYear] = useState<YearData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      window.location.href = "/login";
      return;
    }
    
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchData();
    } catch (error) {
      window.location.href = "/login";
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instituteRes, yearRes] = await Promise.all([
        axios.get(`${API_URL}/institutes`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/years`, { headers: getAuthHeaders() })
      ]);
      
      setInstitutes(instituteRes.data.institutes || []);
      setYears(yearRes.data.years || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Institute operations
  const handleSaveInstitute = async (instituteData: { name: string; location: string }) => {
    try {
      if (editingInstitute) {
        await axios.put(`${API_URL}/institutes/${editingInstitute._id}`,
          instituteData, { headers: getAuthHeaders() });
      } else {
        await axios.post(`${API_URL}/institutes`,
          instituteData, { headers: getAuthHeaders() });
      }
      
      await fetchData();
      setShowInstituteForm(false);
      setEditingInstitute(null);
    } catch (error) {
      console.error("Error saving institute:", error);
      alert("Error saving institute. Please try again.");
    }
  };

  const handleDeleteInstitute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institute?")) return;
    
    try {
      await axios.delete(`${API_URL}/institutes/${id}`,
        { headers: getAuthHeaders() });
      await fetchData();
    } catch (error) {
      console.error("Error deleting institute:", error);
      alert("Error deleting institute. Please try again.");
    }
    
  };

  // Year operations
  const handleSaveYear = async (yearData: { year: string; name: string }) => {
    try {
      if (editingYear) {
        await axios.put(`${API_URL}/years/${editingYear._id}`,
          yearData, { headers: getAuthHeaders() });
      } else {
        await axios.post(`${API_URL}/years`,
          yearData, { headers: getAuthHeaders() });
      }
      
      await fetchData();
      setShowYearForm(false);
      setEditingYear(null);
    } catch (error) {
      console.error("Error saving year:", error);
      alert("Error saving year. Please try again.");
    }
  };

  const handleDeleteYear = async (id: string) => {
    if (!confirm("Are you sure you want to delete this year?")) return;
    
    try {
      await axios.delete(`${API_URL}/years/${id}`,
        { headers: getAuthHeaders() });
      await fetchData();
    } catch (error) {
      console.error("Error deleting year:", error);
      alert("Error deleting year. Please try again.");
    }
  };

  const openInstituteForm = (instituteData?: InstituteData) => {
    setEditingInstitute(instituteData || null);
    setShowInstituteForm(true);
  };

  const openYearForm = (yearData?: YearData) => {
    setEditingYear(yearData || null);
    setShowYearForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const filteredInstitutes = institutes.filter(instituteItem => 
    instituteItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instituteItem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredYears = years.filter(yearItem =>
    yearItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yearItem.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TeacherLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Settings className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--theme-text-primary)]">Institute & Year Management</h1>
              <p className="text-[var(--theme-text-secondary)]">Manage institutes, years, and academic settings for your ICT program</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-4">
            <div className="relative max-w-md">
              <Input
                placeholder="Search institutes or years..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <School className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Total Institutes</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">{institutes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Academic Years</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">{years.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Locations</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                  {[...new Set(institutes.map(c => c.location))].length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">A-Level Programs</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">ICT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Institutes Section */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)]">
            <div className="p-6 border-b border-[var(--theme-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <School className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">Institutes</h2>
                    <p className="text-sm text-[var(--theme-text-tertiary)]">Manage institute groups and locations</p>
                  </div>
                </div>
                <Button onClick={() => openInstituteForm()} className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Institute
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredInstitutes.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredInstitutes.map((instituteItem) => (
                    <div key={instituteItem._id} className="flex items-center justify-between p-4 border border-[var(--theme-border)] rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <Users className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--theme-text-primary)]">{instituteItem.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-[var(--theme-text-tertiary)]">
                            <MapPin size={14} />
                            <span>{instituteItem.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openInstituteForm(instituteItem)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteInstitute(instituteItem._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <School className="mx-auto text-[var(--theme-text-tertiary)] mb-4" size={48} />
                  <h3 className="text-lg font-medium text-[var(--theme-text-primary)] mb-2">No institutes found</h3>
                  <p className="text-[var(--theme-text-secondary)] mb-6">Create your first institute to get started</p>
                  <Button onClick={() => openInstituteForm()}>
                    <Plus size={20} className="mr-2" />
                    Add Institute
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Years Section */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)]">
            <div className="p-6 border-b border-[var(--theme-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">Academic Years</h2>
                    <p className="text-sm text-[var(--theme-text-tertiary)]">Manage A-Level year groups</p>
                  </div>
                </div>
                <Button onClick={() => openYearForm()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                  <Plus size={16} />
                  Add Year
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredYears.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredYears.map((yearItem) => (
                    <div key={yearItem._id} className="flex items-center justify-between p-4 border border-[var(--theme-border)] rounded-lg hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                          <Calendar className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--theme-text-primary)]">{yearItem.name}</h3>
                          <p className="text-sm text-[var(--theme-text-tertiary)]">Academic Year {yearItem.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openYearForm(yearItem)}
                          className="hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteYear(yearItem._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-[var(--theme-text-tertiary)] mb-4" size={48} />
                  <h3 className="text-lg font-medium text-[var(--theme-text-primary)] mb-2">No years found</h3>
                  <p className="text-[var(--theme-text-secondary)] mb-6">Add academic years for your program</p>
                  <Button onClick={() => openYearForm()} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                    <Plus size={20} className="mr-2" />
                    Add Year
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => openInstituteForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="text-blue-600 dark:text-blue-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Add New Institute</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Create a new institute group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => openYearForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Plus className="text-green-600 dark:text-green-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Add Academic Year</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Create a new year group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/videos"}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <School className="text-purple-600 dark:text-purple-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Manage Videos</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Upload and organize content</p>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {showInstituteForm && (
        <InstituteYearForm
          onSaveInstitute={handleSaveInstitute}
          onSaveYear={handleSaveYear}
          onClose={() => {
            setShowInstituteForm(false);
            setEditingInstitute(null);
          }}
          instituteData={editingInstitute}
          mode="institute"
        />
      )}

      {showYearForm && (
        <YearForm
          onSave={handleSaveYear}
          onClose={() => {
            setShowYearForm(false);
            setEditingYear(null);
          }}
          yearData={editingYear}
        />
      )}
    </TeacherLayout>
  );
}
