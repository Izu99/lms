"use client";

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';
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

interface Option {
  _id: string;
  optionText: string;
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

interface PaperAttemptPageProps {
  params: {
    id: string;
  };
}

export default function PaperAttempt({ params }: PaperAttemptPageProps) {
  const router = useRouter();
  const paperId = params.id;

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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get time warning level
  const getTimeWarningLevel = useCallback(() => {
    if (timeLeft <= 60) return "critical";
    if (timeLeft <= 300) return "warning";
    if (timeLeft <= 600) return "caution";
    return "safe";
  }, [timeLeft]);

  // Get time warning style
  const getTimeWarningStyle = useCallback(() => {
    const level = getTimeWarningLevel();
    switch (level) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 animate-pulse";
      case "warning":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "caution":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    }
  }, [getTimeWarningLevel]);

  // Time warning notifications
  const showTimeWarning = useCallback(() => {
    const level = getTimeWarningLevel();
    if (level === "critical") return "⚠️ CRITICAL: Less than 1 minute remaining!";
    if (level === "warning") return "⚠️ WARNING: Less than 5 minutes remaining!";
    if (level === "caution") return "⚠️ CAUTION: Less than 10 minutes remaining!";
    return null;
  }, [getTimeWarningLevel]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!started || Object.keys(answers).length === 0) return;
    try {
      setAutoSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [started, answers]);

  // Confirm submit
  const confirmSubmit = async () => {
    setSubmitDialogOpen(false);
    await handleSubmit(true);
  };

  // Handle submit
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

      console.log('Submit response:', response.data);
      
      // Backend returns 'attempt' not 'result'
      const attempt = response.data.attempt;
      
      if (attempt) {
        const resultMessage = autoSubmit
          ? `⏰ Time&apos;s up! Paper submitted automatically.\n\n✅ Score: ${attempt.score}/${attempt.totalQuestions}\n📊 Percentage: ${attempt.percentage}%\n⏱️ Time Used: ${attempt.timeSpent} minutes`
          : `🎉 Paper submitted successfully!\n\n✅ Score: ${attempt.score}/${attempt.totalQuestions}\n📊 Percentage: ${attempt.percentage}%\n⏱️ Time Used: ${attempt.timeSpent} minutes`;

        toast.info(resultMessage);
      } else {
        toast.success(autoSubmit ? '⏰ Time\'s up! Paper submitted automatically.' : '🎉 Paper submitted successfully!');
      }
      
      router.push('/student/papers/results');
    } catch (error) {
      console.error("Error submitting paper:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        const errorMessage = error.response?.data?.message || "Failed to submit paper";
        toast.error(`Failed to submit paper: ${errorMessage}`);
      } else {
        toast.error("Failed to submit paper. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }, [answers, paper, timeLeft, paperId, router]);

  // Fetch paper
  const fetchPaper = useCallback(async () => {
    if (!paperId) {
      setError("Paper ID is missing.");
      setLoading(false);
      return;
    }

    // Validate MongoDB ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(paperId)) {
      setError("Invalid paper ID format.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = getAuthHeaders();
      console.log('Fetching paper:', paperId);
      const response = await axios.get<{ paper: Paper }>(`${API_URL}/papers/${paperId}`, { headers });
      console.log('Paper response:', response.data);
      
      if (!response.data.paper) {
        setError("Paper data not found in response.");
        return;
      }
      
      setPaper(response.data.paper);
      setTimeLeft(response.data.paper.timeLimit * 60);
    } catch (error) {
      console.error("Error fetching paper:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        const errorMessage = error.response?.data?.message;
        
        // If already attempted, redirect to results
        if (errorMessage && errorMessage.includes('already attempted')) {
          toast.info('You have already attempted this paper. Redirecting to your results...');
          router.push('/student/papers/results');
          return;
        }
        
        // If invalid ID, show friendly message
        if (errorMessage && errorMessage.includes('Invalid paper ID')) {
          setError("This paper link is invalid. Please check the URL.");
          return;
        }
        
        setError(errorMessage || "Failed to load paper.");
      } else {
        setError("Failed to load paper.");
      }
    } finally {
      setLoading(false);
    }
  }, [paperId, router]);

  // Handle answer change
  const handleAnswerChange = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, []);

  // Go to question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < (paper?.questions.length || 0)) {
      setCurrentQuestion(index);
    }
  }, [paper?.questions.length]);

  // Start paper
  const startPaper = useCallback(() => {
    setStarted(true);
    setCurrentQuestion(0);
  }, []);

  // Check if expired
  const isExpired = useCallback(() => {
    return paper && new Date() > new Date(paper.deadline);
  }, [paper]);

  // Timer effect
  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
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

  // Auto-save when answer changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (started && Object.keys(answers).length > 0) {
        autoSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [answers, started, autoSave]);

  // Fetch paper on mount
  useEffect(() => {
    if (paperId && user) {
      fetchPaper();
    }
  }, [paperId, user, fetchPaper]);

  // Calculate stats
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = paper?.questions.length || 0;
  const currentQuestionData = paper?.questions[currentQuestion];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Paper</h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/student/papers">
            <Button>Back to Papers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!started ? (
          /* Pre-start Instructions */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{paper.title}</h1>
              {paper.description && (
                <p className="text-gray-600 dark:text-gray-400 text-lg">{paper.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <User className="text-blue-600 dark:text-blue-400 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Questions</h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-xl">{paper.totalQuestions}</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <Timer className="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Time Limit</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">{paper.timeLimit} mins</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <Calendar className="text-orange-600 dark:text-orange-400 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900 dark:text-white">Due Date</h3>
                <p className="text-orange-600 dark:text-orange-400 font-bold text-xl">
                  {new Date(paper.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Important Instructions
              </h3>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-400">
                <li>• You can navigate between questions using Next/Previous buttons</li>
                <li>• Your answers are automatically saved every few seconds</li>
                <li>• You can only submit this paper once</li>
                <li>• The paper will auto-submit when time runs out</li>
                <li>• You&apos;ll get warnings when time is running low</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link href="/student/papers" className="flex-1">
                <Button variant="outline" className="w-full h-12">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Papers
                </Button>
              </Link>
              {!isExpired() ? (
                <Button onClick={startPaper} className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Start Paper
                </Button>
              ) : (
                <div className="flex-1 text-center text-gray-600 dark:text-gray-400 font-medium py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  This paper is expired
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Paper Attempt Interface */
          <div className="space-y-6">
            {/* Timer and Progress Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-lg border p-4 sticky top-4 z-10 ${getTimeWarningStyle()}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{paper.title}</h1>
                  <span className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm font-medium rounded-full">
                    {answeredCount}/{totalQuestions} Answered
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {autoSaving ? (
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle size={12} />
                      <span>Saved</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <Clock size={20} className={getTimeWarningLevel() === "critical" ? "animate-pulse" : ""} />
                    <span className={`font-bold text-2xl ${getTimeWarningLevel() === "critical" ? "animate-pulse" : ""}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time warning notification */}
              <AnimatePresence>
                {showTimeWarning() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border-2 border-red-300 dark:border-red-700"
                  >
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium">
                      <Zap size={16} className="animate-pulse" />
                      <span>{showTimeWarning()}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Question Navigation and Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Navigator */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-32">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {paper.questions.map((question: Question, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentQuestion === index
                            ? 'bg-blue-600 text-white shadow-lg'
                            : answers[paper.questions[index]._id]
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Question */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {currentQuestionData && (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{currentQuestion + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed mb-4">
                            {currentQuestionData.questionText}
                          </h2>
                          {currentQuestionData.imageUrl && (
                            <div className="mb-4">
                              <img
                                src={`${API_BASE_URL}/api/uploads${currentQuestionData.imageUrl}`}
                                alt="Question image"
                                className="rounded-lg max-w-full h-auto max-h-96"
                              />
                            </div>
                          )}
                          <div className="space-y-3">
                            {currentQuestionData.options.map((option: Option, optionIndex: number) => (
                              <label
                                key={option._id}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                  answers[currentQuestionData._id] === option._id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-25 dark:hover:bg-blue-900/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${currentQuestionData._id}`}
                                  value={option._id}
                                  checked={answers[currentQuestionData._id] === option._id}
                                  onChange={() => handleAnswerChange(currentQuestionData._id, option._id)}
                                  className="w-5 h-5 text-blue-600"
                                />
                                <span className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="text-gray-900 dark:text-white flex-1 text-lg">{option.optionText}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {answers[currentQuestionData._id] && (
                          <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => goToQuestion(currentQuestion - 1)}
                          disabled={currentQuestion === 0}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </Button>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          Question {currentQuestion + 1} of {totalQuestions}
                        </span>
                        <Button
                          onClick={() => goToQuestion(currentQuestion + 1)}
                          disabled={currentQuestion === totalQuestions - 1}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          Next
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to Submit?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have answered {answeredCount} out of {totalQuestions} questions.
                  </p>
                  {answeredCount < totalQuestions && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        ⚠️ You haven&apos;t answered all questions. Unanswered questions will be marked as incorrect.
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold text-lg"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Paper"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Paper?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Paper
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
