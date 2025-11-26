"use client";

import { useState } from "react";
import { Plus, Search, Package, School, GraduationCap, ShoppingBag } from "lucide-react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { useCoursePackages } from "@/modules/teacher/hooks/useCoursePackages";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { CoursePackageService } from "@/modules/teacher/services/CoursePackageService";
import { toast } from "sonner";
import { CoursePackageCard } from "@/components/teacher/CoursePackageCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { motion } from "framer-motion";
import { GridSkeleton } from "@/components/teacher/skeletons/GridSkeleton";

export default function TeacherCoursePackagesPage() {
  const { coursePackages, isLoading, error, refetch } = useCoursePackages();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useInstitutesAndYears();
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");

  const handleEdit = (pkg: CoursePackageData) => {
    router.push(`/teacher/course-packages/${pkg._id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course package? This action cannot be undone.")) {
      return;
    }

    try {
      await CoursePackageService.deleteCoursePackage(id);
      toast.success("Course package deleted successfully!");
      refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to delete course package";
        toast.error(errorMessage);
        console.error(error);
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  };

  const filteredPackages = coursePackages
    .filter((pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((pkg) =>
      selectedInstitute !== "all" ? (typeof pkg.institute === 'object' && pkg.institute?._id === selectedInstitute) : true
    )
    .filter((pkg) =>
      selectedYear !== "all" ? (typeof pkg.year === 'object' && pkg.year?._id === selectedYear) : true
    )
    .filter((pkg) =>
      // Placeholder filter logic for academic level
      selectedAcademicLevel !== "all" ? (pkg as any).academicLevel === selectedAcademicLevel : true
    );


  // ...

  const renderContent = () => {
    if (isLoading) {
      return <GridSkeleton />;
    }

    if (error) {
      return <ErrorComponent message={error} onRetry={refetch} />;
    }

    if (filteredPackages.length === 0) {
      return (
        <EmptyStateComponent
          Icon={Package}
          title={searchQuery ? "No packages found" : "No Course Packages Yet"}
          description={
            searchQuery
              ? "Try a different search term"
              : "Create your first course package to bundle videos and papers."
          }
          action={
            !searchQuery
              ? {
                label: "Create Package",
                onClick: () => router.push('/teacher/course-packages/create'),
                Icon: Plus,
              }
              : undefined
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg, index) => (
          <motion.div
            key={pkg._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CoursePackageCard
              pkg={pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
              <div className="w-10 h-10 sidebar-icon sidebar-icon-packages">
                <Package className="w-6 h-6" />
              </div>
              Course Packages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {coursePackages.length} package{coursePackages.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <Button
            onClick={() => router.push('/teacher/course-packages/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <Plus className="w-5 h-5" /> Create Package
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search packages..."
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
              <div className="w-12 h-12 sidebar-icon sidebar-icon-packages">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{coursePackages.length}</p>
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
                  {[...new Set(coursePackages.filter(p => p.institute).map(p => (p.institute as any)._id))].length}
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
                  {[...new Set(coursePackages.filter(p => p.year).map(p => (p.year as any)._id))].length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </TeacherLayout>
  );
}