"use client";

import { Video } from "lucide-react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { useStudentZoom } from "@/modules/student/hooks/useStudentZoom";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";

export default function StudentZoomPage() {
  const { zoomLinks, isLoading, error, refetch } = useStudentZoom();

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
          description="Your teacher has not added any Zoom links yet."
        />
      );
    }

    return (
      <div className="space-y-4">
        {zoomLinks.map((link) => (
          <div key={link._id} className="flex items-center justify-between bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">{link.meeting?.title}</h3>
              {(link.meeting?.description) && <p className="text-sm text-muted-foreground truncate">{link.meeting?.description}</p>}
              <a href={link.meeting?.zoomLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate">
                {link.meeting?.zoomLink}
              </a>              {(link.meeting?.youtubeLink) && (
                <a href={link.meeting?.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline text-sm truncate mt-1 block">
                  YouTube Video
                </a>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {link.institute && <span>{link.institute.name}</span>}
                {link.institute && link.year && " - "}
                {link.year && <span>{link.year.name}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 sidebar-icon sidebar-icon-videos">
              <Video className="w-6 h-6" />
            </div>
            Meeting Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here are the meeting links for your classes.
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-md border border-border p-6">
          <h2 className="text-xl font-bold mb-4">Your Meeting Links</h2>
          {renderContent()}
        </div>
      </div>
    </StudentLayout>
  );
}
