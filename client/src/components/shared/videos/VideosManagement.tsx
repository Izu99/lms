/**
 * SHARED VIDEO MANAGEMENT COMPONENT
 * 
 * This component is used by BOTH:
 * - Teachers (/teacher/videos)
 * - Video Managers (/video-manager/videos)
 * 
 * Any changes here will automatically affect both roles.
 * This ensures consistency and reduces code duplication.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Video, Plus, Search, Eye, Trash2, Edit, School, GraduationCap, Play } from "lucide-react";
import { CreateVideoModal } from "@/components/modals";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import Cookies from "js-cookie";
import { Pagination } from "@/components/ui/pagination";
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
import { useTeacherVideos } from "@/modules/teacher/hooks/useTeacherVideos";
import { VideoData } from "@/modules/shared/types/video.types";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { GridSkeleton } from "@/components/teacher/skeletons/GridSkeleton";

// Video Card Component - Reusable
const VideoCard = ({
    video,
    index,
    onEdit,
    onDelete,
    onView,
    deleteLoading,
}: {
    video: VideoData;
    index: number;
    onEdit: (video: VideoData) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    deleteLoading: string | null;
}) => (
    <div
        key={video._id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        style={{
            animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
        }}
    >
        <div
            onClick={() => onView(video._id)}
            className="relative w-full h-48 bg-gray-900 cursor-pointer group overflow-hidden"
        >
            {video.thumbnailUrl ? (
                <img
                    src={getFileUrl(video.thumbnailUrl, 'video-thumbnail')}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80";
                    }}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gray-800 relative">
                    <img
                        src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
                        alt="Default Video Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <Video size={48} className="relative z-10 mb-2 opacity-50 text-white" />
                    <span className="relative z-10 text-xs text-white">Video Lesson</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100">
                    <Play size={32} className="text-white" />
                </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                Click to watch
            </div>
            {video.views !== undefined && video.views > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                </div>
            )}
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {video.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                {video.description || "No description"}
            </p>

            <div className="flex items-center gap-4 mb-3 flex-wrap">
                {video.institute && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <School className="w-4 h-4 text-purple-500" />
                        <span>
                            {video.institute.name} - {video.institute.location}
                        </span>
                    </div>
                )}
                {video.year && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span>{video.year.name}</span>
                    </div>
                )}
                {video.academicLevel && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4 text-green-500" />
                        <span className="font-medium">
                            {video.academicLevel === "OL" ? "O/L" : "A/L"}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(video);
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
                        onDelete(video._id);
                    }}
                    disabled={deleteLoading === video._id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    title="Delete"
                >
                    {deleteLoading === video._id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
);

interface VideosManagementProps {
    /**
     * Base path for navigation
     * - For teachers: "/teacher"
     * - For video managers: "/video-manager"
     */
    basePath: string;
}

export function VideosManagement({ basePath }: VideosManagementProps) {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 9;
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
    const [selectedInstitute, setSelectedInstitute] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");

    const {
        institutes,
        years,
        academicLevels,
        isLoadingInstitutes,
        isLoadingYears,
        isLoadingAcademicLevels,
    } = useInstitutesAndYears();

    const { videos, isLoading, error, refetch } = useTeacherVideos(
        selectedInstitute,
        selectedYear,
        selectedAcademicLevel
    );

    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedInstitute, selectedYear]);

    const handleDelete = (videoId: string) => {
        setVideoToDelete(videoId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!videoToDelete) return;

        try {
            setDeleteLoading(videoToDelete);
            const token = Cookies.get("token");
            await axios.delete(`${API_URL}/videos/${videoToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            refetch();
            toast.success("Video deleted successfully");
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error("Failed to delete video. Please try again.");
        } finally {
            setDeleteLoading(null);
            setDeleteDialogOpen(false);
            setVideoToDelete(null);
        }
    };

    const handleEdit = (video: VideoData) => {
        setEditingVideo(video);
        setIsCreateModalOpen(true);
    };

    const handleView = (videoId: string) => {
        router.push(`${basePath}/videos/${videoId}`);
    };

    const renderContent = () => {
        if (isLoading) {
            return <GridSkeleton />;
        }

        if (error) {
            return <ErrorComponent message={error} onRetry={refetch} />;
        }

        if (filteredVideos.length === 0) {
            return (
                <EmptyStateComponent
                    Icon={Video}
                    title={
                        searchQuery || selectedInstitute || selectedYear
                            ? "No videos found"
                            : "No videos yet"
                    }
                    description={
                        searchQuery || selectedInstitute || selectedYear
                            ? "Try a different search or filter combination"
                            : "Upload your first video to get started"
                    }
                    action={
                        !searchQuery && !selectedInstitute && !selectedYear
                            ? {
                                label: "Upload Video",
                                onClick: () => setIsCreateModalOpen(true),
                                Icon: Plus,
                            }
                            : undefined
                    }
                />
            );
        }

        return (
            <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 sidebar-icon sidebar-icon-videos">
                                <Video className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Videos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {videos.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                <School className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Institutes
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        [
                                            ...new Set(
                                                videos
                                                    .filter((v) => v.institute)
                                                    .map((v) => v.institute!._id)
                                            ),
                                        ].length
                                    }
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Academic Years
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        [
                                            ...new Set(
                                                videos.filter((v) => v.year).map((v) => v.year!._id)
                                            ),
                                        ].length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Views
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {videos.reduce((sum, v) => sum + (v.views || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedVideos.map((video, index) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                            deleteLoading={deleteLoading}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 sidebar-icon sidebar-icon-videos">
                            <Video className="w-6 h-6" />
                        </div>
                        My Videos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {videos.length} video{videos.length !== 1 ? "s" : ""} uploaded
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Upload Video
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search videos..."
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

            {renderContent()}

            {/* Create/Edit Video Modal */}
            <CreateVideoModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingVideo(null);
                }}
                onSuccess={() => {
                    refetch();
                    setIsCreateModalOpen(false);
                    setEditingVideo(null);
                }}
                video={editingVideo}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the video
                            and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
