"use client";
import { useState, useEffect } from "react";
import InstituteYearForm from "@/components/InstituteYearForm";
import YearForm from "@/components/YearForm";
import {
  Plus,
  Edit,
  Trash2,
  School,
  Calendar,
  Settings,
  MapPin,
  Users,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherInstitutes } from "@/modules/teacher/hooks/useTeacherInstitutes";
import { useTeacherYears } from "@/modules/teacher/hooks/useTeacherYears";
import { InstituteData } from "@/modules/teacher/types/institute.types";
import { YearData } from "@/modules/teacher/types/year.types";
import { TeacherInstituteService } from "@/modules/teacher/services/InstituteService";
import { TeacherYearService } from "@/modules/teacher/services/YearService";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { toast } from "sonner";
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

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [showInstituteForm, setShowInstituteForm] = useState(false);
  const [showYearForm, setShowYearForm] = useState(false);
  const [editingInstitute, setEditingInstitute] = useState<InstituteData | null>(null);
  const [editingYear, setEditingYear] = useState<YearData | null>(null);

  // Delete dialog states
  const [deleteInstituteDialogOpen, setDeleteInstituteDialogOpen] = useState(false);
  const [instituteToDelete, setInstituteToDelete] = useState<string | null>(null);
  const [deleteYearDialogOpen, setDeleteYearDialogOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<string | null>(null);

  const { institutes, isLoading: isLoadingInstitutes, error: errorInstitutes, refetch: refetchInstitutes } = useTeacherInstitutes();
  const { years, isLoading: isLoadingYears, error: errorYears, refetch: refetchYears } = useTeacherYears();

  // Institute operations
  const handleSaveInstitute = async (instituteData: { name: string; location: string }) => {
    try {
      if (editingInstitute) {
        await TeacherInstituteService.updateInstitute(editingInstitute._id, instituteData);
      } else {
        await TeacherInstituteService.createInstitute(instituteData);
      }
      
      refetchInstitutes();
      setShowInstituteForm(false);
      setEditingInstitute(null);
      toast.success("Institute saved successfully");
    } catch (error: any) {
      console.error("Error saving institute:", error);
      toast.error(error.response?.data?.message || "Error saving institute. Please try again.");
    }
  };

  const handleDeleteInstitute = (id: string) => {
    setInstituteToDelete(id);
    setDeleteInstituteDialogOpen(true);
  };

  const confirmDeleteInstitute = async () => {
    if (!instituteToDelete) return;
    try {
      await TeacherInstituteService.deleteInstitute(instituteToDelete);
      refetchInstitutes();
      toast.success("Institute deleted successfully");
    } catch (error: any) {
      console.error("Error deleting institute:", error);
      toast.error(error.response?.data?.message || "Error deleting institute. Please try again.");
    } finally {
      setDeleteInstituteDialogOpen(false);
      setInstituteToDelete(null);
    }
  };

  // Year operations
  const handleSaveYear = async (yearData: { year: string; name: string }) => {
    try {
      if (editingYear) {
        await TeacherYearService.updateYear(editingYear._id, yearData);
      } else {
        await TeacherYearService.createYear(yearData);
      }
      
      refetchYears();
      setShowYearForm(false);
      setEditingYear(null);
      toast.success("Academic year saved successfully");
    } catch (error: any) {
      console.error("Error saving year:", error);
      toast.error(error.response?.data?.message || "Error saving year. Please try again.");
    }
  };

  const handleDeleteYear = (id: string) => {
    setYearToDelete(id);
    setDeleteYearDialogOpen(true);
  };

  const confirmDeleteYear = async () => {
    if (!yearToDelete) return;
    try {
      await TeacherYearService.deleteYear(yearToDelete);
      refetchYears();
      toast.success("Academic year deleted successfully");
    } catch (error: any) {
      console.error("Error deleting year:", error);
      toast.error(error.response?.data?.message || "Error deleting year. Please try again.");
    } finally {
      setDeleteYearDialogOpen(false);
      setYearToDelete(null);
    }
  };

  const openInstituteForm = (instituteData?: InstituteData) => {
    setEditingInstitute(instituteData || null);
    setShowInstituteForm(true);
  };

  const openYearForm = (yearData?: YearData) => {
    setEditingYear(yearData || null);
    setShowYearForm(true);
  };

  const filteredInstitutes = institutes.filter(instituteItem => 
    instituteItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instituteItem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredYears = years.filter(yearItem =>
    yearItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yearItem.year.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderInstitutesContent = () => {
    if (isLoadingInstitutes) {
      return <LoadingComponent />;
    }

    if (errorInstitutes) {
      return <ErrorComponent message={errorInstitutes} onRetry={refetchInstitutes} />;
    }

    if (filteredInstitutes.length === 0) {
      return (
        <EmptyStateComponent
          Icon={School}
          title="No institutes found"
          description="Create your first institute to get started"
          action={{
            label: "Add Institute",
            onClick: () => openInstituteForm(),
            Icon: Plus,
          }}
        />
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
        {filteredInstitutes.map((instituteItem) => (
          <div key={instituteItem._id} className="flex items-center justify-between p-4 border border-[var(--theme-border)] rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--theme-text-primary)]">{instituteItem.name}</h3>
                <div className="flex items-center gap-1 text-sm text-[var(--theme-text-tertiary)]">
                  <MapPin size={14} />
                  <span>{instituteItem.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openInstituteForm(instituteItem)}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteInstitute(instituteItem._id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderYearsContent = () => {
    if (isLoadingYears) {
      return <LoadingComponent />;
    }

    if (errorYears) {
      return <ErrorComponent message={errorYears} onRetry={refetchYears} />;
    }

    if (filteredYears.length === 0) {
      return (
        <EmptyStateComponent
          Icon={Calendar}
          title="No years found"
          description="Add academic years for your program"
          action={{
            label: "Add Year",
            onClick: () => openYearForm(),
            Icon: Plus,
          }}
        />
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
        {filteredYears.map((yearItem) => (
          <div key={yearItem._id} className="flex items-center justify-between p-4 border border-[var(--theme-border)] rounded-lg hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--theme-text-primary)]">{yearItem.name}</h3>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Academic Year {yearItem.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openYearForm(yearItem)}
                className="hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteYear(yearItem._id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <TeacherLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Settings className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--theme-text-primary)]">Institute & Year Management</h1>
              <p className="text-[var(--theme-text-secondary)]">Manage institutes, years, and academic settings for your ICT program</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-4">
            <div className="relative max-w-md">
              <Input
                placeholder="Search institutes or years..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <School className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Total Institutes</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">{institutes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Academic Years</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">{years.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Locations</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                  {[...new Set(institutes.map(c => c.location))].length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-[var(--theme-text-tertiary)]">A-Level Programs</p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)]">ICT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Institutes Section */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)]">
            <div className="p-6 border-b border-[var(--theme-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <School className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">Institutes</h2>
                    <p className="text-sm text-[var(--theme-text-tertiary)]">Manage institute groups and locations</p>
                  </div>
                </div>
                <Button onClick={() => openInstituteForm()} className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Institute
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {renderInstitutesContent()}
            </div>
          </div>

          {/* Years Section */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)]">
            <div className="p-6 border-b border-[var(--theme-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">Academic Years</h2>
                    <p className="text-sm text-[var(--theme-text-tertiary)]">Manage A-Level year groups</p>
                  </div>
                </div>
                <Button onClick={() => openYearForm()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                  <Plus size={16} />
                  Add Year
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {renderYearsContent()}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-[var(--card-bg)] rounded-lg shadow-sm border border-[var(--theme-border)] p-6">
          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => openInstituteForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="text-blue-600 dark:text-blue-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Add New Institute</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Create a new institute group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => openYearForm()}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Plus className="text-green-600 dark:text-green-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Add Academic Year</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Create a new year group</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/videos"}
              className="flex items-center gap-2 p-4 h-auto border-dashed border-2 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <School className="text-purple-600 dark:text-purple-400" size={20} />
              <div className="text-left">
                <p className="font-medium text-[var(--theme-text-primary)]">Manage Videos</p>
                <p className="text-sm text-[var(--theme-text-tertiary)]">Upload and organize content</p>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {showInstituteForm && (
        <InstituteYearForm
          onSaveInstitute={handleSaveInstitute}
          onSaveYear={handleSaveYear}
          onClose={() => {
            setShowInstituteForm(false);
            setEditingInstitute(null);
            refetchInstitutes(); // Refetch institutes after modal closes
          }}
          instituteData={editingInstitute}
          mode="institute"
        />
      )}

      {showYearForm && (
        <YearForm
          onSave={handleSaveYear}
          onClose={() => {
            setShowYearForm(false);
            setEditingYear(null);
            refetchYears(); // Refetch years after modal closes
          }}
          yearData={editingYear}
        />
      )}

      {/* Institute Delete Confirmation Dialog */}
      <AlertDialog open={deleteInstituteDialogOpen} onOpenChange={setDeleteInstituteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the institute.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInstitute} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Year Delete Confirmation Dialog */}
      <AlertDialog open={deleteYearDialogOpen} onOpenChange={setDeleteYearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the academic year.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteYear} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
