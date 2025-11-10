"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/modules/shared/hooks/useAuth";
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
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { InfoDialog } from "@/components/InfoDialog";

interface Paper {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  deadline: string;
  timeLimit: number;
  createdAt: string;
  attemptCount?: number; // Number of students who attempted this paper
  isCompleted?: boolean; // For student view
  percentage?: number; // For student view
}

export default function StudentPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'not-answered' | 'answered' | 'expired'>('not-answered');
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
      const url = `${API_URL}/papers/student/all`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(response.data.papers || []);
      setAnsweredPapers(response.data.attemptedPapers || []);
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

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          paper.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen theme-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="theme-text-secondary">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-secondary">
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold theme-text-primary">
                  Examination Hub
                </h1>
                <p className="theme-text-secondary">
                  Access your ICT A-Level examination papers and track your progress
                </p>
              </div>
            </div>

            {/* Show My Results link for students */}
            <Link href="/papers/results/my-results">
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Trophy size={20} className="mr-2" />
                My Results
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="theme-bg-primary/80 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 theme-text-tertiary" size={20} />
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 theme-border focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 rounded-xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Tabs for Students */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex space-x-4"
        >
          <Button 
            variant={activeTab === 'not-answered' ? 'default' : 'outline'}
            onClick={() => setActiveTab('not-answered')}
            className={activeTab === 'not-answered' ? "bg-blue-600 hover:bg-blue-700 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}
          >
            Not Answered
          </Button>
          <Button 
            variant={activeTab === 'answered' ? 'default' : 'outline'}
            onClick={() => setActiveTab('answered')}
            className={activeTab === 'answered' ? "bg-blue-600 hover:bg-blue-700 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}
          >
            Answered
          </Button>
          <Button 
            variant={activeTab === 'expired' ? 'default' : 'outline'}
            onClick={() => setActiveTab('expired')}
            className={activeTab === 'expired' ? "bg-blue-600 hover:bg-blue-700 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}
          >
            Expired
          </Button>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Papers */}
          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Total Papers</p>
                <p className="text-2xl font-bold theme-text-primary">
                  {papers.length}
                </p>
              </div>
            </div>
          </div>

          {/* Active Papers */}
          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Clock className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Active Papers</p>
                <p className="text-2xl font-bold theme-text-primary">
                  {papers.filter(p => !isExpired(p.deadline)).length}
                </p>
              </div>
            </div>
          </div>

          {/* Answered Papers */}
          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Answered Papers</p>
                <p className="text-2xl font-bold theme-text-primary">
                  {answeredPapers.length}
                </p>
              </div>
            </div>
          </div>

          {/* Expired Papers */}
          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Expired Papers</p>
                <p className="text-2xl font-bold theme-text-primary">
                  {papers.filter(p => isExpired(p.deadline)).length}
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
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-400 dark:text-gray-500" size={48} />
            </div>
            <h3 className="text-xl font-semibold theme-text-primary mb-2">No Papers Found</h3>
            <p className="theme-text-secondary mb-6">
              No examination papers are currently available for you.
            </p>
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
                <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg theme-border p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold theme-text-primary text-lg leading-tight line-clamp-2">
                          {paper.title}
                        </h3>
                      </div>
                    </div>
                    
                    {isExpired(paper.deadline) ? (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
                        Expired
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {paper.description && (
                    <p className="theme-text-secondary text-sm mb-4 line-clamp-2 flex-grow">
                      {paper.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <Users size={16} className="text-blue-500" />
                      <span>{paper.totalQuestions} Questions</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <Timer size={16} className="text-emerald-500" />
                      <span>{paper.timeLimit} Minutes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <Calendar size={16} className="text-orange-500" />
                      <span>Due: {formatDate(paper.deadline)}</span>
                    </div>

                    {!isExpired(paper.deadline) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-yellow-500" />
                        <span className="font-medium text-yellow-700 dark:text-yellow-400">
                          {getTimeRemaining(paper.deadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Student View */}
                  <div className="flex gap-2 mt-auto">
                    {answeredPapers.includes(paper._id) ? (
                      <Link href={`/student/papers/answers/${paper._id}`} className="w-full">
                        <Button 
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                        >
                          <Trophy size={16} className="mr-2" />
                          See Answer
                        </Button>
                      </Link>
                    ) : isExpired(paper.deadline) ? (
                      <Button variant="outline" disabled className="w-full bg-black text-white">
                        Expired
                      </Button>
                    ) : (
                      <Link href={`/student/papers/${paper._id}`} className="w-full">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Play size={16} className="mr-2" />
                          Start Exam
                        </Button>
                      </Link>
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
