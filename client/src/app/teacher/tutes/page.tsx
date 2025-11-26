"use client";

import { Suspense, useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit, Trash2, FileText, Presentation, Search, School, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { motion } from "framer-motion";
import { toast } from "sonner";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { GridSkeleton } from "@/components/teacher/skeletons/GridSkeleton";
import { ClientLayoutProvider } from "@/components/common/ClientLayoutProvider";

interface Tute {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'pptx' | 'ppt' | 'image';
  previewImageUrl?: string;
  availability: 'all' | 'physical';
  price: number;
  createdAt: string;
  institute?: {
    _id: string;
    name: string;
    location: string;
  };
  year?: {
    _id: string;
    year: number;
    name: string;
  };
  academicLevel?: string;
}

function TutesPageContent() {
  const router = useRouter();
  const [tutes, setTutes] = useState<Tute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useInstitutesAndYears();
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");
  const [floatingElementStyles, setFloatingElementStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const elements = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 4}s`,
    }));
    setFloatingElementStyles(elements);
  }, []);

  useEffect(() => {
    fetchTutes();
  }, [selectedInstitute, selectedYear, selectedAcademicLevel, searchQuery]);

  const fetchTutes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const params = new URLSearchParams();
      if (selectedInstitute !== "all") params.append('institute', selectedInstitute);
      if (selectedYear !== "all") params.append('year', selectedYear);
      if (selectedAcademicLevel !== "all") params.append('academicLevel', selectedAcademicLevel);
      if (searchQuery) params.append('search', searchQuery);

      const url = `${API_URL}/tutes/teacher?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTutes(response.data);
    } catch (error) {
      console.error('Error fetching tutes:', error);
      toast.error('Failed to load tutes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tute?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/tutes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Tute deleted successfully');
      fetchTutes();
    } catch (error) {
      console.error('Error deleting tute:', error);
      toast.error('Failed to delete tute');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FileText className="text-red-500" size={24} />;
    if (fileType === 'image') return <BookOpen className="text-blue-500" size={24} />; // Using BookOpen for image as a placeholder
    return <Presentation className="text-orange-500" size={24} />; // For ppt/pptx
  };

  const filteredTutes = tutes.filter(tute =>
    tute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tute.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TeacherLayout>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        {/* Floating Elements */}
        {floatingElementStyles.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={style}
          />
        ))}
      </div>
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 sidebar-icon sidebar-icon-tutes">
                <BookOpen className="w-6 h-6" />
              </div>
              My Tutes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {tutes.length} tute{tutes.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          <Button
            onClick={() => router.push('/teacher/tutes/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Tute
          </Button>
        </div>

        {/* Search Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sidebar-icon sidebar-icon-tutes">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tutes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tutes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Institutes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {[...new Set(tutes.filter(t => t.institute).map(t => t.institute!._id))].length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Academic Years</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {[...new Set(tutes.filter(t => t.year).map(t => t.year!._id))].length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <GridSkeleton />
        ) : filteredTutes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700"
          >
            <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Tutes Yet</h3>
            <p className="text-muted-foreground mb-6">Start by creating your first tutorial</p>
            <Button
              onClick={() => router.push('/teacher/tutes/create')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus size={20} className="mr-2" />
              Create First Tute
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutes.map((tute, index) => (
              <motion.div
                key={tute._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {tute.previewImageUrl ? (
                  <img
                    src={`${API_BASE_URL}${tute.previewImageUrl}`}
                    alt={tute.title}
                    className="w-full h-48 object-cover border-b border-border"
                  />
                ) : tute.fileType === 'image' && tute.fileUrl ? (
                  <img
                    src={`${API_BASE_URL}${tute.fileUrl}`}
                    alt={tute.title}
                    className="w-full h-48 object-cover border-b border-border"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center border-b border-border">
                    {getFileIcon(tute.fileType)}
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2">
                      {tute.title}
                    </h3>
                  </div>

                  {tute.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {tute.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                    {tute.institute && (
                      <div className="flex items-center gap-1">
                        <School className="w-3 h-3 text-purple-500" />
                        <span>{tute.institute.name}</span>
                      </div>
                    )}
                    {tute.year && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-blue-500" />
                        <span>{tute.year.name}</span>
                      </div>
                    )}
                    {tute.academicLevel && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-green-500" />
                        <span className="font-medium">{tute.academicLevel === 'OL' ? 'O/L' : 'A/L'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${tute.availability === 'all'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                        {tute.availability === 'all' ? 'All Students' : 'Physical Only'}
                      </span>
                      {tute.price > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                          LKR {tute.price}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground uppercase">
                      {tute.fileType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teacher/tutes/${tute._id}/edit`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tute._id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) translateX(-10px) rotate(240deg);
          }
        }
      `}</style>
    </TeacherLayout>
  );
}

export default function TutesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientLayoutProvider>
                <TutesPageContent />
            </ClientLayoutProvider>
        </Suspense>
    )
}

// single default export (kept the ClientLayoutProvider wrapper above)
