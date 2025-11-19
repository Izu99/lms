"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Trophy,
  Clock,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  BarChart,
  Percent,
  HelpCircle,
  LineChart as LineChartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- INTERFACES ---
interface Result {
  _id: string;
  paperId: {
    _id: string;
    title: string;
    description?: string;
    deadline: string;
    paperType: 'MCQ' | 'Structure'; // Add paperType
    averagePercentage: number; // New: average percentage for this paper
  };
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  submittedAt: string;
}

// --- HELPER FUNCTIONS ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getGradeInfo = (percentage: number) => {
  if (percentage >= 90) return { letter: "A+", color: "text-green-500", bg: "bg-green-500/10" };
  if (percentage >= 80) return { letter: "A", color: "text-blue-500", bg: "bg-blue-500/10" };
  if (percentage >= 70) return { letter: "B+", color: "text-yellow-500", bg: "bg-yellow-500/10" };
  if (percentage >= 60) return { letter: "B", color: "text-orange-500", bg: "bg-orange-500/10" };
  if (percentage >= 50) return { letter: "C", color: "text-red-500", bg: "bg-red-500/10" };
  return { letter: "F", color: "text-red-600", bg: "bg-red-600/10" };
};

// --- SKELETON COMPONENTS ---
const SkeletonCard = () => (
  <div className="theme-card p-6 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const LoadingState = () => (
  <StudentLayout>
    <div className="space-y-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl mt-8"></div>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </StudentLayout>
);

// --- UI COMPONENTS ---
const Header = () => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Trophy className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text-primary">My Results</h1>
          <p className="text-theme-text-secondary">Your performance dashboard</p>
        </div>
      </div>
      <Link href="/student/dashboard">
        <Button variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  </motion.div>
);

const SummaryCard = ({ icon: Icon, label, value, color, iconBg }) => (
  <div className="theme-card p-6 flex items-center gap-5">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
      <Icon className={color} size={24} />
    </div>
    <div>
      <p className="text-theme-text-secondary text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-theme-text-primary">{value}</p>
    </div>
  </div>
);

const ProgressChart = ({ data }) => {
  const { theme } = useTheme();
  const strokeColor = theme === "dark" ? "#94a3b8" : "#6b7280";

  const chartData = data
    .filter(item => item.paperId)
    .map(item => ({
      date: new Date(item.submittedAt),
      name: formatShortDate(item.submittedAt),
      score: item.percentage,
      paperAverage: item.paperId.averagePercentage, // Add paper-specific average
      title: item.paperId.title,
    }))
    .sort((a, b) => a.date - b.date);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-theme-text-primary">{label}</p>
          <p className="text-sm text-blue-500">Your Score: {payload[0].value}%</p>
          {payload.length > 1 && (
            <p className="text-sm text-emerald-500">Paper Average: {payload[1].value}%</p>
          )}
          <p className="text-xs text-theme-text-secondary mt-1">{payload[0].payload.title.replace(/'/g, '&apos;')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="theme-card p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <LineChartIcon className="text-blue-500" size={24} />
        <h3 className="text-xl font-bold text-theme-text-primary">Progress Over Time</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPaperAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" stroke={strokeColor} fontSize={12} />
            <YAxis stroke={strokeColor} fontSize={12} unit="%" domain={[0, 105]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorScore)"
              dot={{ r: 4, fill: "#3b82f6", stroke: theme === "dark" ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#3b82f6", stroke: theme === "dark" ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="paperAverage"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorPaperAverage)"
              dot={{ r: 4, fill: "#10b981", stroke: theme === "dark" ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#10b981", stroke: theme === "dark" ? "#0f172a" : "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
const ResultCard = ({ result, index }) => {
  const grade = getGradeInfo(result.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="theme-card p-6 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-5">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-theme-text-primary mb-1 group-hover:text-blue-600 transition-colors">
            {result.paperId.title}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">{result.paperId.paperType}</span>
          </h3>
          <div className="flex items-center gap-3 text-sm text-theme-text-tertiary">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(result.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{result.timeSpent} min</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full font-bold text-lg ${grade.bg} ${grade.color}`}>
            {grade.letter}
          </div>
          <Link href={`/student/papers/answers/${result.paperId._id}`}>
            <Button variant="outline">
              {result.paperId.paperType === 'Structure' ? 'View Details' : 'See Answers'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Bar & Stats */}
      <div className="space-y-4">
        <div className="space-y-3"> {/* Use space-y-3 for vertical spacing */}
          {/* Student Score Bar */}
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-theme-text-primary">Your Score</span>
              <span className="font-bold text-blue-600">{result.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.2 + 0.2 }}
                className={`h-full rounded-full ${
                  result.percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
              />
            </div>
          </div>

          {/* Average Score Bar */}
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-theme-text-primary">Paper Average</span>
              <span className="font-bold text-emerald-600">{result.paperId.averagePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.paperId.averagePercentage}%` }}
                transition={{ duration: 1, delay: index * 0.2 + 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-theme-text-secondary flex items-center justify-center gap-1"><BarChart size={14} /> Score</p>
            <p className="font-bold text-lg text-theme-text-primary">
              {result.paperId.paperType === 'Structure' ? (
                <>Score: {result.score}</>
              ) : (
                <>{result.score}/{result.totalQuestions}</>
              )}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-theme-text-secondary flex items-center justify-center gap-1"><Percent size={14} /> Percentage</p>
            <p className="font-bold text-lg text-theme-text-primary">{result.percentage}%</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-theme-text-secondary flex items-center justify-center gap-1"><HelpCircle size={14} /> Total Qs</p>
            <p className="font-bold text-lg text-theme-text-primary">{result.totalQuestions}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function MyResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = "/login";
          return;
        }
        
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/papers/results/my-results`, { headers });
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Error fetching results:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load results. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  const averageScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0;
  const bestScoreResult = results.length > 0 ? results.reduce((max, r) => r.percentage > max.percentage ? r : max, results[0]) : null;

  return (
    <StudentLayout>
      <Header />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-500">{error}</p>
        </motion.div>
      )}

      {results.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <SummaryCard icon={BookOpen} label="Papers Completed" value={results.length} color="text-blue-600" iconBg="bg-blue-500/10" />
            <SummaryCard icon={TrendingUp} label="Average Score" value={`${averageScore}%`} color="text-emerald-600" iconBg="bg-emerald-500/10" />
            <SummaryCard icon={Award} label="Best Score" value={`${bestScoreResult?.percentage || 0}%`} color="text-purple-600" iconBg="bg-purple-500/10" />
          </motion.div>

          <ProgressChart data={results} />
        </>
      )}

      {results.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 theme-card"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-gray-400" size={48} />
          </div>
          <h3 className="text-2xl font-semibold text-theme-text-primary mb-2">No Results Yet</h3>
          <p className="text-theme-text-secondary mb-6 max-w-md mx-auto">
            It looks like you haven't completed any papers. Finish one to see your performance here.
          </p>
          <Link href="/student/papers">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Target size={20} className="mr-2" />
              View Available Papers
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-theme-text-primary mt-8 mb-4">Recent Results</h3>
          {results.map((result, index) => (
            result.paperId ? <ResultCard key={result._id} result={result} index={index} /> : null
          ))}
        </div>
      )}
    </StudentLayout>
  );
}