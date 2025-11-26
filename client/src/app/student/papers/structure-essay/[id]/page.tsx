"use client";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

interface Paper {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  deadline: string;
}

export default function StructureEssayPaperPage() {
  const router = useRouter();
  const pathname = usePathname();
  const paperId = pathname.split('/').pop();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [answerFileUrl, setAnswerFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      } catch (error) {
        console.error("Error fetching paper:", error);
        setError("Failed to load paper");
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchPaper();
    }
  }, [paperId]);



  const handleSubmit = async () => {
    if (!answerFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", answerFile);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };

      // First, upload the answer file
      const uploadResponse = await axios.post(`${API_URL}/papers/upload`, formData, { headers });
      const uploadedFileUrl = uploadResponse.data.fileUrl;

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
          <a href={`${API_BASE_URL}${paper.fileUrl}`} download rel="noopener noreferrer">
            <Button>
              <Download className="mr-2" />
              Download PDF
            </Button>
          </a>
        </div>

        <div className="theme-card p-6">
          <h2 className="text-xl font-semibold theme-text-primary mb-4">Upload Your Answer</h2>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={(file) => setAnswerFile(file)}
              accept="application/pdf"
              maxSizeMB={10}
              label="Upload Answer PDF"
              description="Drag & drop your answer PDF here"
              disabled={submitting}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !answerFile}
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
