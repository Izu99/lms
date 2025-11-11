'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';

interface Option {
  _id: string;
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  questionText: string;
  imageUrl?: string;
  options: Option[];
  explanation?: {
    text?: string;
    imageUrl?: string;
  };
}

interface Paper {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  questions: Question[];
}

interface User {
  _id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
}

interface StudentAttempt {
  _id: string;
  paperId: string;
  studentId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
}

export default function PaperAnswerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const paperId = resolvedParams.id;

  // State management
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [studentAttempt, setStudentAttempt] = useState<StudentAttempt | null>(null);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user...");
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No token found, redirecting to login.");
          router.push('/login');
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/auth/me`, { headers });
        console.log("User fetched successfully:", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push('/login');
      } finally {
        console.log("Finished fetching user, setting authLoading to false");
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

  // Fetch paper and attempt
  const fetchPaperAndAttempt = useCallback(async () => {
    console.log("Starting fetchPaperAndAttempt");
    if (!paperId) {
      console.error("Paper ID is missing.");
      setError("Paper ID is missing.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log(`Fetching data for paperId: ${paperId}`);
      const headers = getAuthHeaders();
      
      const [attemptResponse, paperResponse] = await Promise.all([
        axios.get<{ results: StudentAttempt[] }>(`${API_URL}/papers/results/my-results`, { headers }),
        axios.get<{ paper: Paper }>(`${API_URL}/papers/${paperId}?showAnswers=true`, { headers })
      ]);

      console.log("Data fetched successfully", { attemptResponse: attemptResponse.data, paperResponse: paperResponse.data });

      const attempt = attemptResponse.data.results?.find((a) => a.paperId && a.paperId._id === paperId);

      setPaper(paperResponse.data.paper);

      const isPaperExpired = new Date() > new Date(paperResponse.data.paper.deadline);

      if (attempt) {
        console.log("Attempt found", attempt);
        setStudentAttempt(attempt);
        if (attempt.answers) {
          const attemptAnswers: Record<string, string> = {};
          attempt.answers.forEach((ans) => {
            attemptAnswers[ans.questionId] = ans.selectedOptionId;
          });
          setAnswers(attemptAnswers);
        }
      } else if (!isPaperExpired) {
        console.log("Attempt not found for paperId and paper is not expired:", paperId);
        setError("You have not attempted this paper yet, and it is not yet expired.");
      } else {
        // Paper is expired, and no attempt found, but we still want to show answers
        console.log("Attempt not found for paperId, but paper is expired. Displaying answers.", paperId);
        // No error, just no studentAttempt data
      }

    } catch (error) {
      console.error("Error fetching paper or attempt:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (error.response?.status === 404) {
          setError('The paper you are looking for could not be found.');
        } else if (error.response?.status === 401) {
          setError("You are not authorized to view this page. Please log in again.");
          router.push('/login');
        }
        else {
          setError(errorMessage || "An error occurred while loading the paper data.");
        }
      } else if (error instanceof ReferenceError) {
        console.error("ReferenceError:", error.message);
        setError("A data processing error occurred. Please try again later.");
      }
      else {
        setError("Failed to load paper data due to a network issue. Please check your connection.");
      }
    } finally {
      console.log("Finished fetchPaperAndAttempt, setting loading to false");
      setLoading(false);
    }
  }, [paperId, user?.role, router]);

  // Go to question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < (paper?.questions.length || 0)) {
      setCurrentQuestion(index);
    }
  }, [paper?.questions.length]);

  // Toggle explanation visibility
  const toggleExplanation = useCallback((questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  // Fetch paper on mount
  useEffect(() => {
    console.log("useEffect for fetchPaperAndAttempt triggered.", { paperId, user });
    if (paperId && user) {
      fetchPaperAndAttempt();
    }
  }, [paperId, user, fetchPaperAndAttempt]);

  // Calculate stats
  const totalQuestions = paper?.questions.length || 0;
  const currentQuestionData = paper?.questions[currentQuestion];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading answers...</p>
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Answers</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/papers/results/my-results">
              <Button>Back to My Results</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
            {/* Review Mode Header */}
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
                {/* Score summary */}
                {studentAttempt && (
                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-lg font-bold text-blue-900">
                      Score: {studentAttempt.score} / {studentAttempt.totalQuestions} &nbsp;|
                      Percentage: {studentAttempt.percentage}%
                    </div>
                    <div className="text-gray-700 text-sm">
                      Time Used: {studentAttempt.timeSpent} min
                    </div>
                    <Link href="/papers/results/my-results">
                      <Button variant="outline">Back to Results</Button>
                    </Link>
                  </div>
                )}
            </motion.div>

            {/* Question Navigation Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4 sticky top-32">
                  <h3 className="font-semibold text-gray-900 mb-3">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {paper.questions.map((question, index) => (
                      <div key={index} className="relative">
                        <button
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
                        {/* Small indicator for questions with explanations */}
                        {question.explanation && (question.explanation.text || question.explanation.imageUrl) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white" title="Has explanation"></div>
                        )}
                      </div>
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
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                      <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span>Has Explanation</span>
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
                              <img src={`${API_BASE_URL}/api/uploads${currentQuestionData.imageUrl}`} alt="Question image" className="rounded-lg max-w-full h-auto max-h-96" />
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            {currentQuestionData.options.map((option, optionIndex) => (
                              <label
                                key={option._id}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                                  // If this is the correct answer
                                  option.isCorrect
                                    ? 'border-green-500 bg-green-50'
                                    // If this is the student's selected answer and it's incorrect
                                    : studentAttempt?.answers.find((a) => 
                                        a.questionId === currentQuestionData._id && 
                                        a.selectedOptionId === option._id &&
                                        !option.isCorrect
                                      )
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-200' // Default for other options
                                } cursor-default`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${currentQuestionData._id}`}
                                  value={option._id}
                                  checked={studentAttempt?.answers.find((a) => a.questionId === currentQuestionData._id)?.selectedOptionId === option._id}
                                  className="w-5 h-5 text-blue-600"
                                  disabled={true}
                                />
                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span className="text-gray-900 flex-1 text-lg">
                                  {option.optionText}
                                </span>
                                  {/* Feedback for review mode */}
                                  {option.isCorrect && (
                                    <span className="ml-2 text-green-700 font-semibold text-sm flex items-center gap-1">
                                      <CheckCircle className="text-green-500 shrink-0" size={18} /> Correct Answer
                                    </span>
                                  )}
                                  {studentAttempt?.answers.find((a) => a.questionId === currentQuestionData._id && a.selectedOptionId === option._id && !option.isCorrect) && (
                                    <span className="ml-2 text-red-700 font-semibold text-sm flex items-center gap-1">
                                      <AlertTriangle className="text-red-500 shrink-0" size={18} /> Your Answer
                                    </span>
                                  )}
                              </label>
                            ))}
                          </div>

                          {/* Detailed Explanation (විවරණ - Wiwarana) */}
                          {currentQuestionData.explanation && (currentQuestionData.explanation.text || currentQuestionData.explanation.imageUrl) && (
                            <div className="mt-8 border-t-2 border-gray-100 pt-6">
                              <div 
                                className="flex items-center justify-between cursor-pointer p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border-2 border-amber-200 transition-colors"
                                onClick={() => toggleExplanation(currentQuestionData._id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <BookOpen size={20} className="text-amber-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-amber-800 text-lg">Detailed Explanation (විවරණ)</h3>
                                    <p className="text-amber-700 text-sm">Click to {showExplanation[currentQuestionData._id] ? 'hide' : 'view'} the detailed explanation</p>
                                  </div>
                                </div>
                                <div className="text-amber-600">
                                  {showExplanation[currentQuestionData._id] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                              </div>

                              <AnimatePresence>
                                {showExplanation[currentQuestionData._id] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 bg-white border-2 border-amber-200 rounded-b-xl space-y-4">
                                      {/* Explanation Text */}
                                      {currentQuestionData.explanation.text && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <BookOpen size={18} className="text-amber-600" />
                                            Explanation
                                          </h4>
                                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-amber-400">
                                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                              {currentQuestionData.explanation.text}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Explanation Image */}
                                      {currentQuestionData.explanation.imageUrl && (
                                        <div>
                                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <ImageIcon size={18} className="text-amber-600" />
                                            Visual Explanation
                                          </h4>
                                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <img 
                                              src={`${API_BASE_URL}/api/uploads${currentQuestionData.explanation.imageUrl}`} 
                                              alt="Detailed explanation" 
                                              className="rounded-lg max-w-full h-auto max-h-96 mx-auto shadow-md border border-gray-200" 
                                            />
                                          </div>
                                        </div>
                                      )}

                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-800 text-sm flex items-center gap-2">
                                          <Eye size={16} />
                                          This explanation helps you understand the reasoning behind the correct answer.
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
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
        </div>
      </main>
    </div>
  );
}