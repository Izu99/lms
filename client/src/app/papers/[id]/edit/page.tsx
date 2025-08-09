"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  _id?: string;
  questionText: string;
  options: {
    _id?: string;
    optionText: string;
    isCorrect: boolean;
  }[];
}

interface Paper {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  timeLimit: number;
  questions: Question[];
}

interface UserData {
  _id: string;
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function EditPaperPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paper, setPaper] = useState<Paper | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    timeLimit: 30,
    questions: [] as Question[]
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      
      if (user.role !== 'teacher' && user.role !== 'admin') {
        router.push('/papers');
        return;
      }
    } else {
      router.push('/auth/login');
      return;
    }
    
    fetchPaper();
  }, [router]);

  const fetchPaper = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get(`http://localhost:5000/api/papers/${params.id}`, { headers });
      const paperData = response.data.paper;
      
      setPaper(paperData);
      
      // Populate form with existing data
      setFormData({
        title: paperData.title,
        description: paperData.description || "",
        deadline: new Date(paperData.deadline).toISOString().slice(0, 16),
        timeLimit: paperData.timeLimit,
        questions: paperData.questions.map((q: any) => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options.map((opt: any) => ({
            _id: opt._id,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect
          }))
        }))
      });
      
    } catch (error) {
      console.error("Error fetching paper:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to load paper for editing");
      } else {
        setError("Failed to load paper for editing");
      }
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false }
        ]
      }]
    }));
  };

  const removeQuestion = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const updateQuestion = (questionIndex: number, questionText: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, questionText } : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, optionText: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex ? {
          ...q,
          options: q.options.map((opt, oIndex) => 
            oIndex === optionIndex ? { ...opt, optionText } : opt
          )
        } : q
      )
    }));
  };

  const setCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex ? {
          ...q,
          options: q.options.map((opt, oIndex) => ({
            ...opt,
            isCorrect: oIndex === optionIndex
          }))
        } : q
      )
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!formData.deadline) {
      setError("Deadline is required");
      return false;
    }

    if (formData.questions.length === 0) {
      setError("At least one question is required");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];
      
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }

      const filledOptions = question.options.filter(opt => opt.optionText.trim());
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return false;
      }

      const correctAnswers = question.options.filter(opt => opt.isCorrect && opt.optionText.trim());
      if (correctAnswers.length !== 1) {
        setError(`Question ${i + 1} must have exactly one correct answer`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");
      
      const headers = getAuthHeaders();
      const payload = {
        ...formData,
        questions: formData.questions.map(q => ({
          ...q,
          options: q.options.filter(opt => opt.optionText.trim())
        }))
      };

      await axios.put(`http://localhost:5000/api/papers/${params.id}`, payload, { headers });
      
      setSuccess("Paper updated successfully!");
      setTimeout(() => {
        router.push('/papers');
      }, 2000);
      
    } catch (error) {
      console.error("Error updating paper:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to update paper");
      } else {
        setError("Failed to update paper");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

  if (!user || user.role === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only teachers can edit papers</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar user={user} onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/papers">
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Papers
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Edit className="text-orange-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Paper</h1>
              <p className="text-gray-600">Modify your examination paper</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-500">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-green-700">{success}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Paper Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paper Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter paper title"
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter paper description"
                  className="border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Deadline *
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-emerald-500" />
                    Time Limit (minutes) *
                  </label>
                  <Input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions Section - Similar to create page */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Questions ({formData.questions.length})</h2>
              <Button 
                type="button"
                onClick={addQuestion}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} className="mr-2" />
                Add Question
              </Button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Added</h3>
                <p className="text-gray-600 mb-4">Add questions to your paper</p>
                <Button type="button" onClick={addQuestion} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus size={16} className="mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.questions.map((question, questionIndex) => (
                  <motion.div
                    key={questionIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: questionIndex * 0.1 }}
                    className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Question {questionIndex + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text *
                        </label>
                        <Textarea
                          value={question.questionText}
                          onChange={(e) => updateQuestion(questionIndex, e.target.value)}
                          placeholder="Enter your question in Sinhala or English"
                          className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Answer Options * (Select one correct answer)
                        </label>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  option.isCorrect 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {option.isCorrect && <CheckCircle size={16} />}
                              </button>
                              <div className="flex-1">
                                <Input
                                  value={option.optionText}
                                  onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Click the circle to mark the correct answer
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Link href="/papers" className="flex-1">
              <Button type="button" variant="outline" className="w-full h-12" disabled={saving}>
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={saving || formData.questions.length === 0}
              className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Changes...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </main>
    </div>
  );
}
