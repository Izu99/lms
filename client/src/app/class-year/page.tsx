"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import InstituteForm from "@/components/ClassForm";
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
  year: number;
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
  const handleSaveYear = async (yearData: { year: number; name: string }) => {
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
    yearItem.year.toString().includes(searchTerm)
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Institute & Year Management</h1>
              <p className="text-gray-600">Manage institutes, years, and academic settings for your ICT program</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <School className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Institutes</p>
                <p className="text-2xl font-bold text-gray-900">{institutes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Academic Years</p>
                <p className="text-2xl font-bold text-gray-900">{years.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...new Set(institutes.map(c => c.location))].length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">A-Level Programs</p>
                <p className="text-2xl font-bold text-gray-900">ICT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Institutes Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Institutes</h2>
                    <p className="text-sm text-gray-500">Manage institute groups and locations</p>
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
                    <div key={instituteItem._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{instituteItem.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
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
                          className="hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteInstitute(instituteItem._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <School className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No institutes found</h3>
                  <p className="text-gray-600 mb-6">Create your first institute to get started</p>
                  <Button onClick={() => openInstituteForm()}>
                    <Plus size={20} className="mr-2" />
                    Add Institute
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Years Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Academic Years</h2>
                    <p className="text-sm text-gray-500">Manage A-Level year groups</p>
                  </div>
                </div>
                <Button onClick={() => openYearForm()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
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
                    <div key={yearItem._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">{yearItem.year}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{yearItem.name}</h3>
                          <p className="text-sm text-gray-500">A-Level Year {yearItem.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openYearForm(yearItem)}
                          className="hover:bg-green-50"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteYear(yearItem._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No years found</h3>
                  <p className="text-gray-600 mb-6">Add academic years for your program</p>
                  <Button onClick={() => openYearForm()} className="bg-green-600 hover:bg-green-700">
                    <Plus size={20} className="mr-2" />
                    Add Year
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => openInstituteForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
            >
              <Plus className="text-blue-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Add New Institute</p>
                <p className="text-sm text-gray-500">Create a new institute group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => openYearForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-green-300 hover:bg-green-50"
            >
              <Plus className="text-green-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Add Academic Year</p>
                <p className="text-sm text-gray-500">Create a new year group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/videos"}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-purple-300 hover:bg-purple-50"
            >
              <School className="text-purple-600" size={20} />
              <div className="text-left">
                <p className="font-medium text-gray-900">Manage Videos</p>
                <p className="text-sm text-gray-500">Upload and organize content</p>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {/* Forms */}
      {showInstituteForm && (
        <InstituteForm
          instituteData={editingInstitute}
          onSave={handleSaveInstitute}
          onClose={() => {
            setShowInstituteForm(false);
            setEditingInstitute(null);
          }}
        />
      )}

      {showYearForm && (
        <YearForm
          yearData={editingYear}
          onSave={handleSaveYear}
          onClose={() => {
            setShowYearForm(false);
            setEditingYear(null);
          }}
        />
      )}
    </div>
  );
}