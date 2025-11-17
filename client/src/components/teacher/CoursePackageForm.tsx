"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { CoursePackageService } from "@/modules/teacher/services/CoursePackageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming a MultiSelect component exists
import { VideoMultiSelectDialog } from "@/components/teacher/VideoMultiSelectDialog"; // Import the new component
import { PaperMultiSelectDialog } from "@/components/teacher/PaperMultiSelectDialog"; // Import the new component
import { useVideos } from "@/modules/teacher/hooks/useVideos"; // Assuming this hook exists
import { usePapers } from "@/modules/teacher/hooks/usePapers"; // Assuming this hook exists
import { useInstitutes } from "@/modules/teacher/hooks/useInstitutes"; // Assuming this hook exists
import { useYears } from "@/modules/teacher/hooks/useYears"; // Assuming this hook exists

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  videos: z.array(z.string()).default([]),
  papers: z.array(z.string()).default([]),
  freeForAllInstituteYear: z.boolean().default(false),
  institute: z.string().optional(),
  year: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CoursePackageFormProps {
  initialData?: CoursePackageData;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CoursePackageForm({ initialData, onSuccess, onCancel }: CoursePackageFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      videos: [],
      papers: [],
      freeForPhysicalStudents: false,
      freeForAllInstituteYear: false,
      institute: undefined,
      year: undefined,
    },
  });

  const { videos, isLoading: isLoadingVideos } = useVideos();
  const { papers, isLoading: isLoadingPapers } = usePapers();
  const { institutes, isLoading: isLoadingInstitutes } = useInstitutes();
  const { years, isLoading: isLoadingYears } = useYears();

  // Debug: Log all data
  React.useEffect(() => {
    console.log('📊 Form Data:', {
      videos: videos.length,
      papers: papers.length,
      institutes: institutes.length,
      years: years.length,
      yearsData: years
    });
  }, [videos, papers, institutes, years]);

  const freeForAllInstituteYear = watch("freeForAllInstituteYear");
  const selectedInstitute = watch("institute");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        videos: initialData.videos?.map((v: any) => typeof v === 'string' ? v : v._id) || [],
        papers: initialData.papers?.map((p: any) => typeof p === 'string' ? p : p._id) || [],
        freeForAllInstituteYear: initialData.freeForAllInstituteYear || false,
        institute: typeof initialData.institute === 'string' ? initialData.institute : initialData.institute?._id,
        year: typeof initialData.year === 'string' ? initialData.year : initialData.year?._id,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData?._id) {
        await CoursePackageService.updateCoursePackage(
          initialData._id,
          data.title,
          data.description || "",
          data.price,
          data.videos || [],
          data.papers || [],
          false, // freeForPhysicalStudents
          data.freeForAllInstituteYear || false,
          data.institute,
          data.year
        );
        toast.success("Course package updated successfully");
      } else {
        await CoursePackageService.createCoursePackage(
          data.title,
          data.description || "",
          data.price,
          data.videos || [],
          data.papers || [],
          false, // freeForPhysicalStudents
          data.freeForAllInstituteYear || false,
          data.institute,
          data.year
        );
        toast.success("Course package created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save course package");
    }
  };

  const videoOptions = videos.map((v) => ({ label: v.title, value: v._id }));
  const paperOptions = papers.map((p) => ({ label: p.title, value: p._id }));
  const instituteOptions = institutes.map((i) => ({ label: i.name, value: i._id }));
  
  // Filter years based on selected institute
  const yearOptions = React.useMemo(() => {
    console.log('🔍 Year filtering:', { 
      selectedInstitute, 
      totalYears: years.length,
      years: years.map(y => ({ 
        name: y.name, 
        institute: typeof y.institute === 'string' ? y.institute : y.institute?._id 
      }))
    });
    
    if (!selectedInstitute) {
      console.log('⚠️ No institute selected');
      return [];
    }
    
    const filtered = years.filter(y => {
      const instituteId = typeof y.institute === 'string' ? y.institute : y.institute?._id;
      const matches = instituteId === selectedInstitute;
      console.log(`Year ${y.name}: institute=${instituteId}, matches=${matches}`);
      return matches;
    });
    
    console.log('✅ Filtered years:', filtered.length);
    return filtered.map((y) => ({ label: y.name, value: y._id }));
  }, [years, selectedInstitute]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter package title"
          className="mt-1"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter package description"
          className="mt-1"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="Enter price"
          className="mt-1"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <Label>Videos</Label>
        <VideoMultiSelectDialog
          options={videoOptions}
          selected={watch("videos") || []}
          onSelectedChange={(selected) => setValue("videos", selected)}
          placeholder="Select videos..."
          isLoading={isLoadingVideos}
        />
        {errors.videos && <p className="text-red-500 text-sm mt-1">{errors.videos.message}</p>}
      </div>

      {/* Papers - Multiple Select with Checkboxes */}
      <div>
        <Label>Papers</Label>
        <PaperMultiSelectDialog
          options={paperOptions}
          selected={watch("papers") || []}
          onSelectedChange={(selected) => setValue("papers", selected)}
          placeholder="Select papers..."
          isLoading={isLoadingPapers}
        />
        {errors.papers && <p className="text-red-500 text-sm mt-1">{errors.papers.message}</p>}
      </div>

      {/* Free for all checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="freeForAllInstituteYear"
          checked={freeForAllInstituteYear}
          onCheckedChange={(checked) => setValue("freeForAllInstituteYear", checked as boolean)}
        />
        <Label htmlFor="freeForAllInstituteYear" className="cursor-pointer">
          Free for all institutes and years
        </Label>
      </div>

      {!freeForAllInstituteYear && (
        <>
          {/* Institute Select */}
          <div>
            <Label htmlFor="institute">Institute *</Label>
            <Select
              value={selectedInstitute || ""}
              onValueChange={(value) => {
                setValue("institute", value);
                setValue("year", undefined); // Reset year when institute changes
              }}
              disabled={isLoadingInstitutes}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Institute" />
              </SelectTrigger>
              <SelectContent>
                {instituteOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.institute && <p className="text-red-500 text-sm mt-1">{errors.institute.message}</p>}
          </div>

          {/* Year Select */}
          <div>
            <Label htmlFor="year">Year *</Label>
            <Select
              value={watch("year") || ""}
              onValueChange={(value) => {
                console.log('📅 Year selected:', value);
                setValue("year", value);
              }}
              disabled={!selectedInstitute || isLoadingYears}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    {!selectedInstitute ? "Please select an institute first" : "No years available for this institute"}
                  </div>
                ) : (
                  yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {yearOptions.length} years available for selected institute
            </p>
          </div>
        </>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}
