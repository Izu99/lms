"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Timer,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Zap,
  Loader2,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';
import { getFileUrl } from '@/lib/fileUtils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PayHereButton } from "@/components/payment/PayHereButton";

interface Option {
  _id: string;
  optionText: string;
  imageUrl?: string;
}

interface Question {
  _id: string;
  questionText: string;
  imageUrl?: string;
  options: Option[];
}

interface Paper {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  totalQuestions: number;
  deadline: string;
  questions: Question[];
}

interface User {
  _id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
}

function PaperAttemptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const paperId = pathname.split('/').pop();

  // Show success toast after payment redirect
  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') {
      toast.success("Payment Successful!", {
        description: "You now have full access to this paper.",
        duration: 5000,
      });
      // Clean up URL without refreshing
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  // State management
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [paymentRequiredError, setPaymentRequiredError] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ price: number; paperTitle: string; paperId: string } | null>(null);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get<{ user: User }>(`${API_URL}/auth/me`, { headers });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const getTimeWarningLevel = useCallback(() => {
    if (!paper) return "safe";
    const tenPercent = paper.timeLimit * 60 * 0.1;
    const thirtyPercent = paper.timeLimit * 60 * 0.3;
    if (timeLeft <= tenPercent) return "critical";
    if (timeLeft <= thirtyPercent) return "warning";
    return "safe";
  }, [timeLeft, paper]);

  const getTimeWarningStyle = useCallback(() => {
    const level = getTimeWarningLevel();
    switch (level) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-500/50";
      case "warning":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-500/50";
      default:
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-500/50";
    }
  }, [getTimeWarningLevel]);

  const showTimeWarning = useCallback(() => {
    const level = getTimeWarningLevel();
    if (level === "critical") return "CRITICAL: Less than 10% of time remaining!";
    if (level === "warning") return "WARNING: Less than 30% of time remaining!";
    return null;
  }, [getTimeWarningLevel]);

  const autoSave = useCallback(async () => {
    // This is a placeholder for now. In a real scenario, this would post to an endpoint.
    if (!started || Object.keys(answers).length === 0) return;
    try {
      setAutoSaving(true);
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem(`paper-progress-${paperId}`, JSON.stringify(answers));
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [started, answers, paperId]);

  const confirmSubmit = async () => {
    setSubmitDialogOpen(false);
    await handleSubmit(true);
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit) {
      setSubmitDialogOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      const headers = getAuthHeaders();
      const submissionData = {
        answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId
        })),
        timeSpent: paper ? paper.timeLimit - Math.floor(timeLeft / 60) : 0
      };

      const response = await axios.post(
        `${API_URL}/papers/${paperId}/submit`,
        submissionData,
        { headers }
      );

      const attempt = response.data.attempt;

      if (attempt) {
        toast.success(`Paper Submitted!`, {
          description: `Score: ${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%)`,
        });
      } else {
        toast.success(autoSubmit ? `Time's up! Paper submitted automatically.` : `Paper submitted successfully!`);
      }

      router.push('/student/papers/results');
    } catch (error) {
      console.error("Error submitting paper:", error);
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to submit paper";
      toast.error("Submission Failed", { description: errorMessage });
    } finally {
      setSubmitting(false);
      localStorage.removeItem(`paper-progress-${paperId}`);
    }
  }, [answers, paper, timeLeft, paperId, router]);

  const fetchPaper = useCallback(async () => {
    if (!paperId || !/^[0-9a-fA-F]{24}$/.test(paperId)) {
      setError("Invalid paper ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get<{ paper: Paper }>(`${API_URL}/papers/${paperId}`, { headers });

      if (!response.data.paper) {
        setError("Paper data not found.");
        return;
      }

      setPaper(response.data.paper);
      setTimeLeft(response.data.paper.timeLimit * 60);

      // Load progress from local storage
      const savedProgress = localStorage.getItem(`paper-progress-${paperId}`);
      if (savedProgress) {
        setAnswers(JSON.parse(savedProgress));
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 402) {
        setPaymentRequiredError(true);
        setPaymentDetails(error.response.data);
        setError("Payment required to access this paper.");
      } else {
        console.error("Error fetching paper:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message?.includes('already attempted')) {
            toast.info('You have already attempted this paper. Redirecting to your results...');
            router.push('/student/papers/results');
          } else {
            setError(error.response?.data?.message || "Failed to load paper.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [paperId, router]);

  const handleAnswerChange = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < (paper?.questions.length || 0)) {
      setCurrentQuestion(index);
    }
  }, [paper?.questions.length]);

  const startPaper = useCallback(() => {
    setStarted(true);
    setCurrentQuestion(0);
  }, []);

  const isExpired = useCallback(() => {
    return paper && new Date() > new Date(paper.deadline);
  }, [paper]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          if (prev % 30 === 0) {
            autoSave();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft, handleSubmit, autoSave]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (started && Object.keys(answers).length > 0) {
        autoSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [answers, started, autoSave]);

  useEffect(() => {
    if (paperId && user) {
      fetchPaper();
    }
  }, [paperId, user, fetchPaper]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = paper?.questions.length || 0;
  const currentQuestionData = paper?.questions[currentQuestion];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading Paper...</p>
        </div>
      </div>
    );
  }

  if (paymentRequiredError && paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-yellow-600 dark:text-yellow-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To access <span className="font-semibold text-blue-600">"{paymentDetails.paperTitle}"</span>, a payment of <span className="font-bold">LKR {paymentDetails.price?.toFixed(2)}</span> is required.
          </p>
          
          <PayHereButton
            itemId={paymentDetails.paperId}
            itemModel="Paper"
            amount={paymentDetails.price}
            title={paymentDetails.paperTitle}
            className="w-full mb-4 h-12 text-lg"
          />

          <Link href="/student/papers" className="block">
            <Button variant="ghost" className="w-full">
              Back to Papers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-500/20 dark:border-red-500/30">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Paper</h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <Link href="/student/papers">
            <Button variant="destructive">Back to Papers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600 dark:text-blue-400" size={40} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{paper.title}</h1>
              {paper.description && (
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">{paper.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <User className="text-blue-600 dark:text-blue-400 mx-auto mb-2" size={28} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Questions</h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl">{paper.totalQuestions}</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <Timer className="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" size={28} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Time Limit</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">{paper.timeLimit} mins</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <Calendar className="text-orange-600 dark:text-orange-400 mx-auto mb-2" size={28} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Due Date</h3>
                <p className="text-orange-600 dark:text-orange-400 font-bold text-2xl">
                  {new Date(paper.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg p-6 mb-8">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-3 text-lg">
                <AlertTriangle /> Important Instructions
              </h3>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                <li>You can navigate between questions using Next/Previous buttons.</li>
                <li>Your answers are automatically saved as you go.</li>
                <li>This paper can only be submitted once.</li>
                <li>The paper will auto-submit when the timer runs out.</li>
                <li>You'll get warnings when time is running low. Good luck!</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/student/papers" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-12 text-lg">
                  <ArrowLeft size={20} className="mr-2" /> Back
                </Button>
              </Link>
              {!isExpired() ? (
                <Button onClick={startPaper} size="lg" className="w-full sm:flex-1 h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Zap size={20} className="mr-2" /> Start Paper
                </Button>
              ) : (
                <div className="w-full sm:flex-1 text-center font-semibold py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  This paper has expired.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-lg border p-4 sticky top-4 z-20 ${getTimeWarningStyle()}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl font-bold">{paper.title}</h1>
                <div className="flex items-center gap-4">
                  {autoSaving ? (
                    <div className="flex items-center gap-1 text-sm"><Loader2 size={14} className="animate-spin" /> Saving...</div>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-1 text-sm"><CheckCircle size={14} /> Saved</div>
                  ) : null}
                  <div className={`flex items-center gap-2 font-bold text-2xl ${getTimeWarningLevel() === 'critical' ? 'animate-pulse' : ''}`}>
                    <Clock size={24} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {showTimeWarning() && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                    <div className="p-2 bg-white/50 dark:bg-black/20 rounded-md text-center text-sm font-semibold">
                      <Zap size={14} className="inline mr-2 animate-pulse" /> {showTimeWarning()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-1 lg:sticky top-32">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {paper.questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center ${currentQuestion === index
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500'
                          : answers[paper.questions[index]._id]
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/60'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {currentQuestionData && (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
                    >
                      <div className="p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{currentQuestion + 1}</span>
                          </div>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                            {currentQuestionData.questionText}
                          </p>
                        </div>

                        {currentQuestionData.imageUrl && (
                          <div className="mt-6 flex justify-center">
                            <div className="relative p-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                              <img
                                src={getFileUrl(currentQuestionData.imageUrl, 'image')}
                                alt="Question illustration"
                                className="rounded-lg max-w-full h-auto max-h-[400px] object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700/50">
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-5 text-lg">Select the correct answer</h3>
                        <div className="space-y-4">
                          {currentQuestionData.options.map((option, optionIndex) => (
                            <motion.label
                              key={option._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: optionIndex * 0.1 }}
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${answers[currentQuestionData._id] === option._id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                                }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuestionData._id}`}
                                value={option._id}
                                checked={answers[currentQuestionData._id] === option._id}
                                onChange={() => handleAnswerChange(currentQuestionData._id, option._id)}
                                className="sr-only" // Hide the default radio button
                              />
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 transition-colors ${answers[currentQuestionData._id] === option._id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                {optionIndex + 1}
                              </div>
                              <div className="flex-1 text-gray-800 dark:text-gray-200 text-lg font-medium">
                                {option.imageUrl ? (
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={getFileUrl(option.imageUrl, 'image')}
                                      alt={`Option ${optionIndex + 1}`}
                                      className="rounded-md h-16 w-16 object-cover bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700"
                                    />
                                    {option.optionText && <span>{option.optionText}</span>}
                                  </div>
                                ) : (
                                  option.optionText
                                )}
                              </div>
                              {answers[currentQuestionData._id] === option._id && (
                                <CheckCircle className="text-blue-500 flex-shrink-0" size={28} />
                              )}
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <Button
                          variant="outline"
                          onClick={() => goToQuestion(currentQuestion - 1)}
                          disabled={currentQuestion === 0}
                          className="h-11 px-6 text-base"
                        >
                          <ChevronLeft size={18} className="mr-2" /> Previous
                        </Button>
                        <Button
                          onClick={() => goToQuestion(currentQuestion + 1)}
                          disabled={currentQuestion === totalQuestions - 1}
                          className="h-11 px-6 text-base bg-blue-600 hover:bg-blue-700"
                        >
                          Next <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to Submit?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    You have answered {answeredCount} of {totalQuestions} questions.
                  </p>
                </div>
                <Button
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-lg"
                >
                  {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : "Finish & Submit Paper"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {totalQuestions} questions. Unanswered questions will be marked as incorrect. You cannot change your answers after submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Confirm & Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PaperAttempt() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <PaperAttemptContent />
    </Suspense>
  );
}
