"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Video, Trash2, Edit } from "lucide-react"; // Import Edit icon
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { ZoomForm } from "@/components/teacher/ZoomForm";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { Button } from "@/components/ui/button";
import { useTeacherZoom } from "@/modules/teacher/hooks/useTeacherZoom";
import { ZoomService } from "@/modules/shared/services/ZoomService";
import { ZoomLinkData } from '@/modules/shared/types/zoom.types'; // Import ZoomLinkData
import { isAxiosError } from '@/lib/utils/error';
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

export default function TeacherZoomPage() {
  const { zoomLinks, isLoading, error, refetch } = useTeacherZoom();
  const [editingZoomLink, setEditingZoomLink] = useState<ZoomLinkData | null>(null); // State for editing
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete dialog
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null); // ID of link to delete

  // Function to initiate deletion - opens dialog
  const handleDeleteInitiate = (id: string) => {
    setLinkToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Function to confirm deletion - executes delete API call
  const confirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await ZoomService.deleteZoomLink(linkToDelete);
      refetch();
      toast.success("Meeting link deleted successfully");
      if (editingZoomLink?._id === linkToDelete) {
        setEditingZoomLink(null); // Clear edit mode if deleted
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to delete Meeting link";
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  const handleEdit = (link: ZoomLinkData) => {
    setEditingZoomLink(link);
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingZoomLink(null); // Exit edit mode after success
  };

  const handleFormCancel = () => {
    setEditingZoomLink(null); // Exit edit mode on cancel
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingComponent />;
    }

    if (error) {
      return <ErrorComponent message={error} onRetry={refetch} />;
    }

    if (zoomLinks.length === 0) {
      return (
        <EmptyStateComponent
          Icon={Video}
          title="No Zoom links yet"
          description="Add your first Zoom link to get started"
        />
      );
    }

    return (
      <div className="space-y-4">
        {zoomLinks.map((link) => (
          <div key={link._id} className="flex items-center justify-between bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">{link.meeting?.title || link.title}</h3>
              {(link.meeting?.description || link.description) && <p className="text-sm text-muted-foreground truncate">{link.meeting?.description || link.description}</p>}
              <a href={link.meeting?.zoomLink || link.zoomLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate">
                {link.meeting?.zoomLink || link.zoomLink}
              </a>
              {(link.meeting?.youtubeLink || link.youtubeLink) && (
                <a href={link.meeting?.youtubeLink || link.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm truncate mt-1 block">
                  YouTube Video
                </a>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {link.institute && <span>{link.institute.name}</span>}
                {link.institute && link.year && " - "}
                {link.year && <span>{link.year.name}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(link)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteInitiate(link._id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 sidebar-icon sidebar-icon-videos">
              <Video className="w-6 h-6" />
            </div>
            Meeting Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add and manage your meeting links here.
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingZoomLink ? "Edit Meeting Link" : "Add New Meeting Link"}
          </h2>
          <ZoomForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            initialData={editingZoomLink}
          />
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <h2 className="text-xl font-bold mb-4">Your Meeting Links</h2>
          {renderContent()}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
