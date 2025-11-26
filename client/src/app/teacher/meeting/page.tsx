"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Video, Trash2, Edit, Plus, Search, School, GraduationCap, Youtube } from "lucide-react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { MeetingForm } from "@/components/teacher/MeetingForm";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { Button } from "@/components/ui/button";
import { useTeacherZoom } from "@/modules/teacher/hooks/useTeacherZoom";
import { ZoomService } from "@/modules/shared/services/ZoomService";
import { ZoomLinkData } from '@/modules/shared/types/zoom.types';
import { isAxiosError } from '@/lib/utils/error';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { motion } from "framer-motion";

export default function TeacherZoomPage() {
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useInstitutesAndYears();
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { zoomLinks, isLoading, error, refetch } = useTeacherZoom(selectedInstitute, selectedYear, selectedAcademicLevel);
  const [editingZoomLink, setEditingZoomLink] = useState<ZoomLinkData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDeleteInitiate = (id: string) => {
    setLinkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await ZoomService.deleteZoomLink(linkToDelete);
      refetch();
      toast.success("Meeting link deleted successfully");
      if (editingZoomLink?._id === linkToDelete) {
        setEditingZoomLink(null);
        setIsFormOpen(false);
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to delete Meeting link";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  const handleEdit = (link: ZoomLinkData) => {
    setEditingZoomLink(link);
    setIsFormOpen(true);
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingZoomLink(null);
    setIsFormOpen(false);
    toast.success(editingZoomLink ? "Meeting link updated" : "Meeting link created");
  };

  const handleFormCancel = () => {
    setEditingZoomLink(null);
    setIsFormOpen(false);
  };

  const filteredLinks = zoomLinks.filter(link =>
    (link.meeting?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.meeting?.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingComponent />;
    }

    if (error) {
      return <ErrorComponent message={error} onRetry={refetch} />;
    }

    if (filteredLinks.length === 0) {
      return (
        <EmptyStateComponent
          Icon={Video}
          title={searchQuery ? "No matching links found" : "No Zoom links yet"}
          description={
            searchQuery
              ? "Try a different search term"
              : "Add your first Zoom link to get started"
          }
          action={
            !searchQuery && !isFormOpen
              ? {
                label: "Add Meeting Link",
                onClick: () => setIsFormOpen(true),
                Icon: Plus,
              }
              : undefined
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((link, index) => (
          <motion.div
            key={link._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Video className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {link.meeting?.title}
              </h3>

              {link.meeting?.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                  {link.meeting.description}
                </p>
              )}

              <div className="space-y-3 mb-4">
                <a
                  href={link.meeting?.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg"
                >
                  <Video className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Join Meeting</span>
                </a>

                {link.meeting?.youtubeLink && (
                  <a
                    href={link.meeting.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline truncate bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                  >
                    <Youtube className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Watch Recording</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                {link.institute && (
                  <div className="flex items-center gap-1">
                    <School className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{link.institute.name}</span>
                  </div>
                )}
                {link.year && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>{link.year.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(link)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteInitiate(link._id)}
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
    );
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 sidebar-icon sidebar-icon-videos">
                <Video className="w-6 h-6" />
              </div>
              Meeting Links
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {zoomLinks.length} meeting link{zoomLinks.length !== 1 ? "s" : ""} created
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Meeting Link
            </button>
          )}
        </div>

        {/* Form Section */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              {editingZoomLink ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingZoomLink ? "Edit Meeting Link" : "Add New Meeting Link"}
            </h2>
            <MeetingForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              initialData={editingZoomLink || undefined}
            />
          </motion.div>
        )}

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search meeting links..."
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
              <div className="w-12 h-12 sidebar-icon sidebar-icon-videos">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Links</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{zoomLinks.length}</p>
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
                  {[...new Set(zoomLinks.filter(l => l.institute).map(l => l.institute!._id))].length}
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
                  {[...new Set(zoomLinks.filter(l => l.year).map(l => l.year!._id))].length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
