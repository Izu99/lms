'use client';

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
  Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';

export default function PaperAttempt({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const paperId = resolvedParams.id;

  // State management
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [studentAttempt, setStudentAttempt] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/auth/me`, { headers });
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
    return {
      Authorization: `Bearer ${token}`
    };
  };

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get time warning level
  const getTimeWarningLevel = useCallback(() => {
    if (timeLeft <= 60) return "critical"; // 1 minute - red
    if (timeLeft <= 300) return "warning"; // 5 minutes - orange
    if (timeLeft <= 600) return "caution"; // 10 minutes - yellow
    return "safe"; // green/blue
  }, [timeLeft]);

  // Get time warning style
  const getTimeWarningStyle = useCallback(() => {
    const level = getTimeWarningLevel();
    switch (level) {
      case "critical":
        return "text-red-600 bg-red-100 animate-pulse";
      case "warning":
        return "text-orange-600 bg-orange-100";
      case "caution":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  }, [getTimeWarningLevel]);

  // Time warning notifications
  const showTimeWarning = useCallback(() => {
    const level = getTimeWarningLevel();
    if (level === "critical") {
      return "⚠️ CRITICAL: Less than 1 minute remaining!";
    } else if (level === "warning") {
      return "⚠️ WARNING: Less than 5 minutes remaining!";
    } else if (level === "caution") {
      return "⚠️ CAUTION: Less than 10 minutes remaining!";
    }
    return null;
  }, [getTimeWarningLevel]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!started || Object.keys(answers).length === 0 || isReviewMode) return;
    
    try {
      setAutoSaving(true);
      // In a real app, you'd save to a draft endpoint
      // For now, just simulate the save
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [started, answers, isReviewMode]);

  // Handle submit
  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit your paper? You cannot change your answers after submission."
      );
      if (!confirmSubmit) return;
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

      // Show result in a better modal-style alert
      const result = response.data.result;
      const resultMessage = autoSubmit 
        ? `⏰ Time's up! Paper submitted automatically.\n\n✅ Score: ${result.score}/${result.totalQuestions}\n📊 Percentage: ${result.percentage}%\n⏱️ Time Used: ${result.timeSpent} minutes`
        : `🎉 Paper submitted successfully!\n\n✅ Score: ${result.score}/${result.totalQuestions}\n📊 Percentage: ${result.percentage}%\n⏱️ Time Used: ${result.timeSpent} minutes`;
      
      alert(resultMessage);
      router.push('/papers/results/my-results');
      
    } catch (error) {
      console.error("Error submitting paper:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to submit paper");
      } else {
        setError("Failed to submit paper");
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
    try {
      setLoading(true);
      console.log("Fetching paper with ID:", paperId, "for user role:", user?.role);
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/papers/${paperId}`, { headers });
      setPaper(response.data.paper);
      setTimeLeft(response.data.paper.timeLimit * 60); // Convert to seconds
    } catch (error) {
      console.error("Error fetching paper:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (error.response?.status === 400) {
          if (errorMessage === 'Invalid paper ID') {
            setError('Invalid paper ID. Please check the URL.');
          } else if (errorMessage === 'You have already attempted this paper') {
            console.log("Attempted paper detected, redirecting to results.");
            setError('You have already attempted this paper. Please check your results.');
            router.push('/papers/results/my-results');
            return;
          } else {
            setError(errorMessage || "Failed to load paper due to a bad request.");
          }
        } else if (error.response?.status === 404) {
          setError('Paper not found.');
        } else {
          setError(errorMessage || "Failed to load paper.");
        }
      } else {
        setError("Failed to load paper due to a network error.");
      }
    } finally {
      setLoading(false);
    }
  }, [paperId, user?.role, router]);

  // Handle answer change
  const handleAnswerChange = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
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

  // Timer effect with auto-save and warnings
  useEffect(() => {
    if (started && timeLeft > 0 && !isReviewMode) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit(true); // Auto submit when time runs out
            return 0;
          }
          
          // Auto-save every 30 seconds
          if (prev % 30 === 0) {
            autoSave();
          }
          
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, timeLeft, isReviewMode, handleSubmit, autoSave]);

  // Auto-save when answer changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (started && Object.keys(answers).length > 0 && !isReviewMode) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [answers, isReviewMode, started, autoSave]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading paper...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border">
            <AlertTriangle className="text-red-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Paper</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/papers">
              <Button>Back to Papers</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar user={user} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{paper.title}</h1>
            <p className="text-gray-600 mb-6">Teachers cannot attempt papers. Use the results page to view submissions.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/papers">
                <Button variant="outline">Back to Papers</Button>
              </Link>
              <Link href={`/papers/${paper._id}/results`}>
                <Button>View Results</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!started ? (
          /* Pre-start Instructions */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{paper.title}</h1>
              {paper.description && (
                <p className="text-gray-600 text-lg">{paper.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <User className="text-blue-600 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900">Questions</h3>
                <p className="text-blue-600 font-bold text-xl">{paper.totalQuestions}</p>
              </div>
              
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <Timer className="text-emerald-600 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900">Time Limit</h3>
                <p className="text-emerald-600 font-bold text-xl">{paper.timeLimit} mins</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <Calendar className="text-orange-600 mx-auto mb-2" size={24} />
                <h3 className="font-semibold text-gray-900">Due Date</h3>
                <p className="text-orange-600 font-bold text-xl">
                  {new Date(paper.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Important Instructions
              </h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• You can navigate between questions using Next/Previous buttons</li>
                <li>• Your answers are automatically saved every few seconds</li>
                <li>• You can only submit this paper once</li>
                <li>• The paper will auto-submit when time runs out</li>
                <li>• You&apos;ll get warnings when time is running low</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link href="/papers" className="flex-1">
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
                <div className="flex-1 text-center text-gray-600 font-medium py-3 px-4 rounded-xl bg-gray-100 border border-gray-200">
                  This paper is expired. Answers are shown below.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Enhanced Paper Attempt Interface */
          <div className="space-y-6">
            {/* Enhanced Timer and Progress Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sticky top-4 z-10 ${getTimeWarningStyle()}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-gray-900">{paper.title}</h1>
                  <span className="px-3 py-1 bg-white/50 text-gray-800 text-sm font-medium rounded-full">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {answeredCount}/{totalQuestions} Answered
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Auto-save indicator */}
                  <div className="flex items-center gap-2 text-sm">
                    {autoSaving ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : lastSaved ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={12} />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="flex items-center gap-4">
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
                    className="mt-3 p-3 bg-white/80 rounded-lg border-2 border-red-300"
                  >
                    <div className="flex items-center gap-2 text-red-700 font-medium">
                      <Zap size={16} className="animate-pulse" />
                      <span>{showTimeWarning()}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Review Mode Header */}
            {isReviewMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center gap-3 text-blue-800">
                  <Eye size={20} />
                  <p className="font-semibold">
                    Review Mode: Correct answers are highlighted in green. Your answers (if any) are highlighted in red if incorrect.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Question Navigation Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sticky top-32">
                  <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {paper.questions.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentQuestion === index
                            ? 'bg-blue-600 text-white shadow-lg'
                            : answers[paper.questions[index]._id]
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
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
                      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">{currentQuestion + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed mb-4">
                            {currentQuestionData.questionText}
                          </h2>
                          {currentQuestionData.imageUrl && (
                            <div className="mb-4">
                              <img src={`${API_BASE_URL}${currentQuestionData.imageUrl}`} alt="Question image" className="rounded-lg max-w-full h-auto max-h-96" />
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            {currentQuestionData.options.map((option: any, optionIndex: number) => (
                              <label
                                key={option._id}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                                  // If in review mode
                                  isReviewMode
                                    ? // If this is the correct answer
                                      option.isCorrect
                                      ? 'border-green-500 bg-green-50'
                                      : // If this is the student's selected answer and it's incorrect
                                        studentAttempt?.answers.find((a: any) => a.questionId === currentQuestionData._id)?.selectedOptionId === option._id
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200' // Default for other options in review mode
                                    : // If not in review mode (i.e., actively taking the exam)
                                      answers[currentQuestionData._id] === option._id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                } ${isReviewMode ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${currentQuestionData._id}`}
                                  value={option._id}
                                  checked={answers[currentQuestionData._id] === option._id || (isReviewMode && studentAttempt?.answers.find((a: any) => a.questionId === currentQuestionData._id)?.selectedOptionId === option._id)}
                                  onChange={() => handleAnswerChange(currentQuestionData._id, option._id)}
                                  className="w-5 h-5 text-blue-600"
                                  disabled={isReviewMode}
                                />
                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="text-gray-900 flex-1 text-lg">
                                  {option.optionText}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {answers[currentQuestionData._id] && !isReviewMode && (
                          <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={() => goToQuestion(currentQuestion - 1)}
                          disabled={currentQuestion === 0}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </Button>

                        <span className="text-gray-600 text-sm">
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
            {!isReviewMode && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Submit?</h3>
                    <p className="text-gray-600">
                      You have answered {answeredCount} out of {totalQuestions} questions.
                    </p>
                    
                    {answeredCount < totalQuestions && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                        <p className="text-yellow-700 text-sm">
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}