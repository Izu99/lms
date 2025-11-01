"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Clock,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/constants";

interface Result {
  _id: string;
  paperId: {
    _id: string;
    title: string;
    description?: string;
    deadline: string;
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  submittedAt: string;
}



export default function MyResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }; 
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchResults();
    } else if (!authLoading && !user) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, [authLoading, user]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/papers/results/my-results`, { headers });
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // If 401, it means the cookie is invalid or missing, redirect to login
        window.location.href = "/login";
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
    if (percentage >= 80) return <Trophy className="text-gold" size={20} />;
    if (percentage >= 60) return <CheckCircle className="text-green-500" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
  };

  const averageScore = results.length > 0 ? 
    Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0;

  const bestScore = results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0;
  const totalPapers = results.length;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Trophy className="text-emerald-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
              <p className="text-gray-600">Track your examination performance and progress</p>
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

        {/* Summary Cards */}
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Papers Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPapers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-emerald-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Average Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(averageScore)}`}>
                      {getGradeLetter(averageScore)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Best Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{bestScore}%</p>
                    {getPerformanceIcon(bestScore)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results List */}
        {results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your first paper to see results here
            </p>
            <Link href="/papers">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Target size={20} className="mr-2" />
                View Available Papers
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {result.paperId.title}
                    </h3>
                    {result.paperId.description && (
                      <p className="text-gray-600 mb-2">{result.paperId.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>Submitted: {formatDate(result.submittedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg mb-2 ${getGradeColor(result.percentage)}`}>
                      {getGradeLetter(result.percentage)}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      {getPerformanceIcon(result.percentage)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Score</p>
                    <p className="text-lg font-bold text-gray-900">
                      {result.score}/{result.totalQuestions}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Percentage</p>
                    <p className="text-lg font-bold text-gray-900">{result.percentage}%</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Time Spent</p>
                    <p className="text-lg font-bold text-gray-900">{result.timeSpent} min</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Questions</p>
                    <p className="text-lg font-bold text-gray-900">{result.totalQuestions}</p>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      result.percentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      result.percentage >= 80 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      result.percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      result.percentage >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow">
                      {result.percentage}%
                    </span>
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
