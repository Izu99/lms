"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { Loader2, Upload, FileText } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

interface ReviewUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attemptId: string, file: File) => Promise<void>;
  attemptId: string;
  existingFileUrl?: string; // Optional: URL of an already uploaded review file
}

export function ReviewUploadModal({
  isOpen,
  onClose,
  onSubmit,
  attemptId,
  existingFileUrl,
}: ReviewUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a PDF file to upload.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(attemptId, file);
      setFile(null); // Clear file state after successful upload
    } catch (err) {
      console.error("Error submitting review file:", err);
      toast.error("Failed to upload review file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExisting = () => {
    if (existingFileUrl) {
      window.open(`${API_BASE_URL}${existingFileUrl}`, '_blank');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Teacher Review File</AlertDialogTitle>
          <AlertDialogDescription>
            Upload a reviewed file for the student&apos;s submission. This will be visible to the student.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {existingFileUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <FileText size={18} />
                <span className="font-medium">Existing Review File</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleDownloadExisting}>
                Download Current
              </Button>
            </div>
          )}

          <div>
            <FileUpload
              onFileSelect={(file) => setFile(file)}
              accept="application/pdf"
              maxSizeMB={10}
              label="Upload Review PDF"
              description="Drag & drop the reviewed PDF here"
              disabled={loading}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {existingFileUrl ? "Update Review File" : "Upload Review File"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
