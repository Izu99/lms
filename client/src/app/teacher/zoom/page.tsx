"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { ZoomForm } from "@/components/teacher/ZoomForm";
import { Video, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeacherZoom } from "@/modules/teacher/hooks/useTeacherZoom";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { TeacherZoomService } from "@/modules/shared/services/ZoomService";
import { toast } from "sonner";

export default function TeacherZoomPage() {
  const { zoomLinks, isLoading, error, refetch } = useTeacherZoom();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Zoom link?")) return;

    try {
      await TeacherZoomService.deleteZoomLink(id);
      refetch();
      toast.success("Zoom link deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete Zoom link");
    }
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
              <h3 className="text-lg font-semibold text-foreground truncate">{link.title}</h3>
              {link.description && <p className="text-sm text-muted-foreground truncate">{link.description}</p>}
              <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate">
                {link.link}
              </a>
              <div className="text-sm text-muted-foreground mt-1">
                {link.institute && <span>{link.institute.name}</span>}
                {link.institute && link.year && " - "}
                {link.year && <span>{link.year.name}</span>}
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(link._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
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
            Zoom Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Add and manage your Zoom links here.
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <ZoomForm onSuccess={refetch} />
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <h2 className="text-xl font-bold mb-4">Your Zoom Links</h2>
          {renderContent()}
        </div>
      </div>
    </TeacherLayout>
  );
}
