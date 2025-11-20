"use client";

import { StudentLayout } from "@/components/student/StudentLayout";
import { useStudentCoursePackages } from "@/modules/student/hooks/useStudentCoursePackages"; // Will create this hook
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StudentCoursePackagesPage() {
  const { coursePackages, isLoading, error, refetch } = useStudentCoursePackages();
  const router = useRouter();

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
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

      {coursePackages.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">No Course Packages Available</h2>
          <p className="theme-text-secondary mb-4">Check back later for new learning bundles!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePackages.map((pkg) => (
            <div key={pkg._id} className="theme-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold theme-text-primary mb-2">{pkg.title}</h3>
                <p className="theme-text-secondary text-sm mb-4">{pkg.description || "No description provided."}</p>
                <div className="flex items-center gap-2 mb-3">
                  {/* DollarSign icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500 dark:text-gray-400"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">LKR {pkg.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm theme-text-secondary">
                  {pkg.availability === "all" && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">Free for All</span>
                  )}
                  {pkg.availability === "physical" && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">Free for Physical</span>
                  )}
                </div>
                <div className="text-sm theme-text-secondary mb-2">
                  {/* The shared CoursePackageData type has institute/year as populated objects or IDs.
                      For student display, we expect them to be populated if applicable. */}
                  {typeof pkg.institute === 'object' && pkg.institute.name &&
                   typeof pkg.year === 'object' && pkg.year.name ? (
                    <span>For {pkg.institute.name} - {pkg.year.name}</span>
                  ) : (
                    <span>General Package</span>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium theme-text-primary">Includes:</p>
                  <ul className="list-disc list-inside text-sm theme-text-secondary ml-2">
                    <li>{pkg.videos.length} Videos</li>
                    <li>{pkg.papers.length} Papers</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white" onClick={() => router.push(`/student/course-packages/${pkg._id}`)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}