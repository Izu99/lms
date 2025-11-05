"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  ListOrdered,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { InfoDialog } from "@/components/InfoDialog";

interface Option {
  _id?: string;
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  _id?: string;
  questionText: string;
  options: Option[];
  open: boolean; // For UI accordion
  imageUrl?: string;
}



export default function EditPaperPage() {
  const router = useRouter();
  const params = useParams();
  const { id: paperId } = params;

  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'teacher' && user.role !== 'admin') {
        router.push('/papers');
      }
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }; 
  };

  useEffect(() => {
    if (!paperId || !user) return;

    const fetchPaper = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/papers/${paperId}`, { headers });
        const paper = response.data.paper;

        setTitle(paper.title);
        setDescription(paper.description || "");
        setDeadline(new Date(paper.deadline).toISOString().slice(0, 16));
        setTimeLimit(paper.timeLimit);
        setQuestions(paper.questions.map((q: Question) => ({ ...q, open: false })));

      } catch (error) {
        console.error("Error fetching paper:", error);
        setError("Failed to load paper for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId, user]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: true },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
        open: true,
        imageUrl: "",
      },
    ]);
  };

  const handleImageUpload = async (qIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem('token');
      const headers = { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.post(`${API_URL}/images/upload/paper-options`, formData, { headers });
      const newQuestions = [...questions];
      newQuestions[qIndex].imageUrl = response.data.imageUrl;
      setQuestions(newQuestions);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].optionText = value;
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((opt, i) => {
      opt.isCorrect = i === oIndex;
    });
    setQuestions(newQuestions);
  };

  const toggleQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].open = !newQuestions[index].open;
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!title.trim()) return "Paper title is required.";
    if (!deadline) return "Deadline is required.";
    if (timeLimit <= 0) return "Time limit must be greater than 0.";
    if (questions.length === 0) return "At least one question is required.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} text is required.`;
      if (q.options.length < 2) return `Question ${i + 1} must have at least two options.`;
      if (q.options.some(opt => !opt.optionText.trim())) {
        return `All options for Question ${i + 1} must have text.`;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        return `A correct answer must be selected for Question ${i + 1}.`;
      }
    }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      setSubmitting(true);
      const headers = getAuthHeaders();
      const paperData = {
        title,
        description,
        deadline,
        timeLimit,
        questions: questions.map(({ questionText, options, imageUrl }) => ({
          questionText,
          options: options.map(opt => ({ optionText: opt.optionText, isCorrect: opt.isCorrect })),
          imageUrl,
        })),
      };

      await axios.put(`${API_URL}/papers/${paperId}`, paperData, { headers });
      
      setInfoDialogContent({ title: "Success", description: "Paper updated successfully!" });
      setIsInfoOpen(true);

    } catch (error) {
      console.error("Error updating paper:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to update paper");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading Paper Editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="text-blue-600" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Paper</h1>
                <p className="text-gray-600 truncate max-w-md">{title}</p>
              </div>
            </div>
            <Link href="/papers">
              <Button variant="outline">
                <ArrowLeft size={16} className="mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>

          {/* Paper Details Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Paper Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700 mb-2 block">Title</label>
                <Input
                  placeholder="e.g., Mid-Term ICT Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12"
                />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-semibold text-gray-700 mb-2 block">Description (Optional)</label>
                <Textarea
                  placeholder="A brief summary of the paper's content"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* Deadline */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Deadline
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-12"
                />
              </div>
              {/* Time Limit */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={16} /> Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ListOrdered /> Questions Builder
              </h2>
              <Button onClick={addQuestion}>
                <Plus size={16} className="mr-2" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-gray-500">No questions added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="border rounded-xl overflow-hidden">
                    <div 
                      className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleQuestion(qIndex)}
                    >
                      <h3 className="font-semibold text-gray-800">
                        Question {qIndex + 1}
                      </h3>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(qIndex);
                          }}
                          className="text-red-500 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </Button>
                        {q.open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {q.open && (
                      <div className="p-6 space-y-6">
                        {/* Question Text */}
                        <Textarea
                          placeholder={`Enter text for question ${qIndex + 1}`}
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                          className="text-lg"
                        />

                        {/* Image Upload */}
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700">Optional Image</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(qIndex, e.target.files)}
                          />
                          {q.imageUrl && (
                            <div className="mt-2">
                              <img src={`${API_BASE_URL}${q.imageUrl}`} alt="Question preview" className="rounded-md max-h-24" />
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCorrectOption(qIndex, oIndex)}
                                className={`rounded-full w-10 h-10 flex-shrink-0 ${
                                  opt.isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                <Check size={20} />
                              </Button>
                              <Input
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt.optionText}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              />

                            </div>
                          ))}
                        </div>
                        

                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-red-50 border-l-4 border-red-500 p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Paper...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={20} />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </motion.div>
        <InfoDialog
          isOpen={isInfoOpen}
          onClose={() => {
            setIsInfoOpen(false);
            router.push("/papers");
          }}
          title={infoDialogContent.title}
          description={infoDialogContent.description}
        />
      </main>
    </div>
  );
}