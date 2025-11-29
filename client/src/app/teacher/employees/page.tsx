"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { UserCog, Plus, Edit, Trash2, Eye, EyeOff, Search, Shield } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

interface Employee {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    whatsappNumber?: string;
    role: "paper_manager" | "video_manager";
    status: string;
    createdAt: string;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { confirm, ConfirmDialog } = useConfirmDialog();

    // Form state
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        whatsappNumber: "",
        role: "paper_manager" as "paper_manager" | "video_manager",
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/employees`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(response.data.data);
        } catch (error: any) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!editingEmployee && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!editingEmployee && formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                whatsappNumber: formData.whatsappNumber,
                role: formData.role,
                ...(formData.password && { password: formData.password }),
            };

            if (editingEmployee) {
                await axios.put(`${API_URL}/employees/${editingEmployee._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Employee updated successfully");
            } else {
                await axios.post(`${API_URL}/employees`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Employee created successfully");
            }

            fetchEmployees();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving employee:", error);
            toast.error(error.response?.data?.message || "Failed to save employee");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Delete Employee',
            description: 'Are you sure you want to delete this employee? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Employee deleted successfully");
            fetchEmployees();
        } catch (error: any) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee");
        }
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormData({
            username: employee.username,
            email: employee.email,
            password: "",
            confirmPassword: "",
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            phoneNumber: employee.phoneNumber,
            whatsappNumber: employee.whatsappNumber || "",
            role: employee.role,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            whatsappNumber: "",
            role: "paper_manager",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paperManagers = filteredEmployees.filter((e) => e.role === "paper_manager");
    const videoManagers = filteredEmployees.filter((e) => e.role === "video_manager");

    return (
        <TeacherLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-10 h-10 sidebar-icon sidebar-icon-employees">
                                <UserCog className="w-6 h-6" />
                            </div>
                            Employee Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage Paper and Video Managers
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Employee
                    </Button>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                <UserCog className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Employees</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Paper Managers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{paperManagers.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Video Managers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{videoManagers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee List */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700"
                    >
                        <UserCog size={64} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-2xl font-semibold text-foreground mb-2">No Employees Yet</h3>
                        <p className="text-muted-foreground mb-6">Start by creating your first employee account</p>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600"
                        >
                            <Plus size={20} className="mr-2" />
                            Create Employee
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee, index) => (
                            <motion.div
                                key={employee._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${employee.role === "paper_manager"
                                                ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                                : "bg-gradient-to-br from-orange-400 to-orange-600"
                                                }`}
                                        >
                                            <UserCog className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                {employee.firstName} {employee.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">@{employee.username}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Email:</span> {employee.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Phone:</span> {employee.phoneNumber}
                                    </p>
                                    {employee.whatsappNumber && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">WhatsApp:</span> {employee.whatsappNumber}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${employee.role === "paper_manager"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                            : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                            }`}
                                    >
                                        {employee.role === "paper_manager" ? "Paper Manager" : "Video Manager"}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(employee)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingEmployee ? "Edit Employee" : "Add New Employee"}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="paper_manager">Paper Manager</option>
                                    <option value="video_manager">Video Manager</option>
                                </select>
                            </div>

                            {/* Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password {!editingEmployee && <span className="text-red-500">*</span>}
                                    {editingEmployee && <span className="text-sm text-gray-500">(Leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required={!editingEmployee}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            {!editingEmployee && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                >
                                    {editingEmployee ? "Update Employee" : "Create Employee"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            <ConfirmDialog />
        </TeacherLayout>
    );
}
