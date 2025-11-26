import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Institute {
  _id: string;
  name: string;
  location?: string;
  isActive?: boolean;
}

interface Year {
  _id: string;
  year: number;
}

interface AcademicLevel {
  _id: string;
  name: string;
}

interface CommonFilterProps {
  institutes?: Institute[];
  years?: Year[];
  academicLevels?: AcademicLevel[];
  selectedInstitute?: string;
  selectedYear?: string;
  selectedAcademicLevel?: string;
  onInstituteChange?: (instituteId: string) => void;
  onYearChange?: (yearId: string) => void;
  onAcademicLevelChange?: (academicLevelId: string) => void;
  isLoadingInstitutes?: boolean;
  isLoadingYears?: boolean;
  isLoadingAcademicLevels?: boolean;
}

const CommonFilter: React.FC<CommonFilterProps> = ({
  institutes,
  years,
  academicLevels,
  selectedInstitute,
  selectedYear,
  selectedAcademicLevel,
  onInstituteChange,
  onYearChange,
  onAcademicLevelChange,
  isLoadingInstitutes,
  isLoadingYears,
  isLoadingAcademicLevels,
}) => {
  const hasActiveFilters =
    (selectedInstitute && selectedInstitute !== "all") ||
    (selectedYear && selectedYear !== "all") ||
    (selectedAcademicLevel && selectedAcademicLevel !== "all");

  const handleClearFilters = () => {
    if (onInstituteChange) onInstituteChange("all");
    if (onYearChange) onYearChange("all");
    if (onAcademicLevelChange) onAcademicLevelChange("all");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 items-end">
      {institutes && (
        <div className="flex-1 w-full">
          <label htmlFor="institute-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Institute
          </label>
          <Select
            value={selectedInstitute || "all"}
            onValueChange={onInstituteChange}
            disabled={isLoadingInstitutes}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingInstitutes ? 'Loading...' : 'All Institutes'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutes</SelectItem>
              {institutes.map((institute) => (
                <SelectItem key={institute._id} value={institute._id}>
                  {institute.name} - {institute.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {years && (
        <div className="flex-1 w-full">
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Year
          </label>
          <Select
            value={selectedYear || "all"}
            onValueChange={onYearChange}
            disabled={isLoadingYears}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingYears ? 'Loading...' : 'All Years'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year._id} value={year._id}>
                  {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {academicLevels && (
        <div className="flex-1 w-full">
          <label htmlFor="academic-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Academic Level
          </label>
          <Select
            value={selectedAcademicLevel || "all"}
            onValueChange={onAcademicLevelChange}
            disabled={isLoadingAcademicLevels}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingAcademicLevels ? 'Loading...' : 'All Academic Levels'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Academic Levels</SelectItem>
              {academicLevels.map((level) => (
                <SelectItem key={level._id} value={level._id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearFilters}
          className="h-10 w-10 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Clear Filters"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default CommonFilter;
