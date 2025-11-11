"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { FileText, Plus, Search, Users, TrendingUp, Calendar, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
}

interface PaperData {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  timeLimit?: number;
  questions: Question[];
  submissionCount?: number;
  averageScore?: number;
  createdAt: string;
}

export default function TeacherPapersPage() {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/papers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers(response.data.papers || []);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (paperId: string) => {
    if (!confirm("Are you sure you want to delete this paper? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleteLoading(paperId);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/papers/${paperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers(papers.filter((p) => p._id !== paperId));
    } catch (error) {
      console.error("Error deleting paper:", error);
      alert("Failed to delete paper. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (paper: PaperData) => {
    router.push(`/teacher/papers/${paper._id}/edit`);
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 sidebar-icon sidebar-icon-papers">
                <FileText className="w-6 h-6" />
              </div>
              My Papers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {papers.length} paper{papers.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <button
            onClick={() => router.push('/teacher/papers/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Paper
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPapers.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No papers found" : "No papers yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Create your first exam paper to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/teacher/papers/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Paper
              </button>
            )}
          </div>
        )}

        {/* Papers List */}
        {!loading && filteredPapers.length > 0 && (
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 truncate">
                      {paper.title}
                    </h3>
                    {paper.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {paper.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {paper.questions?.length || 0} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {paper.submissionCount || 0} submissions
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Avg: {paper.averageScore?.toFixed(1) || 0}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(paper.deadline)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(paper)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper._id)}
                      disabled={deleteLoading === paper._id}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteLoading === paper._id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/papers/${paper._id}/results`)}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
