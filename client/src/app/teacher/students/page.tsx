"use client";

import { Suspense, useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Users, Search, Mail, Phone, Award } from "lucide-react";
import { StudentDetailsModal } from "@/components/teacher/modals/StudentDetailsModal";
import { Pagination } from "@/components/ui/pagination";
import { useTeacherStudents } from "@/modules/teacher/hooks/useTeacherStudents";
import { StudentData } from "@/modules/teacher/types/student.types";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import CommonFilter from "@/components/common/CommonFilter";
import { useInstitutesAndYears } from "@/modules/teacher/hooks/useInstitutesAndYears";
import { TableSkeleton } from "@/components/teacher/skeletons/TableSkeleton";

function TeacherStudentsPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Filter state
  const [selectedInstitute, setSelectedInstitute] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState("all");

  // Hooks
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useInstitutesAndYears();

  const { students, isLoading, error, refetch } = useTeacherStudents();

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      student.username.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  }).filter((student) => {
    // TODO: Add institute, year, and academicLevel filters when StudentData type is updated
    // Apply institute filter
    // if (selectedInstitute !== "all" && student.institute?._id !== selectedInstitute) {
    //   return false;
    // }
    // Apply year filter
    // if (selectedYear !== "all" && student.year?._id !== selectedYear) {
    //   return false;
    // }
    // Apply academic level filter
    // if (selectedAcademicLevel !== "all" && student.academicLevel !== selectedAcademicLevel) {
    //   return false;
    // }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedInstitute, selectedYear, selectedAcademicLevel]);

  const getInitials = (student: StudentData) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
    }
    return student.username.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (student: StudentData) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return student.username;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "inactive":
      case "unpaid":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleViewDetails = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };


  // ...

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (error) {
      return <ErrorComponent message={error} onRetry={refetch} />;
    }

    if (filteredStudents.length === 0) {
      return (
        <EmptyStateComponent
          Icon={Users}
          title={searchQuery ? "No students found" : "No students yet"}
          description={
            searchQuery
              ? "Try a different search term"
              : "Students will appear here once they register"
          }
        />
      );
    }

    return (
      <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedStudents.map((student) => (
                <tr key={student._id} className="bg-student-table-row hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {getInitials(student)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {getDisplayName(student)}
                        </p>
                        <p className="text-sm text-muted-foreground">@{student.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {student.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </div>
                      )}
                      {student.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {student.phoneNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">
                          {student.averageScore?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.completedPapers || 0} papers completed
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(student._id)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 sidebar-icon sidebar-icon-students">
              <Users className="w-6 h-6" />
            </div>
            Students
          </h1>
          <p className="text-muted-foreground mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search students by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
      </div>
      <StudentDetailsModal
        studentId={selectedStudentId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudentId(null);
          refetch(); // Refetch students after modal closes, in case of changes
        }}
      />
    </TeacherLayout>
  );
}

export default function TeacherStudentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeacherStudentsPageContent />
    </Suspense>
  )
}
