"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { CoursePackageForm } from "@/components/teacher/CoursePackageForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCoursePackages } from "@/modules/teacher/hooks/useCoursePackages";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { CoursePackageService } from "@/modules/teacher/services/CoursePackageService";
import { toast } from "sonner";
import { CoursePackageCard } from "@/components/teacher/CoursePackageCard";
import axios, { AxiosError } from "axios";

export default function TeacherCoursePackagesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CoursePackageData | undefined>(undefined);
  const { coursePackages, isLoading, error, refetch } = useCoursePackages();

  const handleFormSuccess = () => {
    toast.success(editingPackage ? "Course package updated successfully!" : "Course package created successfully!");
    setIsFormOpen(false);
    setEditingPackage(undefined);
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
            <Button onClick={() => { setEditingPackage(undefined); setIsFormOpen(true); }} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="theme-card w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Course Package" : "Create New Course Package"}</DialogTitle>
            </DialogHeader>
            <CoursePackageForm
              initialData={editingPackage}
              onSuccess={handleFormSuccess}
              onCancel={() => { setIsFormOpen(false); setEditingPackage(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <p className="theme-text-secondary mb-6">Manage your bundled video and paper packages here. Students can purchase these as a single unit.</p>

      {coursePackages.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">No Course Packages Yet</h2>
          <p className="theme-text-secondary mb-4">Click &quot;Create New Package&quot; to get started.</p>
          <Button onClick={() => { setEditingPackage(undefined); setIsFormOpen(true); }} className="bg-brand-primary hover:bg-brand-primary-dark text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Create First Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursePackages.map((pkg) => (
            <CoursePackageCard
              key={pkg._id}
              pkg={pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}