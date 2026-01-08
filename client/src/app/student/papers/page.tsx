"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
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
import { getFileUrl } from "@/lib/fileUtils";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { InfoDialog } from "@/components/InfoDialog";
import CommonFilter from "@/components/common/CommonFilter";
import { StudentGridSkeleton } from "@/components/student/skeletons/StudentGridSkeleton";
import { useStudentFilters } from "@/modules/student/hooks/useStudentFilters";

interface Paper {
  _id: string;
  title: string;
  description?: string;
  totalQuestions: number;
  deadline: string;
  timeLimit: number;
  createdAt: string;
  attemptCount?: number;
  isCompleted?: boolean;
  percentage?: number;
  paperType: 'MCQ' | 'Structure-Essay';
  fileUrl?: string;
  thumbnailUrl?: string;
}

export default function StudentPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'mcq' | 'structure-essay'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'not-answered' | 'answered' | 'expired'>('not-answered');
  const [answeredPapers, setAnsweredPapers] = useState<string[]>([]);

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("all");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useStudentFilters();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = `${API_URL}/papers/student/all`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attemptedPapers = response.data.attemptedPapers || [];
      const papersData = response.data.papers || [];

      const mappedPapers = papersData.map((p: any) => ({
        ...p,
        isCompleted: attemptedPapers.includes(p._id)
      }));

      setPapers(mappedPapers);
      setAnsweredPapers(attemptedPapers);
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

    // Filter by Main Tab
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'mcq') {
      matchesTab = paper.paperType === 'MCQ';
    } else if (activeTab === 'structure-essay') {
      matchesTab = paper.paperType === 'Structure-Essay';
    }

    // Filter by Sub Tab
    let matchesSubTab = false;
    const isAnswered = answeredPapers.includes(paper._id);
    const isPaperExpired = isExpired(paper.deadline);

    if (activeSubTab === 'not-answered') {
      matchesSubTab = !isAnswered && !isPaperExpired;
    } else if (activeSubTab === 'answered') {
      matchesSubTab = isAnswered;
    } else if (activeSubTab === 'expired') {
      matchesSubTab = !isAnswered && isPaperExpired;
    }

    return matchesSearch && matchesTab && matchesSubTab;
  });

  if (loading) {
    return (
      <StudentLayout>
        <StudentGridSkeleton />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div>
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

            <Link href="/student/papers/results">
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Trophy size={20} className="mr-2" />
                My Results
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Statistics Cards - Moved to top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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

          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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

          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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

          <div className="theme-bg-primary/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
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

        {/* Filter Component */}
        <CommonFilter
          institutes={institutes}
          years={years}
          academicLevels={academicLevels}
          selectedInstitute={selectedInstitute}
          selectedYear={selectedYear}
          selectedAcademicLevel={selectedAcademicLevel}
          onInstituteChange={setSelectedInstitute}
          onYearChange={setSelectedYear}
          onAcademicLevelChange={setSelectedAcademicLevel}
          isLoadingInstitutes={isLoadingInstitutes}
          isLoadingYears={isLoadingYears}
          isLoadingAcademicLevels={isLoadingAcademicLevels}
        />

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

        {/* Combined Tabs - Paper Types on Left, Status on Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          {/* Paper Type Tabs - Left Side */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              className={`transition-all duration-300 ${activeTab === 'all' ? "bg-blue-500 hover:bg-blue-600 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              All Papers
            </Button>
            <Button
              variant={activeTab === 'mcq' ? 'default' : 'outline'}
              onClick={() => setActiveTab('mcq')}
              className={`transition-all duration-300 ${activeTab === 'mcq' ? "bg-blue-500 hover:bg-blue-600 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              MCQ Papers
            </Button>
            <Button
              variant={activeTab === 'structure-essay' ? 'default' : 'outline'}
              onClick={() => setActiveTab('structure-essay')}
              className={`transition-all duration-300 ${activeTab === 'structure-essay' ? "bg-blue-500 hover:bg-blue-600 text-white" : "theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              Structure and Essay Papers
            </Button>
          </div>

          {/* Status Tabs - Right Side */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={activeSubTab === 'not-answered' ? 'default' : 'outline'}
              onClick={() => setActiveSubTab('not-answered')}
              size="sm"
              className={`transition-all duration-300 text-sm ${activeSubTab === 'not-answered' ? "bg-green-500 hover:bg-green-600 text-white border-green-500" : "theme-text-secondary hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"}`}
            >
              Not Answered
            </Button>
            <Button
              variant={activeSubTab === 'answered' ? 'default' : 'outline'}
              onClick={() => setActiveSubTab('answered')}
              size="sm"
              className={`transition-all duration-300 text-sm ${activeSubTab === 'answered' ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500" : "theme-text-secondary hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"}`}
            >
              Answered
            </Button>
            <Button
              variant={activeSubTab === 'expired' ? 'default' : 'outline'}
              onClick={() => setActiveSubTab('expired')}
              size="sm"
              className={`transition-all duration-300 text-sm ${activeSubTab === 'expired' ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500" : "theme-text-secondary hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800"}`}
            >
              Expired
            </Button>
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
                <div className="theme-card rounded-2xl shadow-lg theme-border overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* Thumbnail/Thumbnail */}
                  {paper.thumbnailUrl ? (
                    <img
                      src={getFileUrl(paper.thumbnailUrl, 'paper-thumbnail')}
                      alt={paper.title}
                      className="w-full h-48 object-cover border-b theme-border"
                    />
                  ) : (
                    <div className={`w-full h-48 bg-gradient-to-br ${paper.paperType === 'Structure-Essay' ? 'from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900' : 'from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900'} flex items-center justify-center border-b theme-border`}>
                      <FileText size={64} className="theme-text-tertiary" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Header with Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-10 h-10 bg-gradient-to-r ${paper.paperType === 'Structure-Essay' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-indigo-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="text-white" size={20} />
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${paper.paperType === 'Structure-Essay' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'}`}>
                            {paper.paperType}
                          </span>
                        </div>
                        <h3 className="font-bold theme-text-primary text-lg leading-tight line-clamp-2">
                          {paper.title}
                        </h3>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        {isExpired(paper.deadline) ? (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs font-medium rounded-full whitespace-nowrap">
                            Expired
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-medium rounded-full whitespace-nowrap">
                            Available
                          </span>
                        )}
                      </div>
                    </div>

                    {paper.description && (
                      <p className="theme-text-secondary text-sm mb-4 line-clamp-2 flex-grow">
                        {paper.description}
                      </p>
                    )}

                    {/* Paper Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 theme-text-secondary text-sm">
                        <FileText size={16} className="text-blue-500" />
                        <span>{paper.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 theme-text-secondary text-sm">
                        <Timer size={16} className="text-green-500" />
                        <span>{paper.timeLimit} min</span>
                      </div>
                      <div className="flex items-center gap-2 theme-text-secondary text-sm col-span-2">
                        <Calendar size={16} className="text-orange-500" />
                        <span>Due: {new Date(paper.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {paper.isCompleted ? (
                        <Link href={`/student/papers/${paper._id}/results`} className="w-full">
                          <Button
                            className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                          >
                            <Trophy size={16} className="mr-2" />
                            See Answer
                          </Button>
                        </Link>
                      ) : isExpired(paper.deadline) ? (
                        <Button variant="outline" disabled className="w-full bg-black text-white">
                          Expired
                        </Button>
                      ) : paper.paperType === 'Structure-Essay' ? (
                        <Link href={`/student/papers/structure-essay/${paper._id}`} className="w-full">
                          <Button
                            className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                          >
                            <Eye size={16} className="mr-2" />
                            View Paper
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/student/papers/${paper._id}`} className="w-full">
                          <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                          >
                            <Play size={16} className="mr-2" />
                            Start Exam
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout >
  );
}