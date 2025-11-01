"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Clock,
  Calendar,
  Users,
  Plus,
  Search,
  BookOpen,
  AlertCircle,
  Timer,
  Edit,
  Trash2,
  Eye,
  Play,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { API_BASE_URL, API_URL } from "@/lib/constants";

interface Paper {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  deadline: string;
  timeLimit: number;
  createdAt: string;
}



export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'available' | 'expired' | 'not-answered' | 'answered'>('available');
  const [answeredPapers, setAnsweredPapers] = useState<string[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }; 
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchPapers();
    }
  }, [authLoading, user]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = user?.role === 'student' ? `${API_URL}/papers/student/all` : `${API_URL}/papers`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(response.data.papers || []);
      if (user?.role === 'student') {
        setAnsweredPapers(response.data.answeredPapers || []);
        setActiveTab('not-answered');
      }
    } catch (error) {
      console.error("Error fetching papers:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        window.location.href = "/login";
      } else {
        setError("Failed to load papers");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (paperId: string, paperTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${paperTitle}"?\n\nThis action cannot be undone!`
    );
    
    if (!confirmDelete) return;

    try {
      setDeleting(paperId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/papers/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPapers(prev => prev.filter(paper => paper._id !== paperId));
      alert("Paper deleted successfully!");
    } catch (error) {
      console.error("Error deleting paper:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to delete paper");
      } else {
        alert("Failed to delete paper");
      }
    } finally {
      setDeleting("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isExpired = (deadline: string) => {
    return new Date() > new Date(deadline);
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const isStudent = user?.role === "student";

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          paper.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isStudent) {
      const isAnswered = answeredPapers.includes(paper._id);
      const expired = isExpired(paper.deadline);

      if (activeTab === 'not-answered') {
        return matchesSearch && !isAnswered && !expired;
      }
      if (activeTab === 'answered') {
        return matchesSearch && isAnswered;
      }
      if (activeTab === 'expired') {
        return matchesSearch && expired;
      }
      return false;
    } else { // Teacher/Admin view
      if (activeTab === 'available') {
        return matchesSearch && !isExpired(paper.deadline);
      } else {
        return matchesSearch && isExpired(paper.deadline);
      }
    }
  });

  // Check if user is student for different UI

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading papers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-600" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isStudent ? 'Examination Hub' : 'Manage Papers'}
                </h1>
                <p className="text-gray-600">
                  {isStudent 
                    ? 'Access your ICT A-Level examination papers and track your progress' 
                    : 'Create, edit, and manage examination papers for your students'
                  }
                </p>
              </div>
            </div>

            {/* Only show Create button for teachers */}
            {!isStudent && (
              <Link href="/papers/create">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Plus size={20} className="mr-2" />
                  Create New Paper
                </Button>
              </Link>
            )}

            {/* Show Results link for students */}
            {isStudent && (
              <Link href="/papers/results/my-results">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Trophy size={20} className="mr-2" />
                  My Results
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs for Students */}
        {isStudent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex space-x-4"
          >
            <Button 
              variant={activeTab === 'not-answered' ? 'default' : 'outline'}
              onClick={() => setActiveTab('not-answered')}
              className={activeTab === 'not-answered' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"}
            >
              Not Answered
            </Button>
            <Button 
              variant={activeTab === 'answered' ? 'default' : 'outline'}
              onClick={() => setActiveTab('answered')}
              className={activeTab === 'answered' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"}
            >
              Answered
            </Button>
            <Button 
              variant={activeTab === 'expired' ? 'default' : 'outline'}
              onClick={() => setActiveTab('expired')}
              className={activeTab === 'expired' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"}
            >
              Expired
            </Button>
          </motion.div>
        )}

        {/* Tabs for Teachers */}
        {!isStudent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex space-x-4"
          >
            <Button 
              variant={activeTab === 'available' ? 'default' : 'outline'}
              onClick={() => setActiveTab('available')}
              className={activeTab === 'available' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"}
            >
              Available Papers
            </Button>
            <Button 
              variant={activeTab === 'expired' ? 'default' : 'outline'}
              onClick={() => setActiveTab('expired')}
              className={activeTab === 'expired' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-100"}
            >
              Expired Papers
            </Button>
          </motion.div>
        )}

        {/* Statistics Cards - Role Based */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Papers */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isStudent ? "Available Papers" : "Total Papers"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {papers.length}
                </p>
              </div>
            </div>
          </div>

          {/* Active/Available */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isStudent ? "Active Papers" : "Published Papers"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {papers.filter(p => !isExpired(p.deadline)).length}
                </p>
              </div>
            </div>
          </div>

          {/* Questions/Completed */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isStudent ? "Completed" : "Total Questions"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isStudent 
                    ? "0" // You can calculate actual completed papers here
                    : papers.reduce((sum, p) => sum + p.totalQuestions, 0)
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Average/Expired */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                {isStudent ? (
                  <Trophy className="text-orange-600" size={24} />
                ) : (
                  <AlertCircle className="text-orange-600" size={24} />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isStudent ? "Average Score" : "Expired Papers"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isStudent 
                    ? "0%" // You can calculate actual average here
                    : papers.filter(p => isExpired(p.deadline)).length
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Papers Grid */}
        {filteredPapers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Papers Found</h3>
            <p className="text-gray-600 mb-6">
              {isStudent 
                ? 'No examination papers are currently available for you'
                : 'Create your first examination paper to get started'
              }
            </p>
            {!isStudent && (
              <Link href="/papers/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={20} className="mr-2" />
                  Create First Paper
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                          {paper.title}
                        </h3>
                      </div>
                    </div>
                    
                    {isExpired(paper.deadline) ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Expired
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {paper.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {paper.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} className="text-blue-500" />
                      <span>{paper.totalQuestions} Questions</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Timer size={16} className="text-emerald-500" />
                      <span>{paper.timeLimit} Minutes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-orange-500" />
                      <span>Due: {formatDate(paper.deadline)}</span>
                    </div>

                    {!isExpired(paper.deadline) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-yellow-500" />
                        <span className="font-medium text-yellow-700">
                          {getTimeRemaining(paper.deadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Different for Students vs Teachers */}
                  <div className="flex gap-2">
                    {isStudent ? (
                      /* Student View */
                      <Link href={`/papers/${paper._id}`} className="w-full">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isExpired(paper.deadline)}
                        >
                          <Play size={16} className="mr-2" />
                          {isExpired(paper.deadline) ? 'Expired' : 'Start Exam'}
                        </Button>
                      </Link>
                    ) : (
                      /* Teacher View */
                      <>
                        <Link href={`/papers/${paper._id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                        </Link>
                        
                        <Link href={`/papers/${paper._id}/results`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                            <Eye size={16} className="mr-2" />
                            Results
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          disabled={deleting === paper._id}
                          onClick={() => handleDeletePaper(paper._id, paper.title)}
                        >
                          {deleting === paper._id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
