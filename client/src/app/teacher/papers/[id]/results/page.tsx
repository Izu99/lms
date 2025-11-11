"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { FileText, ArrowLeft, Users, Trophy, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface StudentResult {
  _id: string;
  studentId: { // Changed from 'student' to 'studentId'
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
  };
  score: number;
  totalQuestions: number;
  submittedAt: string;
}

export default function PaperResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [paperTitle, setPaperTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [params.id]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch paper details
      const paperResponse = await axios.get(`${API_URL}/papers/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaperTitle(paperResponse.data.paper?.title || "Paper Results");

      // Fetch results
      const resultsResponse = await axios.get(`${API_URL}/papers/${params.id}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(resultsResponse.data.results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const scores = results.map((r) => (r.score / r.totalQuestions) * 100);
    return {
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  };

  const stats = calculateStats();

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/teacher/papers")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 sidebar-icon sidebar-icon-papers">
                <FileText className="w-6 h-6" />
              </div>
              {paperTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {results.length} student{results.length !== 1 ? "s" : ""} submitted
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.average.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Highest Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highest.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white transform rotate-180" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lowest Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lowest.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Results Table */}
        {!loading && results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results
                    .sort((a, b) => b.score - a.score)
                    .map((result, index) => {
                      const percentage = (result.score / result.totalQuestions) * 100;
                      return (
                        <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 && (
                                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                #{index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.studentId
                                ? (result.studentId.firstName && result.studentId.lastName
                                  ? `${result.studentId.firstName} ${result.studentId.lastName}`
                                  : result.studentId.username)
                                : "Unknown Student"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {result.score} / {result.totalQuestions}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                percentage >= 75
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : percentage >= 50
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              }`}
                            >
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(result.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Students haven&apos;t submitted this paper yet
            </p>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
