'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Loader2,
  Award,
  Clock,
  HelpCircle,
  Download
} from 'lucide-react';
import { StudentLayout } from '@/components/student/StudentLayout';
import { Button } from '@/components/ui/button';
import { API_URL, API_BASE_URL } from '@/lib/constants';

interface Option {
  _id: string;
  optionText: string;
  isCorrect: boolean;
  imageUrl?: string;
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
  questions: Question[];
  paperType: 'MCQ' | 'Structure-Essay'; // Add paperType
  fileUrl?: string; // Add fileUrl for structure papers
}

interface StudentAttempt {
  _id: string;
  paperId: Paper; // Changed from string to Paper interface
  studentId: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  answerFileUrl?: string;
  teacherReviewFileUrl?: string; // New: Teacher's uploaded review file
}

export default function PaperAnswerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const attemptId = pathname.split('/').pop();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [studentAttempt, setStudentAttempt] = useState<StudentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchAttemptAndPaper = useCallback(async () => {
    if (!attemptId || !/^[0-9a-fA-F]{24}$/.test(attemptId)) {
      setError("Invalid attempt ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const attemptResponse = await axios.get<{ attempt: StudentAttempt }>(`${API_URL}/papers/attempts/${attemptId}`, { headers });
      const attempt = attemptResponse.data.attempt;
      setStudentAttempt(attempt);

      if (attempt && attempt.paperId) {
        const paperId = typeof attempt.paperId === 'string' ? attempt.paperId : attempt.paperId._id;
        const paperResponse = await axios.get<{ paper: Paper }>(`${API_URL}/papers/${paperId}?showAnswers=true`, { headers });
        setPaper(paperResponse.data.paper);
      } else {
        throw new Error("Attempt data or paper ID is missing.");
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to load data" : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [attemptId, getAuthHeaders]);

  useEffect(() => {
    fetchAttemptAndPaper();
  }, [fetchAttemptAndPaper]);

  const goToQuestion = (index: number) => {
    if (paper && index >= 0 && index < paper.questions.length) {
      setCurrentQuestion(index);
    }
  };

  const toggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const totalQuestions = paper?.questions.length || 0;
  const currentQuestionData = paper?.questions[currentQuestion];
  const studentAnswerForCurrentQuestion = studentAttempt?.answers.find(a => a.questionId === currentQuestionData?._id)?.selectedOptionId;

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading Your Results...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !paper || !studentAttempt) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-500/20 dark:border-red-500/30">
            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Results</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Link href="/student/papers/results"><Button variant="destructive">Back to My Results</Button></Link>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const getOptionStatus = (option: Option, questionId: string) => {
    const studentAnswerId = studentAttempt?.answers.find(a => a.questionId === questionId)?.selectedOptionId;
    const isCorrect = option.isCorrect;
    const isSelected = studentAnswerId === option._id;

    if (isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    return 'default';
  };

  const statusStyles = {
    correct: 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md',
    incorrect: 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md',
    default: 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/20'
  };

  const statusIcons = {
    correct: <CheckCircle className="text-green-500 flex-shrink-0" size={28} />,
    incorrect: <XCircle className="text-red-500 flex-shrink-0" size={28} />
  };

  return (
    <StudentLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{paper.title} - Results</h1>
              <Link href="/student/papers/results">
                <Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to All Results</Button>
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"><Award className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your Score</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{studentAttempt.score} / {studentAttempt.totalQuestions}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full"><CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" /></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Percentage</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{studentAttempt.percentage}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full"><Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" /></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{studentAttempt.timeSpent} mins</p>
                </div>
              </div>
            </div>

            {studentAttempt.paperId.paperType === 'Structure-Essay' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Structure and Essay Submission</h2>
                {studentAttempt.answerFileUrl ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">Your Submitted Answer</p>
                    <a href={`${API_BASE_URL}${studentAttempt.answerFileUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> Download</Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No answer file submitted for this paper.</p>
                )}

                {studentAttempt.teacherReviewFileUrl && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6">Teacher's Review</h3>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-700 dark:text-green-300">Reviewed File from Teacher</p>
                      <a href={`${API_BASE_URL}${studentAttempt.teacherReviewFileUrl}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"><Download className="w-4 h-4 mr-2" /> Download Review</Button>
                      </a>
                    </div>
                  </>
                )}
                {!studentAttempt.teacherReviewFileUrl && studentAttempt.answerFileUrl && (
                  <p className="text-gray-500 dark:text-gray-400">The teacher has not yet uploaded a reviewed file for this submission.</p>
                )}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <div className="lg:col-span-1 lg:sticky top-24">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {paper.questions.map((q, index) => {
                      const status = getOptionStatus(q.options.find(opt => opt.isCorrect)!, q._id);
                      return (
                        <button
                          key={index}
                          onClick={() => goToQuestion(index)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center relative ${currentQuestion === index
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500'
                            : status === 'correct'
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                            }`}
                        >
                          {index + 1}
                          {q.explanation && (q.explanation.text || q.explanation.imageUrl) &&
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900" title="Has Explanation" />}
                        </button>
                      )
                    })}
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
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">{currentQuestion + 1}</span>
                          </div>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                            {currentQuestionData.questionText}
                          </p>
                        </div>

                        {currentQuestionData.imageUrl && (
                          <div className="mt-6 flex justify-center">
                            <div className="relative p-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                              <img src={`${API_BASE_URL}${currentQuestionData.imageUrl}`} alt="Question Illustration" className="rounded-lg max-w-full h-auto max-h-[400px] object-contain" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700/50">
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-5 text-lg">Your Answer vs. Correct Answer</h3>
                        <div className="space-y-4">
                          {currentQuestionData.options.map((option, optionIndex) => {
                            const status = getOptionStatus(option, currentQuestionData._id);
                            return (
                              <div key={option._id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${statusStyles[status]}`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 ${status === 'correct' ? 'bg-green-600 text-white' : status === 'incorrect' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}>
                                  {optionIndex + 1}
                                </div>
                                <div className="flex-1 text-gray-800 dark:text-gray-200 text-lg font-medium">
                                  {option.imageUrl ? (
                                    <div className="flex items-center gap-4">
                                      <img src={`${API_BASE_URL}${option.imageUrl}`} alt={`Option ${optionIndex + 1}`} className="rounded-md h-16 w-16 object-cover bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700" />
                                      {option.optionText && <span>{option.optionText}</span>}
                                    </div>
                                  ) : (
                                    option.optionText
                                  )}
                                </div>
                                {status === 'correct' && statusIcons.correct}
                                {status === 'incorrect' && statusIcons.incorrect}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {currentQuestionData.explanation && (currentQuestionData.explanation.text || currentQuestionData.explanation.imageUrl) && (
                        <div className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700/50">
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExplanation(currentQuestionData._id)}>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-xl flex items-center gap-3">
                              <BookOpen className="text-yellow-500" /> Detailed Explanation (විවරණ)
                            </h3>
                            <ChevronDown className={`text-gray-500 transition-transform ${showExplanation[currentQuestionData._id] ? 'rotate-180' : ''}`} />
                          </div>
                          <AnimatePresence>
                            {showExplanation[currentQuestionData._id] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 pt-4 space-y-6">
                                  {currentQuestionData.explanation.text && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-yellow-400">
                                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{currentQuestionData.explanation.text}</p>
                                    </div>
                                  )}
                                  {currentQuestionData.explanation.imageUrl && (
                                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                      <img src={`${API_BASE_URL}${currentQuestionData.explanation.imageUrl}`} alt="Explanation" className="rounded-lg max-w-full h-auto shadow-md max-h-[500px]" />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <Button variant="outline" onClick={() => goToQuestion(currentQuestion - 1)} disabled={currentQuestion === 0} className="h-11 px-6 text-base">
                          <ChevronLeft size={18} className="mr-2" /> Previous
                        </Button>
                        <Button onClick={() => goToQuestion(currentQuestion + 1)} disabled={currentQuestion === totalQuestions - 1} className="h-11 px-6 text-base bg-blue-600 hover:bg-blue-700">
                          Next <ChevronRight size={18} className="ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </StudentLayout>
  );
}