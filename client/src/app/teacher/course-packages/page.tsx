"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { CoursePackageForm } from "@/components/teacher/CoursePackageForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCoursePackages } from "@/modules/teacher/hooks/useCoursePackages";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { toast } from "sonner";

export default function TeacherCoursePackagesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CoursePackageData | null>(null);
  const { coursePackages, isLoading, error, refetch } = useCoursePackages();

  const handleFormSuccess = () => {
    toast.success(editingPackage ? "Course package updated successfully!" : "Course package created successfully!");
    setIsFormOpen(false);
    setEditingPackage(null);
    refetch();
  };

  const handleEdit = (pkg: CoursePackageData) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course package? This action cannot be undone.")) {
      return;
    }
    // Implement delete logic using a service
    // await CoursePackageService.deleteCoursePackage(id);
    toast.success("Course package deleted successfully (mock)"); // Replace with actual delete
    refetch();
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="text-red-500 text-center py-8">Error loading course packages: {error}</div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold theme-text-primary">Course Packages</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPackage(null); setIsFormOpen(true); }} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Course Package" : "Create New Course Package"}</DialogTitle>
            </DialogHeader>
            <CoursePackageForm
              initialData={editingPackage}
              onSuccess={handleFormSuccess}
              onCancel={() => { setIsFormOpen(false); setEditingPackage(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <p className="theme-text-secondary mb-6">Manage your bundled video and paper packages here. Students can purchase these as a single unit.</p>

      {coursePackages.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">No Course Packages Yet</h2>
          <p className="theme-text-secondary mb-4">Click "Create New Package" to get started.</p>
          <Button onClick={() => { setEditingPackage(null); setIsFormOpen(true); }} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Create First Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePackages.map((pkg) => (
            <div key={pkg._id} className="theme-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold theme-text-primary mb-2">{pkg.title}</h3>
                <p className="theme-text-secondary text-sm mb-4">{pkg.description || "No description provided."}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold theme-text-primary">LKR {pkg.price.toFixed(2)}</span>
                  {pkg.freeForAllInstituteYear && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">Free for All</span>
                  )}
                  {!pkg.freeForAllInstituteYear && pkg.freeForPhysicalStudents && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">Free for Physical</span>
                  )}
                </div>
                <div className="text-sm theme-text-secondary mb-2">
                  {pkg.institute && pkg.year ? (
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
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}
