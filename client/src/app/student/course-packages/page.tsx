"use client";

import { StudentLayout } from "@/components/student/StudentLayout";
import { useStudentCoursePackages } from "@/modules/student/hooks/useStudentCoursePackages";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import CommonFilter from "@/components/common/CommonFilter";
import { StudentGridSkeleton } from "@/components/student/skeletons/StudentGridSkeleton";
import { useStudentFilters } from "@/modules/student/hooks/useStudentFilters";
import { useState } from "react";

export default function StudentCoursePackagesPage() {
  const { coursePackages, isLoading, error, refetch } = useStudentCoursePackages();
  const router = useRouter();

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("all");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useStudentFilters();



  if (isLoading) {
    return (
      <StudentLayout>
        <StudentGridSkeleton />
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="text-red-500 text-center py-8">Error loading course packages: {error}</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <h1 className="text-3xl font-bold theme-text-primary mb-6">Available Course Packages</h1>
      <p className="theme-text-secondary mb-6">Explore and enroll in bundled video and paper packages to enhance your learning journey.</p>

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

      {coursePackages.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">No Course Packages Available</h2>
          <p className="theme-text-secondary mb-4">Check back later for new learning bundles!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePackages.map((pkg) => {
            const defaultBackground = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80";
            const backgroundImage = pkg.backgroundImage ? `${API_BASE_URL}/${pkg.backgroundImage}` : defaultBackground;

            return (
              <div key={pkg._id} className="theme-card flex flex-col justify-between overflow-hidden rounded-lg shadow-md">
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={backgroundImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover object-top-left"
                    style={{ objectPosition: 'left top' }}
                  />
                  <div className="absolute inset-0 bg-black/30"></div> {/* Optional overlay */}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold theme-text-primary mb-2">{pkg.title}</h3>
                    {/* Limited Description */}
                    <p className="theme-text-secondary text-sm mb-3 line-clamp-2">{pkg.description || "No description provided."}</p>

                    {/* Price and Availability on one line */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-3">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">LKR {pkg.price.toFixed(2)}</span>
                      {pkg.availability === "all" ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">Free for All</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">Free for Physical</span>
                      )}
                    </div>

                    {/* Institute & Year */}
                    <div className="text-sm theme-text-secondary mb-3">
                      {typeof pkg.institute === 'object' && pkg.institute.name &&
                        typeof pkg.year === 'object' && pkg.year.name ? (
                        <span>For {pkg.institute.name} - {pkg.year.name}</span>
                      ) : (
                        <span>General Package</span>
                      )}
                    </div>

                    {/* Includes on one line */}
                    <div className="text-sm font-medium theme-text-primary mb-4">
                      Includes: <span className="text-blue-300">{pkg.videos.length} Videos</span>, <span className="text-orange-300">{pkg.papers.length} Papers</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white" onClick={() => router.push(`/student/course-packages/${pkg._id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}