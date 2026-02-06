"use client";

import { SelfHostedVideoPlayerModal } from "@/components/common/SelfHostedVideoPlayerModal";
import { StudentLayout } from "@/components/student/StudentLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState, Suspense } from "react";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { VideoData } from "@/modules/shared/types/video.types";
import { PaperData } from "@/modules/shared/types/paper.types";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Video, FileText, School, GraduationCap, Play } from "lucide-react";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { API_BASE_URL } from "@/lib/constants";
import { PaymentCheckout } from "@/components/payment/PaymentCheckout";
import { getFileUrl } from "@/lib/fileUtils";

interface CoursePackageDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function CoursePackageDetailsContent({ params }: CoursePackageDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [coursePackage, setCoursePackage] = useState<CoursePackageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      toast.success("Payment Successful!", {
        description: "You now have full access to this course package.",
        duration: 5000,
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCoursePackage = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching course package details for ID:', id);
        const response = await api.get<{ coursePackage: CoursePackageData }>(`/course-packages/${id}`);
        console.log('API Response for course package details:', response.data);
        setCoursePackage(response.data.coursePackage);
      } catch (err) {
        console.error("Error fetching course package details:", err);
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || "Failed to load course package details.";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unexpected error occurred.");
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCoursePackage();
    }
  }, [id]);

  const handleVideoClick = (videoUrl: string, title: string) => {
    // Construct absolute URL using API_BASE_URL/api/uploads/
    const cleanPath = videoUrl.startsWith('/') ? videoUrl.slice(1) : videoUrl;
    const finalUrl = `${API_BASE_URL}/api/uploads/${cleanPath.replace(/^api\/uploads\//, '').replace(/^uploads\//, '')}`;
    setCurrentVideoUrl(finalUrl);
    setCurrentVideoTitle(title);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <StudentLayout>
        <ErrorComponent message={error} onRetry={() => router.back()} />
      </StudentLayout>
    );
  }

  if (!coursePackage) {
    return (
      <StudentLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">Course Package Not Found</h2>
          <p className="theme-text-secondary mb-4">The requested course package could not be loaded.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </StudentLayout>
    );
  }

  const defaultBackground = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80";
  const headerBackground = coursePackage.backgroundImage ? getFileUrl(coursePackage.backgroundImage, 'image') : defaultBackground;

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative theme-card overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            <img 
              src={headerBackground} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = defaultBackground; }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          </div>
          <div className="relative z-10 p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{coursePackage.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{coursePackage.description || "No description provided."}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">LKR {coursePackage.price?.toFixed(2) ?? '0.00'}</span>
              </div>

              {typeof coursePackage.institute === 'object' && coursePackage.institute.name &&
                typeof coursePackage.year === 'object' && coursePackage.year.name && (
                  <div className="flex items-center gap-2 text-base text-gray-300">
                    <School className="w-5 h-5 text-purple-400" />
                    <span>For {coursePackage.institute.name} - {coursePackage.year.name}</span>
                  </div>
                )}

              {coursePackage.availability === "all" && (
                <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-300 rounded-full">Free for All</span>
              )}
              {coursePackage.availability === "physical" && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full">Free for Physical</span>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="theme-card p-6">
          <h2 className="text-2xl font-bold theme-text-primary mb-4 flex items-center gap-2">
            <Video className="w-6 h-6 text-blue-500" /> Included Videos ({(coursePackage.videos?.length ?? 0)})
          </h2>
          {(coursePackage.videos?.length ?? 0) > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursePackage.videos?.map((video) => {
                const videoData = typeof video === 'string' ? null : video;
                if (!videoData) return null;

                const videoThumb = videoData.thumbnailUrl ? getFileUrl(videoData.thumbnailUrl, 'video-thumbnail') : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80";

                return (
                  <div key={videoData._id}
                    className="relative w-full h-48 bg-gray-900 cursor-pointer group overflow-hidden rounded-lg shadow-md"
                    onClick={() => handleVideoClick(videoData.videoUrl, videoData.title)}>
                    <img
                      src={videoThumb}
                      alt={videoData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"; }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100">
                        <Play size={32} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Video
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-medium text-white truncate">{videoData.title}</h3>
                      <p className="text-xs text-gray-300 line-clamp-1">{videoData.description || "No description"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="theme-text-secondary">No videos included in this package.</p>
          )}
        </div>

        {/* Papers Section */}
        <div className="theme-card p-6">
          <h2 className="text-2xl font-bold theme-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-500" /> Included Papers ({(coursePackage.papers?.length ?? 0)})
          </h2>
          {(coursePackage.papers?.length ?? 0) > 0 ? (
            <ul className="space-y-3">
              {coursePackage.papers?.map((paper) => {
                const paperData = typeof paper === 'string' ? null : paper; // Ensure it's PaperData
                if (!paperData) return null; // Skip if not populated

                return (
                  <li key={paperData._id} className="flex items-center gap-4 p-3 theme-bg-secondary rounded-lg hover:theme-bg-hover transition-colors">
                    <FileText className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium theme-text-primary">{paperData.title}</h3>
                      <p className="text-sm theme-text-secondary">
                        {paperData.description || "No description"}
                      </p>
                      <p className="text-sm theme-text-secondary">
                        {paperData.totalQuestions} Questions • {paperData.timeLimit} Minutes
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="theme-text-secondary">No papers included in this package.</p>
          )}
        </div>

        {/* Payment Section - Simplified */}
        <div className="p-8 text-center flex flex-col items-center gap-6 border-t theme-border mt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold theme-text-primary">Unlock Full Access</h2>
            <p className="theme-text-secondary max-w-md mx-auto">Get instant access to all {coursePackage.videos?.length} videos and {coursePackage.papers?.length} papers included in this package.</p>
          </div>
          
          <PaymentCheckout
            itemId={coursePackage._id}
            itemModel="CoursePackage"
            amount={coursePackage.price || 0}
            title={coursePackage.title}
            className="w-full sm:w-auto text-lg py-4 px-10 h-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
          />
          
          <p className="text-xs theme-text-tertiary">One-time payment for lifetime access</p>
        </div>
      </div>

      <SelfHostedVideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />
    </StudentLayout>
  );
}

export default function CoursePackageDetailsPage({ params }: CoursePackageDetailsPageProps) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <CoursePackageDetailsContent params={params} />
    </Suspense>
  );
}
