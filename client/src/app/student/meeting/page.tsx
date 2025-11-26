"use client";

import { Video } from "lucide-react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { useStudentMeeting } from "@/modules/student/hooks/useStudentMeeting";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { StudentGridSkeleton } from "@/components/student/skeletons/StudentGridSkeleton";
import CommonFilter from "@/components/common/CommonFilter";
import { useStudentFilters } from "@/modules/student/hooks/useStudentFilters";
import { useState } from "react";

export default function StudentMeetingPage() {
  const { meetingLinks, isLoading, error, refetch } = useStudentMeeting();

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("all");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useStudentFilters();

  if (isLoading) {
    return (
      <StudentLayout>
        <StudentGridSkeleton />
      </StudentLayout>
    );
  }

  const renderContent = () => {
    if (error) {
      return <ErrorComponent message={error} onRetry={refetch} />;
    }

    if (meetingLinks.length === 0) { // Renamed variable
      return (
        <EmptyStateComponent
          Icon={Video}
          title="No Meeting links yet" // Updated text
          description="Your teacher has not added any meeting links yet." // Updated text
        />
      );
    }

    return (
      <div className="space-y-4">
        {meetingLinks.map((link) => (
          <div key={link._id} className="theme-card rounded-lg shadow-md theme-border p-6">
            <div className="flex-1 min-w-0 mb-4">
              <h3 className="text-lg font-semibold theme-text-primary mb-2">{link.meeting?.title}</h3>
              {link.meeting?.description && (
                <p className="text-sm theme-text-secondary mb-3">{link.meeting?.description}</p>
              )}
              <div className="text-sm theme-text-secondary">
                {link.institute && <span>{link.institute.name}</span>}
                {link.institute && link.year && " - "}
                {link.year && <span>{link.year.name}</span>}
              </div>
            </div>

            {/* Zoom Link Button */}
            {link.meeting?.zoomLink && (
              <a
                href={link.meeting.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mb-3"
              >
                <Video size={18} />
                <span>Join Zoom Meeting</span>
              </a>
            )}

            {/* YouTube Video Embed */}
            {link.meeting?.youtubeLink && (
              <div className="mt-4">
                <h4 className="text-sm font-medium theme-text-primary mb-2">Recording:</h4>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${(() => {
                      try {
                        const url = new URL(link.meeting.youtubeLink);
                        return url.searchParams.get('v') || link.meeting.youtubeLink.split('v=')[1]?.split('&')[0];
                      } catch {
                        return link.meeting.youtubeLink.split('v=')[1]?.split('&')[0];
                      }
                    })()}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary flex items-center gap-3">
            <div className="w-10 h-10 sidebar-icon sidebar-icon-videos">
              <Video className="w-6 h-6" />
            </div>
            Meeting Links
          </h1>
          <p className="theme-text-secondary mt-1">
            Here are the meeting links for your classes.
          </p>
        </div>

        {/* Filter Component */}
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

        <div className="theme-card rounded-xl shadow-md theme-border p-6">
          <h2 className="text-xl font-bold mb-4">Your Meeting Links</h2> {/* Updated text */}
          {renderContent()}
        </div>
      </div>
    </StudentLayout>
  );
}
