"use client";

import { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Presentation, Search } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import CommonFilter from "@/components/common/CommonFilter";
import { StudentGridSkeleton } from "@/components/student/skeletons/StudentGridSkeleton";
import { useStudentFilters } from "@/modules/student/hooks/useStudentFilters";
import { PayHereButton } from "@/components/payment/PayHereButton";

interface Tute {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  thumbnailUrl?: string;
  uploadedBy: {
    username: string;
  };
  availability: 'all' | 'physical';
  price: number;
  teacherId?: {
    firstName: string;
    lastName: string;
  };
  hasAccess: boolean;
  createdAt: string;
}

export default function StudentTutesPage() {
  const [tutes, setTutes] = useState<Tute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("all");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useStudentFilters();

  useEffect(() => {
    fetchTutes();
  }, []);

  const fetchTutes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tutes/student/all`, {
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

  const handleDownload = (fileUrl: string, title: string) => {
    const fullUrl = getFileUrl(fileUrl, 'image'); // image type handles generic /uploads prefix
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FileText className="text-red-500" size={32} />;
    return <Presentation className="text-orange-500" size={32} />;
  };

  const filteredTutes = tutes.filter(tute => {
    const matchesSearch = tute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tute.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <StudentLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Tutes</h1>
            <p className="text-muted-foreground text-lg">Download tutorial files (PDF & PowerPoint)</p>
          </div>
        </div>

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
        <div className="theme-bg-primary rounded-xl shadow-md theme-border p-4 mb-8">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 theme-text-tertiary" />
            <input
              type="text"
              placeholder="Search tutes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent theme-text-primary placeholder:theme-text-tertiary"
            />
          </div>
        </div>

        {/* Tutes List */}
        {loading ? (
          <StudentGridSkeleton />
        ) : filteredTutes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-card rounded-3xl border border-border"
          >
            <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Tutes Available</h3>
            <p className="text-muted-foreground">Check back later for new tutorials</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutes.map((tute, index) => (
              <motion.div
                key={tute._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="theme-bg-primary rounded-2xl theme-border overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Thumbnail/Thumbnail */}
                {tute.thumbnailUrl ? (
                  <img
                    src={getFileUrl(tute.thumbnailUrl, 'image')}
                    alt={tute.title}
                    className="w-full h-48 object-cover border-b theme-border"
                  />
                ) : tute.fileType === 'image' && tute.fileUrl ? (
                  <img
                    src={getFileUrl(tute.fileUrl, 'image')}
                    alt={tute.title}
                    className="w-full h-48 object-cover border-b theme-border"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 flex items-center justify-center border-b theme-border">
                    {getFileIcon(tute.fileType)}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs text-muted-foreground uppercase font-medium px-3 py-1 bg-muted rounded-full">
                      {tute.fileType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {tute.title}
                  </h3>

                  {tute.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {tute.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <span>By {tute.teacherId ? `${tute.teacherId.firstName} ${tute.teacherId.lastName}` : (tute.uploadedBy?.username || "Unknown Teacher")}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      {tute.price > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                          LKR {tute.price}
                        </span>
                      )}
                      {tute.price === 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  {tute.hasAccess ? (
                    <Button
                      onClick={() => handleDownload(tute.fileUrl, tute.title)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  ) : (
                    <PayHereButton
                      itemId={tute._id}
                      itemModel="Tute"
                      amount={tute.price}
                      title={tute.title}
                      className="h-9 px-3 text-xs"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
