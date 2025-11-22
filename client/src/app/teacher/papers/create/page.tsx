"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { InfoDialog } from "@/components/InfoDialog";
import { toast } from "sonner";

interface Option {
  optionText: string;
  isCorrect: boolean;
  imageUrl?: string;
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
  explanation?: Explanation;
}

export default function CreatePaperPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [availability, setAvailability] = useState('all');
  const [price, setPrice] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const [paperType, setPaperType] = useState("MCQ");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  
  const questionsRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

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
        { optionText: "", isCorrect: true, imageUrl: "" },
        { optionText: "", isCorrect: false, imageUrl: "" },
        { optionText: "", isCorrect: false, imageUrl: "" },
        { optionText: "", isCorrect: false, imageUrl: "" },
        { optionText: "", isCorrect: false, imageUrl: "" },
      ],
      open: true,
      imageUrl: "",
      explanation: { text: "", imageUrl: "" }
    };
    
    setQuestions([...questions, newQuestion]);
    
    setTimeout(() => {
      const questionElements = document.querySelectorAll('[data-question-index]');
      const lastQuestion = questionElements[questionElements.length - 1];
      lastQuestion?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleImageUpload = async (qIndex: number, files: FileList | null, type: 'question' | 'explanation' | 'option', oIndex?: number) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    const uploadKey = `${qIndex}-${type}${oIndex !== undefined ? `-${oIndex}` : ''}`;
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
      } else if (type === 'question') {
        newQuestions[qIndex].imageUrl = response.data.imageUrl;
      } else if (type === 'option' && oIndex !== undefined) {
        newQuestions[qIndex].options[oIndex].imageUrl = response.data.imageUrl;
        newQuestions[qIndex].options[oIndex].optionText = "";
      }
      setQuestions(newQuestions);
      if (type === 'option' && oIndex !== undefined) {
        toast.success(`Option ${String.fromCharCode(65 + oIndex)} image uploaded successfully!`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(`Failed to upload ${type} image`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeImage = (qIndex: number, type: 'question' | 'explanation' | 'option', oIndex?: number) => {
    const newQuestions = [...questions];
    if (type === 'explanation') {
      if (newQuestions[qIndex].explanation) {
        newQuestions[qIndex].explanation!.imageUrl = "";
      }
    } else if (type === 'question') {
      newQuestions[qIndex].imageUrl = "";
    } else if (type === 'option' && oIndex !== undefined) {
      newQuestions[qIndex].options[oIndex].imageUrl = "";
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
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
        (_, i) => i !== oIndex
      );
      setQuestions(newQuestions);
    }
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].optionText = value;
    if (value.trim() !== "") {
      newQuestions[qIndex].options[oIndex].imageUrl = "";
    }
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

  const handlePdfUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setPdfFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const token = localStorage.getItem('token');
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        };

        const response = await axios.post(`${API_URL}/papers/upload`, formData, { headers });
        setPdfUrl(response.data.fileUrl);
    } catch (error) {
        console.error("Error uploading PDF:", error);
        setError("Failed to upload PDF");
    }
  };

  const validateForm = () => {
    if (!title.trim()) return "Paper title is required.";
    if (questions.length === 0) return "At least one question is required.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} text is required.`;
      if (q.options.length < 2) return `Question ${i + 1} must have at least two options.`;
      if (q.options.some(opt => !opt.optionText.trim() && !opt.imageUrl)) {
        return `All options for Question ${i + 1} must have either text or an image.`;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        return `A correct answer must be selected for Question ${i + 1}.`;
      }
    }
    return "";
  };

  const handleSubmit = async () => {
    if (paperType === "MCQ") {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
    } else {
        if (!title.trim()) {
            setError("Paper title is required.");
            return;
        }
        if (!pdfUrl) {
            setError("Please upload a PDF file for the paper.");
            return;
        }
    }
    setError("");

    try {
        setSubmitting(true);
        const headers = getAuthHeaders();
        let paperData;

        if (paperType === "MCQ") {
            paperData = {
                title,
                description,
                deadline: deadline || undefined,
                timeLimit: timeLimit > 0 ? timeLimit : undefined,
                availability,
                price,
                paperType: "MCQ",
                questions: questions.map(({ questionText, options, imageUrl, explanation }) => ({
                    questionText,
                    options,
                    imageUrl,
                    explanation: explanation && (explanation.text || explanation.imageUrl) ? explanation : undefined
                })),
            };
        } else {
            paperData = {
                title,
                description,
                deadline: deadline || undefined,
                timeLimit: timeLimit > 0 ? timeLimit : undefined,
                availability,
                price,
                paperType: "Structure",
                fileUrl: pdfUrl,
            };
        }

        await axios.post(`${API_URL}/papers`, paperData, { headers });

        toast.success("Paper created successfully! Students can now access and attempt this paper.");
        router.push("/teacher/papers");

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

  return (
    <TeacherLayout>
      <div ref={topRef}>
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
                <h1 className="text-4xl font-bold text-foreground">Create New Paper</h1>
                <p className="text-muted-foreground text-lg">Design and build your examination paper with detailed explanations</p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="shadow-md" onClick={() => router.push("/teacher/papers")}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Papers
            </Button>
          </div>

          {/* Paper Details Form */}
          <motion.div 
            className="bg-card rounded-3xl shadow-xl border border-border p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-primary" />
              </div>
              Paper Details
            </h2>
            <div className="mb-8">
                <label className="font-semibold text-foreground mb-3 block text-lg">Paper Type</label>
                <Select value={paperType} onValueChange={setPaperType}>
                    <SelectTrigger className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl">
                        <SelectValue placeholder="Select paper type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MCQ">Multiple Choice Questions (MCQ)</SelectItem>
                        <SelectItem value="Structure">Structured/Essay Paper (PDF Upload)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="font-semibold text-foreground mb-3 block text-lg">Paper Title</label>
                <Input
                  placeholder="e.g., Mid-Term ICT Examination - Database Systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="font-semibold text-foreground mb-3 block text-lg">Description (Optional)</label>
                <Textarea
                  placeholder="A brief summary of the paper's content and topics covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                />
              </div>
              {/* Deadline */}
              <div>
                <label className="font-semibold text-foreground mb-3 flex items-center gap-2 text-lg">
                  <Calendar size={20} className="text-primary" /> Deadline
                </label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                />
              </div>
              {/* Time Limit */}
              <div>
                <label className="font-semibold text-foreground mb-3 flex items-center gap-2 text-lg">
                  <Clock size={20} className="text-primary" /> Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                  min="0"
                />
              </div>
              {/* Availability */}
              <div>
                <label className="font-semibold text-foreground mb-3 flex items-center gap-2 text-lg">
                  <FileText size={20} className="text-primary" /> Availability
                </label>
                <Select
                  value={availability}
                  onValueChange={(value) => setAvailability(value)}
                >
                  <SelectTrigger className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Free for all</SelectItem>
                    <SelectItem value="physical">Free for physical only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Price */}
              <div>
                <label className="font-semibold text-foreground mb-3 flex items-center gap-2 text-lg">
                  <FileText size={20} className="text-primary" /> Price (LKR)
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Enter price (e.g., 1500)"
                  min="0"
                  className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                />
              </div>
            </div>
          </motion.div>

          {paperType === "MCQ" && (
            <>
              {/* Questions Builder */}
              <motion.div 
                className="bg-card rounded-3xl shadow-xl border border-border p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                ref={questionsRef}
              >
                {/* Info Banner */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ImageIcon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Answer Format Guide</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Each answer option can be <strong>either text OR an image</strong> (not both). This is perfect for:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4">
                        <li>• <strong>Text answers:</strong> Regular MCQ questions with written options</li>
                        <li>• <strong>ICT related answers:</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <ListOrdered size={20} className="text-green-500" />
                    </div>
                    Questions Builder
                    <span className="text-lg font-normal text-muted-foreground">({questions.length} questions)</span>
                  </h2>
                  <div className="flex gap-3">
                    {questions.length > 0 && (
                      <Button onClick={scrollToTop} variant="outline" size="lg" className="border-muted text-muted-foreground">
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
                    className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <ListOrdered size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No questions added yet</h3>
                    <p className="text-muted-foreground mb-6">Click &quot;Add Question&quot; to start building your paper with detailed explanations</p>
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
                          className="border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: qIndex * 0.1 }}
                        >
                          <div 
                            className="bg-muted/50 p-6 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => toggleQuestion(qIndex)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                                {qIndex + 1}
                              </div>
                              <div>
                                <h3 className="font-bold text-foreground text-lg">
                                  Question {qIndex + 1}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {q.questionText ? q.questionText.substring(0, 50) + (q.questionText.length > 50 ? '...' : '') : 'Click to add question text'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{q.options.length} options</span>
                                {q.explanation?.text && <BookOpen size={16} className="text-green-500" />}
                                {q.explanation?.imageUrl && <ImageIcon size={16} className="text-blue-500" />}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeQuestion(qIndex);
                                }}
                                className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </Button>
                              <div className="text-muted-foreground">
                                {q.open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {q.open && (
                              <motion.div 
                                className="p-8 space-y-8 bg-card"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Question Text */}
                                <div>
                                  <label className="font-semibold text-foreground mb-3 block text-lg">Question Text</label>
                                  <Textarea
                                    placeholder={`Enter the question text for question ${qIndex + 1}...`}
                                    value={q.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="text-lg min-h-[120px] bg-background text-foreground border-border focus:border-primary rounded-xl"
                                  />
                                </div>

                                {/* Question Image Upload */}
                                <div>
                                  <label className="font-semibold text-foreground mb-3 block text-lg flex items-center gap-2">
                                    <ImageIcon size={20} className="text-primary" />
                                    Question Image (Optional)
                                  </label>
                                  <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-primary transition-colors bg-background">
                                    {q.imageUrl ? (
                                      <div className="relative">
                                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center">
                                          <img 
                                            src={`${API_BASE_URL}${q.imageUrl}`} 
                                            alt="Question preview" 
                                            className="rounded-lg max-h-64 max-w-full object-contain shadow-lg" 
                                          />
                                        </div>
                                        <Button
                                          variant="destructive"
                                          size="icon"
                                          className="absolute top-2 right-2 shadow-lg"
                                          onClick={() => removeImage(qIndex, 'question')}
                                        >
                                          <X size={16} />
                                        </Button>
                                        <div className="mt-3 text-center text-sm font-medium text-green-600 dark:text-green-400">
                                          ✓ Image loaded successfully
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                          {uploadingImages[`${qIndex}-question`] ? (
                                            <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <Upload size={28} className="text-primary" />
                                          )}
                                        </div>
                                        <p className="text-base font-medium text-foreground mb-3">
                                          Upload Question Image
                                        </p>
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(qIndex, e.target.files, 'question')}
                                          className="max-w-xs mx-auto bg-card text-foreground border-border h-11"
                                          disabled={uploadingImages[`${qIndex}-question`]}
                                        />
                                        <p className="text-sm text-muted-foreground mt-3">
                                          Add diagrams, charts, or visual context for this question
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Options - NEW DESIGN */}
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <label className="font-semibold text-foreground text-lg">Answer Options</label>
                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                                          <FileText size={12} />
                                          Text
                                        </div>
                                        <span className="text-muted-foreground text-xs font-bold">OR</span>
                                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-md text-xs">
                                          <ImageIcon size={12} />
                                          Image
                                        </div>
                                        <span className="text-muted-foreground text-xs ml-1">(not both)</span>
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => addOption(qIndex)}
                                      variant="outline"
                                      size="sm"
                                      disabled={q.options.length >= 6}
                                      className="border-muted text-muted-foreground"
                                    >
                                      <Plus size={16} className="mr-1" />
                                      Add Option
                                    </Button>
                                  </div>
                                  <div className="space-y-3">
                                    {q.options.map((opt, oIndex) => (
                                      <motion.div 
                                        key={oIndex}
                                        className={`relative border-2 rounded-xl transition-all ${
                                          opt.isCorrect
                                            ? "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md"
                                            : "border-border bg-background hover:border-primary/50"
                                        }`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: oIndex * 0.1 }}
                                      >
                                        {/* Correct Answer Badge */}
                                        {opt.isCorrect && (
                                          <div className="absolute -top-3 left-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                                            <Check size={12} />
                                            Correct Answer
                                          </div>
                                        )}

                                        <div className="flex items-start gap-3 p-4">
                                          {/* Option Letter */}
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                                            opt.isCorrect
                                              ? "bg-green-500 text-white"
                                              : "bg-muted text-muted-foreground"
                                          }`}>
                                            {String.fromCharCode(65 + oIndex)}
                                          </div>

                                          {/* Content Area */}
                                          <div className="flex-1 space-y-3">
                                            {/* Text Input */}
                                            {!opt.imageUrl && (
                                              <div>
                                                <Input
                                                  placeholder={`Enter text for option ${String.fromCharCode(65 + oIndex)}`}
                                                  value={opt.optionText}
                                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                  className="text-base h-11 bg-card text-foreground border-border focus:border-primary"
                                                />
                                              </div>
                                            )}

                                            {/* Image Upload Area */}
                                            {!opt.optionText && (
                                              <div className="border-2 border-dashed border-border rounded-lg overflow-hidden">
                                                {opt.imageUrl ? (
                                                  <div className="relative bg-muted/30 p-4">
                                                    <div className="flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg p-3">
                                                      <img 
                                                        src={`${API_BASE_URL}${opt.imageUrl}`} 
                                                        alt={`Option ${String.fromCharCode(65 + oIndex)} preview`}
                                                        className="rounded-md max-h-32 max-w-full object-contain shadow-md" 
                                                      />
                                                    </div>
                                                    <Button
                                                      variant="destructive"
                                                      size="sm"
                                                      className="absolute top-2 right-2 h-8 w-8 p-0 shadow-lg"
                                                      onClick={() => removeImage(qIndex, 'option', oIndex)}
                                                    >
                                                      <X size={14} />
                                                    </Button>
                                                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
                                                      <ImageIcon size={14} />
                                                      Image uploaded successfully
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                      {uploadingImages[`${qIndex}-option-${oIndex}`] ? (
                                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                      ) : (
                                                        <ImageIcon size={24} className="text-primary" />
                                                      )}
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground mb-2">
                                                      Upload Image Answer
                                                    </p>
                                                    <Input
                                                      type="file"
                                                      accept="image/*"
                                                      onChange={(e) => handleImageUpload(qIndex, e.target.files, 'option', oIndex)}
                                                      className="max-w-[220px] text-sm mx-auto h-10 bg-card cursor-pointer"
                                                      disabled={uploadingImages[`${qIndex}-option-${oIndex}`]}
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-3">
                                                      For diagrams, charts, symbols, or visual answers
                                                    </p>
                                                  </div>
                                                )}
                                              </div>
                                            )}

                                            {/* Type Indicator */}
                                            {(opt.optionText || opt.imageUrl) && (
                                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                {opt.optionText && (
                                                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                                                    <FileText size={12} />
                                                    Text answer
                                                  </div>
                                                )}
                                                {opt.imageUrl && (
                                                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full">
                                                    <ImageIcon size={12} />
                                                    Image answer
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="flex flex-col gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setCorrectOption(qIndex, oIndex)}
                                              className={`h-9 px-3 transition-all ${
                                                opt.isCorrect
                                                  ? "bg-green-500 text-white hover:bg-green-600"
                                                  : "hover:bg-green-500/10 hover:text-green-600"
                                              }`}
                                              title="Mark as correct answer"
                                            >
                                              <Check size={16} />
                                            </Button>
                                            {q.options.length > 2 && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                                className="h-9 px-3 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                                title="Remove option"
                                              >
                                                <Trash2 size={16} />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>

                                {/* Detailed Explanation (විවරණ) */}
                                <div className="border-t border-border pt-8">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                      <BookOpen size={20} className="text-amber-500" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-foreground text-lg">Detailed Explanation (විවරණ)</h3>
                                      <p className="text-sm text-muted-foreground">Optional: Help students understand how to get the correct answer</p>
                                    </div>
                                  </div>
                                  
                                  {/* Explanation Text */}
                                  <div className="mb-6">
                                    <label className="font-medium text-foreground mb-2 block">Explanation Text</label>
                                    <Textarea
                                      placeholder="Explain the reasoning behind the correct answer, provide step-by-step solution, or give additional context..."
                                      value={q.explanation?.text || ""}
                                      onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                                      className="min-h-[100px] bg-background text-foreground border-border focus:border-amber-500 rounded-xl"
                                    />
                                  </div>

                                  {/* Explanation Image */}
                                  <div>
                                    <label className="font-medium text-foreground mb-2 block flex items-center gap-2">
                                      <ImageIcon size={16} className="text-amber-500" />
                                      Explanation Image (Optional)
                                    </label>
                                    <div className="border-2 border-dashed border-amber-500/30 rounded-xl p-5 hover:border-amber-500 transition-colors bg-amber-500/5">
                                      {q.explanation?.imageUrl ? (
                                        <div className="relative">
                                          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center">
                                            <img 
                                              src={`${API_BASE_URL}${q.explanation.imageUrl}`} 
                                              alt="Explanation preview" 
                                              className="rounded-lg max-h-56 max-w-full object-contain shadow-lg" 
                                            />
                                          </div>
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 shadow-lg"
                                            onClick={() => removeImage(qIndex, 'explanation')}
                                          >
                                            <X size={16} />
                                          </Button>
                                          <div className="mt-3 text-center text-sm font-medium text-amber-600 dark:text-amber-400">
                                            ✓ Explanation image loaded
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center">
                                          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            {uploadingImages[`${qIndex}-explanation`] ? (
                                              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                              <Upload size={24} className="text-amber-500" />
                                            )}
                                          </div>
                                          <p className="text-sm font-medium text-foreground mb-2">
                                            Upload Visual Explanation
                                          </p>
                                          <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(qIndex, e.target.files, 'explanation')}
                                            className="max-w-xs mx-auto bg-card text-foreground border-border h-10"
                                            disabled={uploadingImages[`${qIndex}-explanation`]}
                                          />
                                          <p className="text-xs text-muted-foreground mt-2">
                                            Add step-by-step diagrams, worked solutions, or visual aids
                                          </p>
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
            </>
          )}

          {paperType === "Structure" && (
            <motion.div
                className="bg-card rounded-3xl shadow-xl border border-border p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Upload size={20} className="text-purple-500" />
                    </div>
                    Upload Paper PDF
                </h2>
                <div className="border-border border-dashed rounded-xl p-6 hover:border-primary transition-colors bg-background">
                    {pdfUrl ? (
                        <div className="relative">
                            <p className="text-lg font-semibold text-green-600">PDF uploaded successfully!</p>
                            <p className="text-muted-foreground">{pdfFile?.name}</p>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                    setPdfFile(null);
                                    setPdfUrl("");
                                }}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Upload size={24} className="text-primary" />
                            </div>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handlePdfUpload(e.target.files)}
                                className="max-w-xs mx-auto bg-card text-foreground border-border"
                            />
                            <p className="text-sm text-muted-foreground mt-2">Upload the paper in PDF format.</p>
                        </div>
                    )}
                </div>
            </motion.div>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 bg-red-100 border-l-4 border-red-500 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-red-800">Validation Error</h3>
                    <p className="text-red-700">{error}</p>
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
              disabled={submitting || (paperType === 'MCQ' && questions.length === 0) || (paperType === 'Structure' && !pdfUrl)}
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
      </div>
    </TeacherLayout>
  );
}