"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
    ArrowLeft,
    Calendar,
    Clock,
    ListOrdered,
    Image as ImageIcon,
    Upload,
    X,
    ArrowUp,
    Loader2,
    School,
    GraduationCap,
    Save,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

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

interface PaperQuestion {
    _id: string;
    questionText: string;
    options: Option[];
    imageUrl?: string;
    explanation?: Explanation;
}

interface PaperFormProps {
    mode: "create" | "edit";
    paperId?: string;
    basePath: string;
}

export function PaperForm({ mode, paperId, basePath }: PaperFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [timeLimit, setTimeLimit] = useState(60);
    const [availability, setAvailability] = useState("all");
    const [price, setPrice] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(mode === "edit");
    const [error, setError] = useState("");
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});
    const [paperType, setPaperType] = useState("MCQ");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
    const [institutes, setInstitutes] = useState<{ _id: string; name: string }[]>([]);
    const [years, setYears] = useState<{ _id: string; year: string; name: string }[]>([]);
    const [instituteId, setInstituteId] = useState("");
    const [yearId, setYearId] = useState("");
    const [academicLevelId, setAcademicLevelId] = useState("");
    const [dataLoading, setDataLoading] = useState(true);

    const academicLevels = [
        { _id: "OL", name: "Ordinary Level" },
        { _id: "AL", name: "Advanced Level" },
    ];

    const questionsRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const { confirm, ConfirmDialog } = useConfirmDialog();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const [instituteRes, yearRes] = await Promise.all([
                    axios.get(`${API_URL}/institutes`, { headers }),
                    axios.get(`${API_URL}/years`, { headers }),
                ]);
                setInstitutes(instituteRes.data.institutes || []);
                setYears(yearRes.data.years || []);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
                toast.error("Failed to load institutes and years.");
            } finally {
                setDataLoading(false);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (mode === "edit" && paperId) {
            fetchPaperData();
        }
    }, [mode, paperId]);

    const fetchPaperData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${API_URL}/papers/${paperId}`, { headers });
            const paper = response.data.paper;

            setTitle(paper.title);
            setDescription(paper.description || "");
            setDeadline(paper.deadline ? new Date(paper.deadline).toISOString().slice(0, 16) : "");
            setTimeLimit(paper.timeLimit);
            setAvailability(paper.availability || "all");
            setPrice(paper.price || 0);
            setPaperType(paper.paperType || "MCQ");
            setPdfUrl(paper.fileUrl || "");
            setCurrentThumbnailUrl(paper.thumbnailUrl || "");
            setInstituteId(paper.institute?._id || paper.institute || "");
            setYearId(paper.year?._id || paper.year || "");
            setAcademicLevelId(paper.academicLevel || "");
            setQuestions(
                paper.questions?.map((q: PaperQuestion) => ({
                    ...q,
                    open: true,
                    explanation: q.explanation || { text: "", imageUrl: "" },
                })) || []
            );
        } catch (err) {
            console.error("Error fetching paper:", err);
            setError("Failed to load paper data.");
            toast.error("Failed to load paper data.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
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
            explanation: { text: "", imageUrl: "" },
        };

        setQuestions([...questions, newQuestion]);

        setTimeout(() => {
            const questionElements = document.querySelectorAll("[data-question-index]");
            const lastQuestion = questionElements[questionElements.length - 1];
            lastQuestion?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const handleImageUpload = async (
        qIndex: number,
        files: FileList | null,
        type: "question" | "explanation" | "option",
        oIndex?: number
    ) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size too large. Maximum size is 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        const uploadKey = `${qIndex}-${type}${oIndex !== undefined ? `-${oIndex}` : ""}`;
        setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));

        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            };

            let endpoint: string;
            if (type === "question") {
                endpoint = `${API_URL}/images/upload/question`;
            } else if (type === "explanation") {
                endpoint = `${API_URL}/images/upload/explanation`;
            } else if (type === "option") {
                endpoint = `${API_URL}/images/upload/paper-options`;
            } else {
                endpoint = `${API_URL}/images/upload/paper-content`;
            }

            const response = await axios.post(endpoint, formData, {
                headers,
                timeout: 30000,
            });

            if (!response.data.imageUrl) {
                throw new Error("No image URL returned from server");
            }

            const newQuestions = [...questions];
            if (type === "explanation") {
                if (!newQuestions[qIndex].explanation) {
                    newQuestions[qIndex].explanation = {};
                }
                newQuestions[qIndex].explanation!.imageUrl = response.data.imageUrl;
                toast.success("Explanation image uploaded successfully!");
            } else if (type === "question") {
                newQuestions[qIndex].imageUrl = response.data.imageUrl;
                toast.success("Question image uploaded successfully!");
            } else if (type === "option" && oIndex !== undefined) {
                newQuestions[qIndex].options[oIndex].imageUrl = response.data.imageUrl;
                newQuestions[qIndex].options[oIndex].optionText = "";
                toast.success(`Option ${String.fromCharCode(65 + oIndex)} image uploaded successfully!`);
            }
            setQuestions(newQuestions);
        } catch (error: any) {
            console.error("Error uploading image:", error);
            const errorMsg = error.response?.data?.message || error.message || `Failed to upload ${type} image`;
            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
        }
    };

    const removeImage = async (
        qIndex: number,
        type: "question" | "explanation" | "option",
        oIndex?: number
    ) => {
        const newQuestions = [...questions];
        let imageUrlToRemove = "";

        if (type === "explanation") {
            if (newQuestions[qIndex].explanation) {
                imageUrlToRemove = newQuestions[qIndex].explanation!.imageUrl || "";
            }
        } else if (type === "question") {
            imageUrlToRemove = newQuestions[qIndex].imageUrl || "";
        } else if (type === "option" && oIndex !== undefined) {
            imageUrlToRemove = newQuestions[qIndex].options[oIndex].imageUrl || "";
        }

        if (!imageUrlToRemove) {
            toast.error("No image URL found to remove.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/images/delete`,
                { fileUrl: imageUrlToRemove },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (type === "explanation") {
                if (newQuestions[qIndex].explanation) {
                    newQuestions[qIndex].explanation!.imageUrl = "";
                }
            } else if (type === "question") {
                newQuestions[qIndex].imageUrl = "";
            } else if (type === "option" && oIndex !== undefined) {
                newQuestions[qIndex].options[oIndex].imageUrl = "";
            }
            setQuestions(newQuestions);
            toast.success("Image removed successfully!");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to remove image. Please try again.");
        }
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
            newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
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

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
        }
    };

    const removeThumbnail = async () => {
        if (currentThumbnailUrl) {
            const confirmed = await confirm({
                title: "Remove Thumbnail",
                description: "Are you sure you want to remove the current thumbnail?",
                confirmText: "Remove",
                variant: "danger",
            });
            if (!confirmed) return;

            try {
                const token = localStorage.getItem("token");
                await axios.post(
                    `${API_URL}/images/delete`,
                    { fileUrl: currentThumbnailUrl },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Thumbnail removed successfully!");
                setCurrentThumbnailUrl("");
                setThumbnail(null);
            } catch (error) {
                console.error("Error deleting thumbnail:", error);
                toast.error("Failed to remove thumbnail.");
            }
        } else {
            setThumbnail(null);
        }
    };

    const validateForm = () => {
        if (!title.trim()) return "Paper title is required.";
        if (paperType === "MCQ" && questions.length === 0)
            return "At least one question is required for an MCQ paper.";

        if (paperType === "MCQ") {
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.questionText.trim()) return `Question ${i + 1} text is required.`;
                if (q.options.length < 2) return `Question ${i + 1} must have at least two options.`;
                if (q.options.some((opt) => !opt.optionText.trim() && !opt.imageUrl)) {
                    return `All options for Question ${i + 1} must have either text or an image.`;
                }
                if (!q.options.some((opt) => opt.isCorrect)) {
                    return `A correct answer must be selected for Question ${i + 1}.`;
                }
            }
        }
        return "";
    };

    const handleSubmit = async () => {
        // Validate first
        if (paperType === "MCQ") {
            const validationError = validateForm();
            if (validationError) {
                setError(validationError);
                toast.error(validationError);
                return;
            }
        } else {
            if (!title.trim()) {
                setError("Paper title is required.");
                toast.error("Paper title is required.");
                return;
            }
            if (mode === "create" && !pdfFile && !thumbnail) {
                setError("Please upload a PDF file or a thumbnail for the paper.");
                toast.error("Please upload a PDF file or a thumbnail for the paper.");
                return;
            }
            if (mode === "edit" && !pdfFile && !currentThumbnailUrl && !thumbnail) {
                setError("Please upload a PDF file or a thumbnail for the paper.");
                toast.error("Please upload a PDF file or a thumbnail for the paper.");
                return;
            }
        }

        if (!instituteId) {
            setError("Please select an institute.");
            toast.error("Please select an institute.");
            return;
        }
        if (!yearId) {
            setError("Please select an academic year.");
            toast.error("Please select an academic year.");
            return;
        }
        if (!academicLevelId) {
            setError("Please select an academic level.");
            toast.error("Please select an academic level.");
            return;
        }
        setError("");

        // Show confirmation dialog
        const confirmed = await confirm({
            title: mode === "create" ? 'Create Paper' : 'Update Paper',
            description: mode === "create"
                ? 'Are you sure you want to create this paper? Students will be able to access it based on your availability settings.'
                : 'Are you sure you want to save these changes? This will update the paper for all users.',
            confirmText: mode === "create" ? 'Create' : 'Save Changes',
            cancelText: 'Cancel',
            variant: 'default'
        });

        if (!confirmed) return;

        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("deadline", deadline);
            formData.append("timeLimit", timeLimit.toString());
            formData.append("availability", availability);
            formData.append("price", price.toString());
            formData.append("paperType", paperType);
            formData.append("institute", instituteId);
            formData.append("year", yearId);
            formData.append("academicLevel", academicLevelId);

            if (paperType === "MCQ") {
                formData.append(
                    "questions",
                    JSON.stringify(questions.map(({ open, ...rest }) => rest))
                );
            } else {
                // Append uploadType BEFORE file for multer to detect it
                if (paperType === "Structure-Essay") {
                    formData.append("uploadType", "structure-essay-question");
                }

                if (pdfFile) {
                    formData.append("file", pdfFile);
                }
            }

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            if (mode === "create") {
                await axios.post(`${API_URL}/papers`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Paper created successfully!");
            } else {
                await axios.put(`${API_URL}/papers/${paperId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Paper updated successfully!");
            }

            router.push(`${basePath}/papers`);
        } catch (error) {
            console.error("Error saving paper:", error);
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data?.message || "Failed to save paper"
                : "An unexpected error occurred";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Loading Paper...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={topRef} className="theme-bg-secondary p-4 rounded-lg">
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
                            <h1 className="text-4xl font-bold text-foreground">
                                {mode === "create" ? "Create New Paper" : "Edit Paper"}
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {mode === "create"
                                    ? "Design and build your examination paper"
                                    : "Refine and update your examination paper details"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="shadow-md"
                        onClick={() => router.push(`${basePath}/papers`)}
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Papers
                    </Button>
                </div>

                {/* Paper Details Form */}
                <motion.div
                    className="rounded-3xl shadow-xl border border-border p-8 mb-8"
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Institute Selection */}
                        <div>
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Institute <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <School
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    size={18}
                                />
                                <Select
                                    value={instituteId}
                                    onValueChange={setInstituteId}
                                    disabled={dataLoading}
                                >
                                    <SelectTrigger className="pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <SelectValue
                                            placeholder={dataLoading ? "Loading..." : "Select Institute"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                        {institutes.map((inst) => (
                                            <SelectItem
                                                key={inst._id}
                                                value={inst._id}
                                                className="text-gray-900 dark:text-white"
                                            >
                                                {inst.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Year Selection */}
                        <div>
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Academic Year <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    size={18}
                                />
                                <Select value={yearId} onValueChange={setYearId} disabled={dataLoading}>
                                    <SelectTrigger className="pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <SelectValue
                                            placeholder={dataLoading ? "Loading..." : "Select Year"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                        {years.map((yr) => (
                                            <SelectItem
                                                key={yr._id}
                                                value={yr._id}
                                                className="text-gray-900 dark:text-white"
                                            >
                                                {yr.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Academic Level Selection */}
                        <div>
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Academic Level <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <GraduationCap
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    size={18}
                                />
                                <Select
                                    value={academicLevelId}
                                    onValueChange={setAcademicLevelId}
                                    disabled={dataLoading}
                                >
                                    <SelectTrigger className="pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                        <SelectValue
                                            placeholder={dataLoading ? "Loading..." : "Select Level"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                        {academicLevels.map((level) => (
                                            <SelectItem
                                                key={level._id}
                                                value={level._id}
                                                className="text-gray-900 dark:text-white"
                                            >
                                                {level.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="font-semibold text-foreground mb-3 block text-lg">
                            Paper Type
                        </label>
                        <Select value={paperType} onValueChange={setPaperType}>
                            <SelectTrigger className="h-14 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <SelectValue placeholder="Select paper type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                <SelectItem value="MCQ" className="text-gray-900 dark:text-white">
                                    Multiple Choice Questions (MCQ)
                                </SelectItem>
                                <SelectItem
                                    value="Structure-Essay"
                                    className="text-gray-900 dark:text-white"
                                >
                                    Structure and Essay Paper (PDF Upload)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Paper Title
                            </label>
                            <Input
                                placeholder="e.g., Mid-Term ICT Examination - Database Systems"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-14 text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                            />
                        </div>
                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Description (Optional)
                            </label>
                            <Textarea
                                placeholder="A brief summary of the paper's content and topics covered..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px] text-lg bg-background text-foreground border-border focus:border-primary rounded-xl"
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="md:col-span-2">
                            <label className="font-semibold text-foreground mb-3 block text-lg">
                                Thumbnail (Optional)
                            </label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                                {currentThumbnailUrl || thumbnail ? (
                                    <div className="space-y-3">
                                        <div className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={
                                                    thumbnail
                                                        ? URL.createObjectURL(thumbnail)
                                                        : `${API_BASE_URL}${currentThumbnailUrl}`
                                                }
                                                alt="Thumbnail"
                                                className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 shadow-lg"
                                                onClick={removeThumbnail}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                        <p className="font-medium text-foreground">
                                            {thumbnail?.name || currentThumbnailUrl.split("/").pop()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Upload size={48} className="mx-auto text-muted-foreground" />
                                        <p className="text-foreground font-medium">
                                            Upload a thumbnail for the paper
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Supported: .jpg, .jpeg, .png, .gif, .webp (Max 5MB)
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            onChange={handleThumbnailUpload}
                                            className="max-w-xs mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
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
                            <Select value={availability} onValueChange={(value) => setAvailability(value)}>
                                <SelectTrigger className="pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <SelectValue placeholder="Select availability" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                                    <SelectItem value="all" className="text-gray-900 dark:text-white">
                                        All Students
                                    </SelectItem>
                                    <SelectItem value="physical" className="text-gray-900 dark:text-white">
                                        Physical Class Only
                                    </SelectItem>
                                    <SelectItem value="paid" className="text-gray-900 dark:text-white">
                                        Paid Only
                                    </SelectItem>
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
                            className="rounded-3xl shadow-xl p-8"
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
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                            Answer Format Guide
                                        </h3>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Each answer option can be <strong>either text OR an image</strong> (not
                                            both).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <ListOrdered size={20} className="text-blue-500" />
                                    </div>
                                    Questions Builder
                                    <span className="text-lg font-normal text-muted-foreground">
                                        ({questions.length} questions)
                                    </span>
                                </h2>
                                <div className="flex gap-3">
                                    {questions.length > 0 && (
                                        <Button
                                            onClick={scrollToTop}
                                            variant="outline"
                                            size="lg"
                                            className="border-muted text-muted-foreground"
                                        >
                                            <ArrowUp size={18} className="mr-2" />
                                            Scroll to Top
                                        </Button>
                                    )}
                                    <Button
                                        onClick={addQuestion}
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Question
                                    </Button>
                                </div>
                            </div>

                            {questions.length === 0 ? (
                                <motion.div
                                    className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-background dark:bg-blue-950/40"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ListOrdered size={32} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        No questions added yet
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Click &quot;Add Question&quot; to start building your paper
                                    </p>
                                    <Button
                                        onClick={addQuestion}
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Your First Question
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {questions.map((question, qIndex) => (
                                        <motion.div
                                            key={qIndex}
                                            data-question-index={qIndex}
                                            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-sm">
                                                        {qIndex + 1}
                                                    </span>
                                                    <h3 className="font-semibold text-lg text-foreground">
                                                        Question {qIndex + 1}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleQuestion(qIndex)}
                                                    >
                                                        {question.open ? (
                                                            <ArrowUp size={16} />
                                                        ) : (
                                                            <ListOrdered size={16} />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeQuestion(qIndex)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>

                                            {question.open && (
                                                <div className="space-y-6">
                                                    {/* Question Text & Image */}
                                                    <div className="space-y-4">
                                                        <Textarea
                                                            placeholder="Enter your question here..."
                                                            value={question.questionText}
                                                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                            className="min-h-[80px] text-lg bg-background text-foreground border-border"
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            {question.imageUrl ? (
                                                                <div className="relative group">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={
                                                                            question.imageUrl.startsWith("http")
                                                                                ? question.imageUrl
                                                                                : `${API_BASE_URL}${question.imageUrl}`
                                                                        }
                                                                        alt="Question"
                                                                        className="h-32 rounded-lg object-cover border border-border"
                                                                    />
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={() => removeImage(qIndex, "question")}
                                                                    >
                                                                        <X size={14} />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="file"
                                                                        id={`q-img-${qIndex}`}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) =>
                                                                            handleImageUpload(qIndex, e.target.files, "question")
                                                                        }
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            document.getElementById(`q-img-${qIndex}`)?.click()
                                                                        }
                                                                        disabled={uploadingImages[`${qIndex}-question`]}
                                                                    >
                                                                        {uploadingImages[`${qIndex}-question`] ? (
                                                                            <Loader2 size={16} className="animate-spin mr-2" />
                                                                        ) : (
                                                                            <ImageIcon size={16} className="mr-2" />
                                                                        )}
                                                                        Add Image
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Options */}
                                                    <div className="space-y-3 pl-4 border-l-2 border-border">
                                                        <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                                                            Answer Options
                                                        </label>
                                                        {question.options.map((option, oIndex) => (
                                                            <div key={oIndex} className="flex items-start gap-3">
                                                                <div
                                                                    className={`mt-2 w-4 h-4 rounded-full border cursor-pointer flex-shrink-0 ${option.isCorrect
                                                                        ? "bg-green-500 border-green-500"
                                                                        : "border-gray-300 dark:border-gray-600"
                                                                        }`}
                                                                    onClick={() => setCorrectOption(qIndex, oIndex)}
                                                                />
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            placeholder={`Option ${String.fromCharCode(
                                                                                65 + oIndex
                                                                            )}`}
                                                                            value={option.optionText}
                                                                            onChange={(e) =>
                                                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                                                            }
                                                                            className={`bg-background text-foreground ${option.isCorrect
                                                                                ? "border-green-500 ring-1 ring-green-500"
                                                                                : ""
                                                                                }`}
                                                                            disabled={!!option.imageUrl}
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-muted-foreground hover:text-destructive"
                                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                                            disabled={question.options.length <= 2}
                                                                        >
                                                                            <X size={16} />
                                                                        </Button>
                                                                    </div>

                                                                    {/* Option Image */}
                                                                    <div className="flex items-center gap-2">
                                                                        {option.imageUrl ? (
                                                                            <div className="relative group">
                                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                <img
                                                                                    src={
                                                                                        option.imageUrl.startsWith("http")
                                                                                            ? option.imageUrl
                                                                                            : `${API_BASE_URL}${option.imageUrl}`
                                                                                    }
                                                                                    alt="Option"
                                                                                    className="h-20 rounded-lg object-cover border border-border"
                                                                                />
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    size="icon"
                                                                                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    onClick={() =>
                                                                                        removeImage(qIndex, "option", oIndex)
                                                                                    }
                                                                                >
                                                                                    <X size={14} />
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            !option.optionText && (
                                                                                <>
                                                                                    <Input
                                                                                        type="file"
                                                                                        id={`opt-img-${qIndex}-${oIndex}`}
                                                                                        className="hidden"
                                                                                        accept="image/*"
                                                                                        onChange={(e) =>
                                                                                            handleImageUpload(
                                                                                                qIndex,
                                                                                                e.target.files,
                                                                                                "option",
                                                                                                oIndex
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-8 text-xs"
                                                                                        onClick={() =>
                                                                                            document
                                                                                                .getElementById(
                                                                                                    `opt-img-${qIndex}-${oIndex}`
                                                                                                )
                                                                                                ?.click()
                                                                                        }
                                                                                        disabled={
                                                                                            uploadingImages[
                                                                                            `${qIndex}-option-${oIndex}`
                                                                                            ]
                                                                                        }
                                                                                    >
                                                                                        <ImageIcon size={14} className="mr-1" />
                                                                                        Image
                                                                                    </Button>
                                                                                </>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addOption(qIndex)}
                                                            className="ml-7"
                                                        >
                                                            <Plus size={14} className="mr-1" /> Add Option
                                                        </Button>
                                                    </div>

                                                    {/* Explanation */}
                                                    <div className="pt-4 border-t border-border">
                                                        <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                                                            Explanation (Optional)
                                                        </label>
                                                        <div className="space-y-3">
                                                            <Textarea
                                                                placeholder="Explain the correct answer..."
                                                                value={question.explanation?.text || ""}
                                                                onChange={(e) =>
                                                                    handleExplanationChange(qIndex, e.target.value)
                                                                }
                                                                className="bg-background text-foreground"
                                                            />
                                                            {question.explanation?.imageUrl ? (
                                                                <div className="relative group inline-block">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={
                                                                            question.explanation.imageUrl.startsWith("http")
                                                                                ? question.explanation.imageUrl
                                                                                : `${API_BASE_URL}${question.explanation.imageUrl}`
                                                                        }
                                                                        alt="Explanation"
                                                                        className="h-32 rounded-lg object-cover border border-border"
                                                                    />
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={() => removeImage(qIndex, "explanation")}
                                                                    >
                                                                        <X size={14} />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <Input
                                                                        type="file"
                                                                        id={`exp-img-${qIndex}`}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) =>
                                                                            handleImageUpload(qIndex, e.target.files, "explanation")
                                                                        }
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            document.getElementById(`exp-img-${qIndex}`)?.click()
                                                                        }
                                                                        disabled={uploadingImages[`${qIndex}-explanation`]}
                                                                    >
                                                                        <ImageIcon size={14} className="mr-2" />
                                                                        Add Explanation Image
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </>
                )}

                {paperType !== "MCQ" && (
                    <motion.div
                        className="rounded-3xl shadow-xl p-8 bg-card border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <FileText size={24} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Paper Document</h2>
                                <p className="text-muted-foreground">Upload the PDF file for this paper</p>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-background/50 hover:bg-background transition-colors">
                            {pdfFile || pdfUrl ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                        <FileText size={32} className="text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-lg">
                                            {pdfFile ? pdfFile.name : "Current PDF File"}
                                        </p>
                                        {pdfUrl && !pdfFile && (
                                            <a
                                                href={pdfUrl.startsWith("http") ? pdfUrl : `${API_BASE_URL}${pdfUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                                            >
                                                View current file
                                            </a>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setPdfFile(null);
                                            if (!pdfFile) setPdfUrl("");
                                            // Note: Clearing pdfUrl might not be desired if we want to allow replacing. 
                                            // But for UI feedback, showing the input again is good.
                                            // Actually, let's just show the input below or allow replacing.
                                        }}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Remove & Upload New
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                        <Upload size={32} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">
                                            Upload PDF Document
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Supported format: .pdf (Max 10MB)
                                        </p>
                                    </div>
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                if (file.type !== "application/pdf") {
                                                    toast.error("Please upload a PDF file");
                                                    return;
                                                }
                                                if (file.size > 10 * 1024 * 1024) {
                                                    toast.error("File size must be less than 10MB");
                                                    return;
                                                }
                                                setPdfFile(file);
                                                toast.success("PDF selected successfully");
                                            }
                                        }}
                                        className="max-w-xs mx-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={20} className="mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} className="mr-2" />
                                {mode === "create" ? "Create Paper" : "Update Paper"}
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
            <ConfirmDialog />
        </div>
    );
}
