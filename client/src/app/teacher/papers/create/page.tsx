"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronUp,
  Image as ImageIcon,
  BookOpen,
  Upload,
  X,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { InfoDialog } from "@/components/InfoDialog";

interface Option {
  optionText: string;
  isCorrect: boolean;
}

interface Explanation {
  text?: string;
  imageUrl?: string;
}

interface Question {
  questionText: string;
  options: Option[];
  open: boolean;
  imageUrl?: string;
  explanation?: Explanation; // විවරණ - detailed explanation
}

export default function CreatePaperPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  
  // Refs for smooth scrolling
  const questionsRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'teacher' && user.role !== 'admin') {
        router.push('/papers');
      }
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }; 
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToQuestions = () => {
    questionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
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
      explanation: { text: "", imageUrl: "" }
    };
    
    setQuestions([...questions, newQuestion]);
    
    // Scroll to the new question after a short delay
    setTimeout(() => {
      const questionElements = document.querySelectorAll('[data-question-index]');
      const lastQuestion = questionElements[questionElements.length - 1];
      lastQuestion?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleImageUpload = async (qIndex: number, files: FileList | null, type: 'question' | 'explanation' = 'question') => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    const uploadKey = `${qIndex}-${type}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const token = localStorage.getItem('token');
      const headers = { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      };
      
      const endpoint = type === 'explanation' 
        ? `${API_URL}/images/upload/explanation`
        : `${API_URL}/images/upload/paper-options`;
        
      const response = await axios.post(endpoint, formData, { headers });
      
      const newQuestions = [...questions];
      if (type === 'explanation') {
        if (!newQuestions[qIndex].explanation) {
          newQuestions[qIndex].explanation = {};
        }
        newQuestions[qIndex].explanation!.imageUrl = response.data.imageUrl;
      } else {
        newQuestions[qIndex].imageUrl = response.data.imageUrl;
      }
      setQuestions(newQuestions);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Failed to upload ${type} image`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeImage = (qIndex: number, type: 'question' | 'explanation' = 'question') => {
    const newQuestions = [...questions];
    if (type === 'explanation') {
      if (newQuestions[qIndex].explanation) {
        newQuestions[qIndex].explanation!.imageUrl = "";
      }
    } else {
      newQuestions[qIndex].imageUrl = "";
    }
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleExplanationChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    if (!newQuestions[index].explanation) {
      newQuestions[index].explanation = {};
    }
    newQuestions[index].explanation!.text = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) { // Keep at least 2 options
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
        (_, i) => i !== oIndex
      );
      setQuestions(newQuestions);
    }
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
        questions: questions.map(({ questionText, options, imageUrl, explanation }) => ({
          questionText,
          options,
          imageUrl,
          explanation: explanation && (explanation.text || explanation.imageUrl) ? explanation : undefined
        })),
      };

      await axios.post(`${API_URL}/papers`, paperData, { headers });
      
      setInfoDialogContent({ 
        title: "Success! 🎉", 
        description: "Paper created successfully! Students can now access and attempt this paper." 
      });
      setIsInfoOpen(true);

    } catch (error) {
      console.error("Error creating paper:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to create paper");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-secondary" ref={topRef}>
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold theme-text-primary">Create New Paper</h1>
                <p className="theme-text-secondary text-lg">Design and build your examination paper with detailed explanations</p>
              </div>
            </div>
            <Link href="/teacher/papers">
              <Button variant="outline" size="lg" className="shadow-md">
                <ArrowLeft size={18} className="mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>

          {/* Paper Details Form */}
          <motion.div 
            className="theme-bg-primary rounded-3xl shadow-xl theme-border p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold theme-text-primary mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              Paper Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="font-semibold theme-text-primary mb-3 block text-lg">Paper Title</label>
                <Input
                  placeholder="e.g., Mid-Term ICT Examination - Database Systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-14 text-lg theme-bg-secondary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-semibold theme-text-primary mb-3 block text-lg">Description (Optional)</label>
                <Textarea
                  placeholder="A brief summary of the paper's content and topics covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] text-lg theme-bg-secondary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              {/* Deadline */}
              <div>
                <label className="font-semibold theme-text-primary mb-3 flex items-center gap-2 text-lg">
                  <Calendar size={20} className="text-blue-600 dark:text-blue-400" /> Deadline
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-14 text-lg theme-bg-secondary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                />
              </div>
              {/* Time Limit */}
              <div>
                <label className="font-semibold theme-text-primary mb-3 flex items-center gap-2 text-lg">
                  <Clock size={20} className="text-blue-600 dark:text-blue-400" /> Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="h-14 text-lg theme-bg-secondary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                  min="1"
                />
              </div>
            </div>
          </motion.div>

          {/* Questions Builder */}
          <motion.div 
            className="theme-bg-primary rounded-3xl shadow-xl theme-border p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            ref={questionsRef}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold theme-text-primary flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <ListOrdered size={20} className="text-green-600 dark:text-green-400" />
                </div>
                Questions Builder
                <span className="text-lg font-normal theme-text-secondary">({questions.length} questions)</span>
              </h2>
              <div className="flex gap-3">
                {questions.length > 0 && (
                  <Button onClick={scrollToTop} variant="outline" size="lg" className="theme-border-muted theme-text-secondary">
                    <ArrowUp size={18} className="mr-2" />
                    Scroll to Top
                  </Button>
                )}
                <Button onClick={addQuestion} size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus size={18} className="mr-2" />
                  Add Question
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <motion.div 
                className="text-center py-16 border-2 border-dashed theme-border rounded-2xl theme-bg-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListOrdered size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold theme-text-primary mb-2">No questions added yet</h3>
                <p className="theme-text-secondary mb-6">Click &quot;Add Question&quot; to start building your paper with detailed explanations</p>
                <Button onClick={addQuestion} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Plus size={18} className="mr-2" />
                  Add Your First Question
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {questions.map((q, qIndex) => (
                    <motion.div 
                      key={qIndex}
                      data-question-index={qIndex}
                      className="theme-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: qIndex * 0.1 }}
                    >
                      <div 
                        className="theme-bg-secondary p-6 flex items-center justify-between cursor-pointer hover:theme-bg-tertiary transition-colors"
                        onClick={() => toggleQuestion(qIndex)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {qIndex + 1}
                          </div>
                          <div>
                            <h3 className="font-bold theme-text-primary text-lg">
                              Question {qIndex + 1}
                            </h3>
                            <p className="theme-text-secondary text-sm">
                              {q.questionText ? q.questionText.substring(0, 50) + (q.questionText.length > 50 ? '...' : '') : 'Click to add question text'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm theme-text-secondary">
                            <span>{q.options.length} options</span>
                            {q.explanation?.text && <BookOpen size={16} className="text-green-600" />}
                            {q.explanation?.imageUrl && <ImageIcon size={16} className="text-blue-600" />}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeQuestion(qIndex);
                            }}
                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </Button>
                          <div className="theme-text-secondary">
                            {q.open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {q.open && (
                          <motion.div 
                            className="p-8 space-y-8 theme-bg-primary"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Question Text */}
                            <div>
                              <label className="font-semibold theme-text-primary mb-3 block text-lg">Question Text</label>
                              <Textarea
                                placeholder={`Enter the question text for question ${qIndex + 1}...`}
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                className="text-lg min-h-[120px] theme-bg-secondary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
                              />
                            </div>

                            {/* Question Image Upload */}
                            <div>
                              <label className="font-semibold theme-text-primary mb-3 block text-lg flex items-center gap-2">
                                <ImageIcon size={20} className="text-blue-600 dark:text-blue-400" />
                                Question Image (Optional)
                              </label>
                              <div className="theme-border border-dashed rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-600 transition-colors theme-bg-secondary">
                                {q.imageUrl ? (
                                  <div className="relative">
                                    <img 
                                      src={`${API_BASE_URL}/api/uploads${q.imageUrl}`} 
                                      alt="Question preview" 
                                      className="rounded-lg max-h-48 mx-auto shadow-md" 
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2"
                                      onClick={() => removeImage(qIndex, 'question')}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                      {uploadingImages[`${qIndex}-question`] ? (
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Upload size={24} className="text-blue-600 dark:text-blue-400" />
                                      )}
                                    </div>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(qIndex, e.target.files, 'question')}
                                      className="max-w-xs mx-auto theme-bg-primary theme-text-primary theme-border"
                                      disabled={uploadingImages[`${qIndex}-question`]}
                                    />
                                    <p className="text-sm theme-text-secondary mt-2">Upload an image to accompany this question</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Options */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="font-semibold theme-text-primary text-lg">Answer Options</label>
                                <Button
                                  onClick={() => addOption(qIndex)}
                                  variant="outline"
                                  size="sm"
                                  disabled={q.options.length >= 6}
                                  className="theme-border-muted theme-text-secondary"
                                >
                                  <Plus size={16} className="mr-1" />
                                  Add Option
                                </Button>
                              </div>
                              <div className="space-y-4">
                                {q.options.map((opt, oIndex) => (
                                  <motion.div 
                                    key={oIndex}
                                    className="flex items-center gap-4 p-4 theme-border rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors theme-bg-secondary"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: oIndex * 0.1 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setCorrectOption(qIndex, oIndex)}
                                      className={`rounded-full w-12 h-12 flex-shrink-0 transition-all ${
                                        opt.isCorrect
                                          ? "bg-green-500 text-white shadow-lg scale-110"
                                          : "theme-bg-primary theme-text-secondary hover:bg-green-100 dark:hover:bg-green-900/50"
                                      }`}
                                      title={opt.isCorrect ? "Correct Answer" : "Click to mark as correct"}
                                    >
                                      <Check size={20} />
                                    </Button>
                                    <div className="flex-1">
                                      <Input
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt.optionText}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        className="text-lg h-12 theme-bg-primary theme-text-primary theme-border focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                                      />
                                    </div>
                                    {q.options.length > 2 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(qIndex, oIndex)}
                                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Detailed Explanation (විවරණ) */}
                            <div className="border-t theme-border pt-8">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                                  <BookOpen size={20} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold theme-text-primary text-lg">Detailed Explanation (විවරණ)</h3>
                                  <p className="text-sm theme-text-secondary">Optional: Help students understand how to get the correct answer</p>
                                </div>
                              </div>
                              
                              {/* Explanation Text */}
                              <div className="mb-6">
                                <label className="font-medium theme-text-primary mb-2 block">Explanation Text</label>
                                <Textarea
                                  placeholder="Explain the reasoning behind the correct answer, provide step-by-step solution, or give additional context..."
                                  value={q.explanation?.text || ""}
                                  onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                                  className="min-h-[100px] theme-bg-secondary theme-text-primary theme-border focus:border-amber-500 dark:focus:border-amber-400 rounded-xl"
                                />
                              </div>

                              {/* Explanation Image */}
                              <div>
                                <label className="font-medium theme-text-primary mb-2 block flex items-center gap-2">
                                  <ImageIcon size={16} className="text-amber-600 dark:text-amber-400" />
                                  Explanation Image (Optional)
                                </label>
                                <div className="theme-border border-dashed rounded-xl p-4 hover:border-amber-400 dark:hover:border-amber-600 transition-colors bg-amber-50/30 dark:bg-amber-900/20">
                                  {q.explanation?.imageUrl ? (
                                    <div className="relative">
                                      <img 
                                        src={`${API_BASE_URL}/api/uploads${q.explanation.imageUrl}`} 
                                        alt="Explanation preview" 
                                        className="rounded-lg max-h-40 mx-auto shadow-md" 
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeImage(qIndex, 'explanation')}
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                                        {uploadingImages[`${qIndex}-explanation`] ? (
                                          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <Upload size={20} className="text-amber-600 dark:text-amber-400" />
                                        )}
                                      </div>
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(qIndex, e.target.files, 'explanation')}
                                        className="max-w-xs mx-auto theme-bg-primary theme-text-primary theme-border"
                                        disabled={uploadingImages[`${qIndex}-explanation`]}
                                      />
                                      <p className="text-xs theme-text-secondary mt-1">Upload diagrams, charts, or visual aids</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Add Question Button at Bottom */}
                {questions.length > 0 && (
                  <motion.div 
                    className="text-center pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      onClick={addQuestion} 
                      size="lg" 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Another Question
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">Validation Error</h3>
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={submitting || questions.length === 0}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {submitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Paper...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Save size={24} />
                  Save and Publish Paper
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Button
                onClick={scrollToTop}
                size="icon"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl"
              >
                <ArrowUp size={24} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <InfoDialog
          isOpen={isInfoOpen}
          onClose={() => {
            setIsInfoOpen(false);
            router.push("/teacher/papers");
          }}
          title={infoDialogContent.title}
          description={infoDialogContent.description}
        />
      </main>
    </div>
  );
}