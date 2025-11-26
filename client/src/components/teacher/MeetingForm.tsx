"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useTeacherInstitutes } from "@/modules/teacher/hooks/useTeacherInstitutes";
import { useTeacherYears } from "@/modules/teacher/hooks/useTeacherYears";
import { ZoomService } from "@/modules/shared/services/ZoomService";
import { ZoomLinkData, MeetingDetails } from '@/modules/shared/types/zoom.types'; // Import ZoomLinkData and MeetingDetails
import { isAxiosError } from '@/lib/utils/error';

interface ZoomFormProps {
  onSuccess: () => void;
  initialData?: ZoomLinkData; // Optional data for editing
  onCancel?: () => void; // Optional cancel callback for edit mode
}

export function MeetingForm({ onSuccess, initialData, onCancel }: ZoomFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("");
  const [academicLevel, setAcademicLevel] = useState(""); // Add academicLevel state
  const [availability, setAvailability] = useState<'all' | 'physical' | 'paid'>('all'); // Add availability state
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'create' | 'update' | null>(null);
  const [dataToConfirm, setDataToConfirm] = useState<{ meeting: MeetingDetails; institute: string; year: string; academicLevel: string; availability: 'all' | 'physical' | 'paid' } | null>(null); // Update dataToConfirm type

  const { institutes } = useTeacherInstitutes();
  const { years } = useTeacherYears();
  // Hardcoded academic levels for now, or fetch if available
  const academicLevels = [
    { _id: "OL", name: "Ordinary Level" },
    { _id: "AL", name: "Advanced Level" }
  ];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.meeting?.title || "");
      setDescription(initialData.meeting?.description || "");
      setZoomLink(initialData.meeting?.zoomLink || "");
      setYoutubeLink(initialData.meeting?.youtubeLink || "");
      setInstitute(initialData.institute?._id || "");
      setYear(initialData.year?._id || "");
      setAcademicLevel(initialData.academicLevel || ""); // Set academicLevel
      setAvailability(initialData.availability || 'all'); // Set availability
    } else {
      setTitle("");
      setDescription("");
      setZoomLink("");
      setYoutubeLink("");
      setInstitute("");
      setYear("");
      setAcademicLevel("");
      setAvailability('all');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !zoomLink || !institute || !year || !academicLevel) { // Validate academicLevel
      toast.error("Title, Meeting link, institute, year, and academic level are required");
      return;
    }
    setDataToConfirm({
      meeting: { title, description, zoomLink, youtubeLink },
      institute,
      year,
      academicLevel, // Include academicLevel
      availability, // Include availability
    });
    setActionType(initialData ? 'update' : 'create');
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!dataToConfirm || !actionType) return;

    setIsLoading(true);
    setConfirmDialogOpen(false);

    try {
      if (actionType === 'update' && initialData) {
        await ZoomService.updateZoomLink(initialData._id, {
          meeting: dataToConfirm.meeting,
          institute: dataToConfirm.institute,
          year: dataToConfirm.year,
          academicLevel: dataToConfirm.academicLevel, // Include academicLevel
          availability: dataToConfirm.availability, // Include availability
        });
        toast.success("Meeting link updated successfully");
      } else if (actionType === 'create') {
        await ZoomService.createZoomLink(dataToConfirm.meeting, dataToConfirm.institute, dataToConfirm.year, dataToConfirm.academicLevel, dataToConfirm.availability); // Include availability
        toast.success("Meeting link saved successfully");
      }
      onSuccess();
      if (!initialData) {
        setTitle("");
        setDescription("");
        setZoomLink("");
        setYoutubeLink("");
        setInstitute("");
        setYear("");
        setAcademicLevel("");
      }
    } catch (error: unknown) {
      let errorMessage = actionType === 'update' ? "Failed to update Meeting link" : "Failed to save Meeting link";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setActionType(null);
      setDataToConfirm(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <Textarea
        placeholder="Meeting Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="url"
        placeholder="Enter your Meeting Link"
        value={zoomLink}
        onChange={(e) => setZoomLink(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="url"
        placeholder="Enter a YouTube link (optional)"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
        disabled={isLoading}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select onValueChange={setInstitute} value={institute} key={`institute-${initialData?._id || 'new'}`}>
          <SelectTrigger className="border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Select Institute" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            {institutes.map((inst) => (
              <SelectItem key={inst._id} value={inst._id} className="text-gray-900 dark:text-white">
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setYear} value={year} key={`year-${initialData?._id || 'new'}`}>
          <SelectTrigger className="border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            {years.map((yr) => (
              <SelectItem key={yr._id} value={yr._id} className="text-gray-900 dark:text-white">
                {yr.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setAcademicLevel} value={academicLevel} key={`level-${initialData?._id || 'new'}`}>
          <SelectTrigger className="border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            {academicLevels.map((level) => (
              <SelectItem key={level._id} value={level._id} className="text-gray-900 dark:text-white">
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(val: 'all' | 'physical' | 'paid') => setAvailability(val)} value={availability} key={`availability-${initialData?._id || 'new'}`}>
          <SelectTrigger className="border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder="Select Availability" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectItem value="all" className="text-gray-900 dark:text-white">All Students</SelectItem>
            <SelectItem value="physical" className="text-gray-900 dark:text-white">Physical Class Only</SelectItem>
            <SelectItem value="paid" className="text-gray-900 dark:text-white">Paid Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (initialData ? "Updating..." : "Saving...") : (initialData ? "Update Meeting Link" : "Save Meeting Link")}
        </Button>
        {initialData && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'create' ? "Confirm Create Meeting Link" : "Confirm Update Meeting Link"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'create'
                ? "Are you sure you want to create this meeting link?"
                : "Are you sure you want to update this meeting link?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} disabled={isLoading}>
              {actionType === 'create' ? "Create" : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}