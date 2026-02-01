"use client";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import Link from "next/link";
import {
  FileText,
  Download,
  Upload,
  Send,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { PayHereButton } from "@/components/payment/PayHereButton";
import { Lock } from "lucide-react";

interface Paper {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  deadline: string;
}

function StructureEssayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const paperId = pathname.split('/').pop();

  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      toast.success("Payment Successful!", {
        description: "You now have full access to this paper.",
        duration: 5000,
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [answerFileUrl, setAnswerFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasPaperDownloaded, setHasPaperDownloaded] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    price: number;
    paperTitle: string;
    paperId: string;
  } | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/papers/${paperId}`, { headers });
        setPaper(response.data.paper);

        // Check if paper was already downloaded (stored in localStorage)
        const downloadKey = `paper_downloaded_${paperId}`;
        const hasDownloaded = localStorage.getItem(downloadKey) === 'true';
        setHasPaperDownloaded(hasDownloaded);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 402) {
          setPaymentRequired(true);
          setPaymentDetails(error.response.data);
        } else {
          console.error("Error fetching paper:", error);
          setError("Failed to load paper");
        }
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchPaper();
    }
  }, [paperId]);

  if (paymentRequired && paymentDetails) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border theme-border">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-yellow-600 dark:text-yellow-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary mb-2">
              Payment Required
            </h2>
            <p className="theme-text-secondary mb-6">
              To access{" "}
              <span className="font-semibold text-blue-600">
                {paymentDetails.paperTitle}
              </span>
              , a payment of{" "}
              <span className="font-bold">
                LKR {paymentDetails.price?.toFixed(2)}
              </span>{" "}
              is required.
            </p>

            <PayHereButton
              itemId={paymentDetails.paperId}
              itemModel="Paper"
              amount={paymentDetails.price}
              title={paymentDetails.paperTitle}
              className="w-full mb-4"
            />

            <Link href="/student/papers" className="block">
              <Button variant="ghost" className="w-full">
                Back to Papers
              </Button>
            </Link>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const handleSubmit = async () => {
    if (!answerFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    // uploadType MUST come before file for multer to see it
    formData.append("uploadType", "student-answer");
    formData.append("file", answerFile);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };

      console.log('📤 [FRONTEND] Uploading student answer...');
      console.log('  - File:', answerFile.name);
      console.log('  - Size:', answerFile.size);
      console.log('  - FormData uploadType:', formData.get('uploadType'));

      // First, upload the answer file
      const uploadResponse = await axios.post(`${API_URL}/papers/upload`, formData, { headers });
      const uploadedFileUrl = uploadResponse.data.fileUrl;

      console.log('✅ [FRONTEND] Upload response:', uploadResponse.data);
      console.log('  - fileUrl:', uploadedFileUrl);

      // Then, submit the paper with the file URL
      const submissionData = {
        answerFileUrl: uploadedFileUrl,
        timeSpent: 0, // Not applicable for structure papers
      };

      await axios.post(`${API_URL}/papers/${paperId}/submit`, submissionData, { headers: getAuthHeaders() });

      toast.success("Your answer has been submitted successfully!");
      router.push("/student/papers");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="theme-text-secondary">Loading paper...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !paper) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-red-500">{error || "Paper not found"}</p>
            <Link href="/student/papers" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold theme-text-primary">{paper.title}</h1>
          <Link href="/student/papers">
            <Button variant="outline">
              <ArrowLeft className="mr-2" />
              Back to Papers
            </Button>
          </Link>
        </div>

        <div className="theme-card p-6">
          <p className="theme-text-secondary">{paper.description}</p>
        </div>

        <div className="theme-card p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold theme-text-primary">Download Paper</h2>
            <p className="theme-text-secondary">Click the button to download the paper PDF.</p>
          </div>
          <a
            href={getFileUrl(paper.fileUrl, 'paper')}
            download
            rel="noopener noreferrer"
            onClick={() => {
              const downloadKey = `paper_downloaded_${paperId}`;
              localStorage.setItem(downloadKey, 'true');
              setHasPaperDownloaded(true);
            }}
          >
            <Button>
              <Download className="mr-2" />
              Download PDF
            </Button>
          </a>
        </div>

        <div className="theme-card p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-4">Upload Your Answer</h2>

          {!hasPaperDownloaded && (
            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Please download the paper first
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    You must download and review the paper before uploading your answer.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <FileUpload
              onFileSelect={(file) => setAnswerFile(file)}
              accept="application/pdf"
              maxSizeMB={10}
              label="Upload Answer PDF"
              description="Drag & drop your answer PDF here"
              disabled={submitting || !hasPaperDownloaded}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !answerFile || !hasPaperDownloaded}
                className="w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </StudentLayout>
  );
}

export default function StructureEssayPaperPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <StructureEssayContent />
    </Suspense>
  );
}
