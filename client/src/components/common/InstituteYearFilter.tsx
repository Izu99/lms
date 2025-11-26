"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api-client"; // Assuming api-client.ts is in lib
import { Label } from "@/components/ui/label"; // Assuming shadcn/ui Label component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn/ui Select component

interface InstituteData {
  _id: string;
  name: string;
}

interface YearData {
  _id: string;
  year: string;
}

interface InstituteYearFilterProps {
  onFilterChange: (instituteId: string | null, yearId: string | null) => void;
  initialInstituteId?: string | null;
  initialYearId?: string | null;
}

export function InstituteYearFilter({
  onFilterChange,
  initialInstituteId = null,
  initialYearId = null,
}: InstituteYearFilterProps) {
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [years, setYears] = useState<YearData[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(
    initialInstituteId
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(initialYearId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [institutesRes, yearsRes] = await Promise.all([
          api.get<{ institutes: InstituteData[] }>("/institutes"),
          api.get<{ years: YearData[] }>("/years"),
        ]);

        setInstitutes(institutesRes.data.institutes);
        setYears(yearsRes.data.years);
      } catch (err) {
        console.error("Failed to fetch filter data:", err);
        setError("Failed to load filter options.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    // Only trigger onFilterChange if both selectedInstitute and selectedYear are initialized
    // or if they are explicitly changed by the user.
    // This prevents initial calls with null values if initial props are not provided.
    onFilterChange(selectedInstitute, selectedYear);
  }, [selectedInstitute, selectedYear, onFilterChange]);

  if (loading) {
    return <div className="text-gray-500">Loading filters...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="institute-select" className="sr-only">
          Institute
        </Label>
        <Select
          value={selectedInstitute || ""}
          onValueChange={(value) => setSelectedInstitute(value === "" ? null : value)}
        >
          <SelectTrigger id="institute-select" className="w-full">
            <SelectValue placeholder="Select Institute" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Institutes</SelectItem>
            {institutes.map((institute) => (
              <SelectItem key={institute._id} value={institute._id}>
                {institute.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="year-select" className="sr-only">
          Year
        </Label>
        <Select
          value={selectedYear || ""}
          onValueChange={(value) => setSelectedYear(value === "" ? null : value)}
        >
          <SelectTrigger id="year-select" className="w-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year._id} value={year._id}>
                {year.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
