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

export function ZoomForm({ onSuccess, initialData, onCancel }: ZoomFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State for confirmation dialog
  const [actionType, setActionType] = useState<'create' | 'update' | null>(null); // Type of action
  const [dataToConfirm, setDataToConfirm] = useState<{ meeting: MeetingDetails; institute: string; year: string } | null>(null); // Data for confirmation

  const { institutes } = useTeacherInstitutes();
  const { years } = useTeacherYears();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.meeting?.title || initialData.title || "");
      setDescription(initialData.meeting?.description || initialData.description || "");
      setZoomLink(initialData.meeting?.zoomLink || initialData.zoomLink || "");
      setYoutubeLink(initialData.meeting?.youtubeLink || initialData.youtubeLink || "");
      setInstitute(initialData.institute?._id || "");
      setYear(initialData.year?._id || "");
    } else {
      // Clear form when initialData is null (e.g., after successful creation or cancellation)
      setTitle("");
      setDescription("");
      setZoomLink("");
      setYoutubeLink("");
      setInstitute("");
      setYear("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !zoomLink || !institute || !year) {
      toast.error("Title, Meeting link, institute, and year are required");
      return;
    }
    // Set data for confirmation and open dialog
    setDataToConfirm({
      meeting: { title, description, zoomLink, youtubeLink },
      institute,
      year,
    });
    setActionType(initialData ? 'update' : 'create');
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!dataToConfirm || !actionType) return;

    setIsLoading(true);
    setConfirmDialogOpen(false); // Close dialog

    try {
      if (actionType === 'update' && initialData) {
        // Update existing Meeting link
        await ZoomService.updateZoomLink(initialData._id, {
          meeting: dataToConfirm.meeting,
          institute: dataToConfirm.institute,
          year: dataToConfirm.year,
        });
        toast.success("Meeting link updated successfully");
      } else if (actionType === 'create') {
        // Create new Meeting link
        await ZoomService.createZoomLink(dataToConfirm.meeting, dataToConfirm.institute, dataToConfirm.year);
        toast.success("Meeting link saved successfully");
      }
      onSuccess();
      // If editing, form is cleared by parent setting initialData to null
      // If creating, form is cleared here
      if (!initialData) {
        setTitle("");
        setDescription("");
        setZoomLink("");
        setYoutubeLink("");
        setInstitute("");
        setYear("");
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
      <div className="grid grid-cols-2 gap-4">
        <Select onValueChange={setInstitute} value={institute}>
          <SelectTrigger>
            <SelectValue placeholder="Select Institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((inst) => (
              <SelectItem key={inst._id} value={inst._id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setYear} value={year}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((yr) => (
              <SelectItem key={yr._id} value={yr._id}>
                {yr.name}
              </SelectItem>
            ))}
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

      {/* Confirmation Dialog for Create/Update */}
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