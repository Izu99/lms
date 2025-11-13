"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import {
  FileText,
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  ChevronsDown,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import Cookies from "js-cookie";
import { StudentDetailsModal } from "@/components/teacher/modals/StudentDetailsModal";

interface PaperInfo {
  title: string;
  totalQuestions: number;
  deadline: string;
}

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
  percentage: number;
  submittedAt: string;
  timeSpent: number;
}

interface Stats {
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export default function PaperResultsPage() {
  const router = useRouter();
  const params = useParams();
  const paperId = params.id as string;

  const [paper, setPaper] = useState<PaperInfo | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!paperId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const response = await axios.get(`${API_URL}/papers/${paperId}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaper(response.data.paper);
        setResults(response.data.results);
        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        console.error("Error fetching paper results:", err);
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError("You do not have permission to view these results.");
        } else {
          setError("Failed to load paper results. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [paperId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {paper?.title || "Paper Results"}
              </h1>
              <p className="text-muted-foreground text-lg">
                Performance analysis and student submissions
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="shadow-md"
            onClick={() => router.push("/teacher/papers")}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Papers
          </Button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-6 rounded-lg">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && stats && paper && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-2xl shadow-md border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalSubmissions}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-md border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold text-foreground">{stats.averageScore}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-md border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Award size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Score</p>
                    <p className="text-3xl font-bold text-foreground">{stats.highestScore}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-md border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ChevronsDown size={24} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest Score</p>
                    <p className="text-3xl font-bold text-foreground">{stats.lowestScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-card rounded-2xl shadow-md border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">All Submissions</h2>
                <p className="text-muted-foreground mt-1">
                  Showing {results.length} results sorted by highest score.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 font-semibold text-muted-foreground">Rank</th>
                      <th className="p-4 font-semibold text-muted-foreground">Student</th>
                      <th className="p-4 font-semibold text-muted-foreground">Score</th>
                      <th className="p-4 font-semibold text-muted-foreground">Percentage</th>
                      <th className="p-4 font-semibold text-muted-foreground">Time Spent</th>
                      <th className="p-4 font-semibold text-muted-foreground">Submitted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result._id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium text-foreground">{index + 1}</td>
                        <td className="p-4 font-medium text-foreground">
                          <button
                            onClick={() => {
                              setSelectedStudentId(result.studentId._id);
                              setIsModalOpen(true);
                            }}
                            className="hover:underline"
                          >
                            {result.studentId.firstName || result.studentId.username}
                          </button>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {result.score} / {paper.totalQuestions}
                        </td>
                        <td className={`p-4 font-bold ${getScoreColor(result.percentage)}`}>
                          {result.percentage}%
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {formatTime(result.timeSpent)}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {results.length === 0 && (
                <div className="text-center p-12">
                  <Users size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No submissions yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back after students have attempted the paper.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <StudentDetailsModal
        studentId={selectedStudentId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudentId(null);
        }}
      />
    </TeacherLayout>
  );
}