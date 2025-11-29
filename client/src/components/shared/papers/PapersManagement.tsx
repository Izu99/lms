/**
 * SHARED PAPER MANAGEMENT COMPONENT
 * 
 * This component is used by BOTH:
 * - Teachers (/teacher/papers)
 * - Paper Managers (/paper-manager/papers)
 * 
 * Any changes here will automatically affect both roles.
 * This ensures consistency and reduces code duplication.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Search,
    Users,
    TrendingUp,
    Calendar,
    Eye,
    School,
    GraduationCap,
} from "lucide-react";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
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
import { Pagination } from "@/components/ui/pagination";
import { TeacherPaperService } from "@/modules/teacher/services/PaperService";
import { PaperData } from "@/modules/teacher/types/paper.types";
import { isAxiosError } from "@/lib/utils/error";
import { useTeacherPapers } from "@/modules/teacher/hooks/useTeacherPapers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { API_BASE_URL } from "@/lib/constants";
import { GridSkeleton } from "@/components/teacher/skeletons/GridSkeleton";

// Paper Card Component - Reusable
const PaperCard = ({
    paper,
    index,
    onEdit,
    onDelete,
    onViewResults,
    deleteLoading,
    formatDate,
}: {
    paper: PaperData;
    index: number;
    onEdit: (paper: PaperData) => void;
    onDelete: (id: string) => void;
    onViewResults: (id: string) => void;
    deleteLoading: string | null;
    formatDate: (dateString: string | Date) => string;
}) => (
    <div
        key={paper._id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        style={{
            animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
        }}
    >
        <div
            onClick={() => onViewResults(paper._id)}
            className="relative w-full h-48 bg-gradient-to-br from-purple-700 to-purple-900 cursor-pointer group overflow-hidden flex items-center justify-center"
        >
            {paper.thumbnailUrl ? (
                <img
                    src={`${API_BASE_URL}${paper.thumbnailUrl}`}
                    alt={paper.title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <FileText className="w-24 h-24 text-white/50 group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100">
                    <Eye className="w-8 h-8 text-white" />
                </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                View Paper
            </div>
            {paper.submissionCount !== undefined && paper.submissionCount > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {paper.submissionCount}
                </div>
            )}
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {paper.title}
            </h3>
            {paper.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                    {paper.description}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {paper.questions?.length || 0} questions
                </span>
                <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Avg: {paper.averageScore?.toFixed(1) || 0}%
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {paper.deadline && formatDate(paper.deadline)}
                </span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewResults(paper._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium"
                    title="View Results"
                >
                    <TrendingUp className="w-4 h-4" />
                    Results
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(paper);
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
                        onDelete(paper._id);
                    }}
                    disabled={deleteLoading === paper._id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    title="Delete"
                >
                    {deleteLoading === paper._id ? (
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

interface PapersManagementProps {
    /**
     * Base path for navigation
     * - For teachers: "/teacher"
     * - For paper managers: "/paper-manager"
     */
    basePath: string;
}

export function PapersManagement({ basePath }: PapersManagementProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [paperToDelete, setPaperToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const papersPerPage = 10;
    const [activeTab, setActiveTab] = useState("all-papers");
    const {
        institutes,
        years,
        academicLevels,
        isLoadingInstitutes,
        isLoadingYears,
        isLoadingAcademicLevels,
    } = useInstitutesAndYears();
    const [selectedInstitute, setSelectedInstitute] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");

    const router = useRouter();

    const { papers, isLoading, error, refetch } = useTeacherPapers(
        selectedInstitute,
        selectedYear,
        selectedAcademicLevel
    );

    const filteredPapers = papers.filter(
        (paper) =>
            paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mcqPapers = filteredPapers.filter((paper) => paper.paperType === "MCQ");

    const structurePapers = filteredPapers.filter(
        (paper) => paper.paperType === "Structure-Essay"
    );

    const displayPapers =
        activeTab === "mcq"
            ? mcqPapers
            : activeTab === "structure-essay"
                ? structurePapers
                : filteredPapers;

    const totalPages = Math.ceil(displayPapers.length / papersPerPage);
    const startIndex = (currentPage - 1) * papersPerPage;
    const endIndex = startIndex + papersPerPage;
    const paginatedPapers = displayPapers.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab, selectedInstitute, selectedYear]);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleDelete = (id: string) => {
        setPaperToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!paperToDelete) return;

        try {
            setDeleteLoading(paperToDelete);
            await TeacherPaperService.deletePaper(paperToDelete);
            refetch();
            toast.success("Paper deleted successfully");
        } catch (error: unknown) {
            console.error("Error deleting paper:", error);
            let errorMessage = "Failed to delete paper. Please try again.";
            if (isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(null);
            setDeleteDialogOpen(false);
            setPaperToDelete(null);
        }
    };

    const handleEdit = (paper: PaperData) => {
        router.push(`${basePath}/papers/${paper._id}/edit`);
    };

    const handleViewResults = (paperId: string) => {
        router.push(`${basePath}/papers/${paperId}/results`);
    };

    const renderPaperList = (papersToRender: PaperData[], emptyMessage: string) => {
        if (isLoading) {
            return <GridSkeleton />;
        }

        if (error) {
            return <ErrorComponent message={error} onRetry={refetch} />;
        }

        if (papersToRender.length === 0) {
            return (
                <EmptyStateComponent
                    Icon={FileText}
                    title={searchQuery ? "No papers found" : emptyMessage}
                    description={
                        searchQuery
                            ? "Try a different search term"
                            : "Create your first exam paper to get started"
                    }
                    action={
                        !searchQuery
                            ? {
                                label: "Create Paper",
                                onClick: () => router.push(`${basePath}/papers/create`),
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
                            <div className="w-12 h-12 sidebar-icon sidebar-icon-papers">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Papers
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {papers.length}
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
                                                papers
                                                    .filter((p) => p.institute)
                                                    .map((p) => p.institute!._id)
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
                                                papers.filter((p) => p.year).map((p) => p.year!._id)
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
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Submissions
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {papers.reduce((sum, p) => sum + (p.submissionCount || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papersToRender.slice(startIndex, endIndex).map((paper, index) => (
                        <PaperCard
                            key={paper._id}
                            paper={paper}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewResults={handleViewResults}
                            deleteLoading={deleteLoading}
                            formatDate={formatDate}
                        />
                    ))}
                </div>

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
                    onClick={() => router.push(`${basePath}/papers/create`)}
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

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all-papers">All Papers</TabsTrigger>
                    <TabsTrigger value="mcq">MCQ</TabsTrigger>
                    <TabsTrigger value="structure-essay">Structure and Essay</TabsTrigger>
                </TabsList>
                <TabsContent value="all-papers">
                    {renderPaperList(filteredPapers, "No papers yet")}
                </TabsContent>
                <TabsContent value="mcq">
                    {renderPaperList(mcqPapers, "No MCQ papers found.")}
                </TabsContent>
                <TabsContent value="structure-essay">
                    {renderPaperList(structurePapers, "No Structure and Essay papers found.")}
                </TabsContent>
            </Tabs>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the paper
                            and all associated student submissions.
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
