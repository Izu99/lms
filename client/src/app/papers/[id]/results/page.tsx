"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  Trophy,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  ArrowLeft,
  User,
  Award,
  Target,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/lib/constants";

interface Student {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface Result {
  _id: string;
  studentId: Student;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  submittedAt: string;
  status: string;
}

interface Paper {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  deadline: string;
  timeLimit: number;
}

interface ResultsData {
  paper: Paper;
  results: Result[];
  stats: {
    totalSubmissions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
}



export default function PaperResultsPage() {
  const router = useRouter();
  const { id: paperId } = useParams();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  const getAuthHeaders = () => {
    return { 'Content-Type': 'application/json' }; // No Authorization header needed for cookie-based auth
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'teacher' && user.role !== 'admin') {
        router.push('/papers');
        return;
      }
      fetchResults();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/papers/${paperId}/results`, { headers });
      setResultsData(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to load results");
      } else {
        setError("Failed to load results");
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

  const getStudentName = (student: Student) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return student.username;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 80) return "text-blue-600 bg-blue-100";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
    if (percentage >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "F";
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 80) return <Trophy className="text-yellow-500" size={16} />;
    if (percentage >= 60) return <CheckCircle className="text-green-500" size={16} />;
    return <XCircle className="text-red-500" size={16} />;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <AlertCircle className="text-red-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only teachers can view paper results</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar user={user} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="text-red-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/papers">
              <Button>Back to Papers</Button>
            </Link>
          </div>
        </main>
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
          <div className="flex items-center gap-4 mb-6">
            <Link href="/papers">
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-emerald-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paper Results</h1>
              <p className="text-gray-600">View student performance and statistics</p>
            </div>
          </div>
        </motion.div>

        {/* Paper Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{resultsData.paper.title}</h2>
              {resultsData.paper.description && (
                <p className="text-gray-600">{resultsData.paper.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Total Questions</p>
              <p className="text-lg font-bold text-gray-900">{resultsData.paper.totalQuestions}</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Time Limit</p>
              <p className="text-lg font-bold text-gray-900">{resultsData.paper.timeLimit} min</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Deadline</p>
              <p className="text-lg font-bold text-gray-900">{formatDate(resultsData.paper.deadline)}</p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{resultsData.stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{resultsData.stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">{resultsData.stats.highestScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lowest Score</p>
                <p className="text-2xl font-bold text-gray-900">{resultsData.stats.lowestScore}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Student Results Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Student Results</h3>

          {resultsData.results.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h4>
                                <p className="text-gray-600">Students haven&apos;t submitted this paper yet</p>            </div>
          ) : (
            <div className="space-y-4">
              {resultsData.results.map((result, index) => (
                <motion.div
                  key={result._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-900">{getStudentName(result.studentId)}</p>
                        <p className="text-sm text-gray-500">@{result.studentId.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="font-bold text-gray-900">{result.score}/{result.totalQuestions}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-bold text-gray-900">{result.timeSpent}m</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="font-bold text-gray-900">{formatDate(result.submittedAt)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPerformanceIcon(result.percentage)}
                      <div className={`px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(result.percentage)}`}>
                        {getGradeLetter(result.percentage)}
                      </div>
                      <span className="font-bold text-lg text-gray-900 ml-2">{result.percentage}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Performance Distribution */}
          {resultsData.results.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h4>
              <div className="grid grid-cols-5 gap-2">
                {['A+', 'A', 'B+', 'B', 'C/F'].map((grade, index) => {
                  const ranges = [
                    [90, 100], [80, 89], [70, 79], [60, 69], [0, 59]
                  ];
                  const [min, max] = ranges[index];
                  const count = resultsData.results.filter(r => r.percentage >= min && r.percentage <= max).length;
                  const percentage = resultsData.results.length > 0 ? Math.round((count / resultsData.results.length) * 100) : 0;
                  
                  return (
                    <div key={grade} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-bold text-lg text-gray-900">{grade}</p>
                      <p className="text-sm text-gray-500">{count} students</p>
                      <p className="text-xs text-gray-400">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
