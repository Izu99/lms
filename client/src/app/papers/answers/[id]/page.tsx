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
  Eye
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';

export default function PaperAnswerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const paperId = resolvedParams.id;

  // State management
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [studentAttempt, setStudentAttempt] = useState<any>(null);

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
        axios.get(`${API_URL}/papers/results/my-results`, { headers }),
        axios.get(`${API_URL}/papers/${paperId}`, { headers })
      ]);

      console.log("Data fetched successfully", { attemptResponse: attemptResponse.data, paperResponse: paperResponse.data });

      const attempt = attemptResponse.data.results.find((r: any) => r.paperId && r.paperId._id === paperId);

      if (attempt) {
        console.log("Attempt found", attempt);
        setStudentAttempt(attempt);
        if (attempt.answers) {
          const attemptAnswers: Record<string, string> = {};
          attempt.answers.forEach((ans: any) => {
            attemptAnswers[ans.questionId] = ans.selectedOptionId;
          });
          setAnswers(attemptAnswers);
        }
      } else {
        console.log("Attempt not found for paperId:", paperId);
        setError("You have not attempted this paper yet.");
      }

      setPaper(paperResponse.data.paper);

    } catch (error) {
      console.error("Error fetching paper or attempt:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (error.response?.status === 404) {
          setError('Paper not found.');
        } else {
          setError(errorMessage || "Failed to load paper data.");
        }
      } else {
        setError("Failed to load paper data due to a network error.");
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
                                  // If this is the correct answer
                                  option.isCorrect
                                    ? 'border-green-500 bg-green-50'
                                    // If this is the student's selected answer and it's incorrect
                                    : studentAttempt?.answers.find((a: any) => 
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
                                  checked={studentAttempt?.answers.find((a: any) => a.questionId === currentQuestionData._id)?.selectedOptionId === option._id}
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
                                  {studentAttempt?.answers.find((a: any) => a.questionId === currentQuestionData._id && a.selectedOptionId === option._id && !option.isCorrect) && (
                                    <span className="ml-2 text-red-700 font-semibold text-sm flex items-center gap-1">
                                      <AlertTriangle className="text-red-500 shrink-0" size={18} /> Your Answer
                                    </span>
                                  )}
                              </label>
                            ))}
                          </div>
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
