"use client";

import React, { useState, useEffect, useRef } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { useAuth } from "@/modules/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import {
  User as UserIcon,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  School,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  FileText,
} from "lucide-react";
import { getFileUrl } from "@/lib/fileUtils";

interface UserProfile {
  _id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  telegram?: string;
  address?: string;
  studentType?: "Physical" | "Online";
  institute?: { _id: string; name: string; location?: string };
  year?: { _id: string; name: string; year?: number };
  alOrOl?: "AL" | "OL";
  idCardFrontImage?: string;
  idCardBackImage?: string;
}

interface InstituteData {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface YearData {
  _id: string;
  year: number;
  name: string;
  isActive: boolean;
}

export default function StudentProfilePage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fetchedInstitutes, setFetchedInstitutes] = useState<InstituteData[]>([]);
  const [fetchedYears, setFetchedYears] = useState<YearData[]>([]);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [newDocs, setNewDocs] = useState<{
    idCardFront: File | null;
    idCardBack: File | null;
  }>({ idCardFront: null, idCardBack: null });
  const [docPreviews, setDocPreviews] = useState<{
    idCardFront: string | null;
    idCardBack: string | null;
  }>({ idCardFront: null, idCardBack: null });

  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    if (!authLoading && authUser) {
      const fetchProfileAndAuxData = async () => {
        try {
          setIsLoadingProfile(true);
          // Fetch user profile
          const userResponse = await api.get<{ user: UserProfile }>(`/auth/users/${authUser.id}`);
          setProfileData(userResponse.data.user);

          // Fetch institutes and years for select dropdowns
          const [institutesRes, yearsRes] = await Promise.all([
            api.get<{ institutes: InstituteData[] }>('/institutes'),
            api.get<{ years: YearData[] }>('/years')
          ]);
          setFetchedInstitutes(institutesRes.data.institutes);
          setFetchedYears(yearsRes.data.years);

        } catch (err) {
          console.error("Error fetching profile or auxiliary data:", err);
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Failed to load profile details.");
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setIsLoadingProfile(false);
        }
      };
      fetchProfileAndAuxData();
    }
  }, [authLoading, authUser, router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idCardFront' | 'idCardBack') => {
    const file = e.target.files?.[0];
    if (file) {
      setNewDocs(prev => ({ ...prev, [field]: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocPreviews(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        address: profileData.address,
        phoneNumber: profileData.phoneNumber,
        username: profileData.username, // Include username for validation
      };
      const response = await api.put<{ user: typeof profileData }>(`/auth/users/${profileData._id}`, payload);
      setProfileData(response.data.user);
      toast.success("Personal details updated successfully!");
    } catch (err) {
      console.error("Error updating personal details:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update personal details.");
        toast.error(err.response?.data?.message || "Failed to update personal details.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitAcademic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        studentType: profileData.studentType,
        alOrOl: profileData.alOrOl,
        institute: profileData.institute?._id || profileData.institute,
        year: profileData.year?._id || profileData.year,
      };
      const response = await api.put<{ user: typeof profileData }>(`/auth/users/${profileData._id}`, payload);
      setProfileData(response.data.user);
      toast.success("Academic information updated successfully!");
    } catch (err) {
      console.error("Error updating academic information:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update academic information.");
        toast.error(err.response?.data?.message || "Failed to update academic information.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        whatsappNumber: profileData.whatsappNumber,
        telegram: profileData.telegram,
      };
      const response = await api.put<{ user: typeof profileData }>(`/auth/users/${profileData._id}`, payload);
      setProfileData(response.data.user);
      toast.success("Contact details updated successfully!");
    } catch (err) {
      console.error("Error updating contact details:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update contact details.");
        toast.error(err.response?.data?.message || "Failed to update contact details.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    setIsSaving(true);
    setError(null);

    const { currentPassword, newPassword, confirmNewPassword } = passwordFields;

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      setIsSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      toast.error("New password must be at least 6 characters.");
      setIsSaving(false);
      return;
    }

    try {
      // NOTE: Backend's updateUserProfile currently does NOT require currentPassword
      // It only checks for newPassword. If you need to validate current password,
      // the backend API for updateUserProfile would need to be updated.
      const payload = {
        newPassword: newPassword,
      };
      await api.put(`/auth/users/${profileData._id}`, payload);
      toast.success("Password updated successfully!");
      setPasswordFields({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); // Clear fields
    } catch (err) {
      console.error("Error updating password:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update password.");
        toast.error(err.response?.data?.message || "Failed to update password.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitDocuments = async () => {
    if (!profileData) return;
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('uploadType', 'id-card');

      if (newDocs.idCardFront) {
        formData.append('idCardFront', newDocs.idCardFront);
      }
      if (newDocs.idCardBack) {
        formData.append('idCardBack', newDocs.idCardBack);
      }

      const response = await api.put<{ user: UserProfile }>(`/auth/users/${profileData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData(response.data.user);
      setNewDocs({ idCardFront: null, idCardBack: null });
      setDocPreviews({ idCardFront: null, idCardBack: null });
      toast.success("Identity documents updated successfully!");
    } catch (err) {
      console.error("Error updating identity documents:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update identity documents.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoadingProfile) {
    // Only show loading component during initial fetch when not covered by global LoadingScreen
    // The global loading screen covers the very initial load.
    // This is for subsequent fetches within the page if needed.
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <ErrorComponent message={error} onRetry={() => router.refresh()} />
      </StudentLayout>
    );
  }

  if (!profileData) {
    return (
      <StudentLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold theme-text-primary mb-2">
            User Profile Not Found
          </h2>
          <p className="theme-text-secondary mb-4">
            Could not retrieve profile details.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">My Profile</h1>
          <p className="theme-text-secondary">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="card rounded-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-700 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveTab("personal")}
              className={`tab-button flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "personal" ? "active text-blue-500" : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <UserIcon size={18} />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`tab-button flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "academic" ? "active text-blue-500" : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <GraduationCap size={18} />
              <span>Academic Information</span>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`tab-button flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "contact" ? "active text-blue-500" : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <MessageCircle size={18} />
              <span>Contact & Social</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`tab-button flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "documents" ? "active text-blue-500" : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <FileText size={18} />
              <span>Identity Documents</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`tab-button flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "security" ? "active text-blue-500" : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <Lock size={18} />
              <span>Security</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card rounded-lg p-6 md:p-8">
          {/* Personal Details Tab */}
          <div id="personal" className={`tab-content ${activeTab === "personal" ? "active" : ""}`}>
            <h2 className="text-xl font-semibold theme-text-primary mb-6">Personal Information</h2>
            <form onSubmit={handleSubmitPersonal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <Input type="text" name="username" value={profileData.username} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <Input type="text" name="firstName" value={profileData.firstName || ""} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <Input type="text" name="lastName" value={profileData.lastName || ""} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <Input type="email" name="email" value={profileData.email || ""} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <Input type="tel" name="phoneNumber" value={profileData.phoneNumber || ""} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <Textarea name="address" rows={3} value={profileData.address || ""} onChange={handleProfileChange} className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required></Textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="submit" className="px-6 py-2.5 rounded-lg font-medium" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* Academic Information Tab */}
          <div id="academic" className={`tab-content ${activeTab === "academic" ? "active" : ""}`}>
            <h2 className="text-xl font-semibold theme-text-primary mb-6">Academic Details</h2>
            <form onSubmit={handleSubmitAcademic}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Student Type</label>
                  <Select
                    name="studentType"
                    value={profileData.studentType || ""}
                    onValueChange={(value) => handleSelectChange("studentType", value)}
                  >
                    <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg text-white">
                      <SelectValue placeholder="Select Student Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online Student</SelectItem>
                      <SelectItem value="Physical">Physical Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Academic Level</label>
                  <Select
                    name="alOrOl"
                    value={profileData.alOrOl || ""}
                    onValueChange={(value) => handleSelectChange("alOrOl", value)}
                  >
                    <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg text-white">
                      <SelectValue placeholder="Select Academic Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OL">O/Level</SelectItem>
                      <SelectItem value="AL">A/Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Institute</label>
                  <Select
                    name="institute"
                    value={profileData.institute?._id || ""}
                    onValueChange={(value) => handleSelectChange("institute", value)}
                  >
                    <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg text-white">
                      <SelectValue placeholder="Select Institute" />
                    </SelectTrigger>
                    <SelectContent>
                      {fetchedInstitutes.map((inst) => (
                        <SelectItem key={inst._id} value={inst._id}>
                          {inst.name} - {inst.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Academic Year</label>
                  <Select
                    name="year"
                    value={profileData.year?._id || ""}
                    onValueChange={(value) => handleSelectChange("year", value)}
                  >
                    <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg text-white">
                      <SelectValue placeholder="Select Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {fetchedYears.map((y) => (
                        <SelectItem key={y._id} value={y._id}>
                          {y.name} (A-Level Year {y.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="submit" className="px-6 py-2.5 rounded-lg font-medium" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact & Social Tab */}
          <div id="contact" className={`tab-content ${activeTab === "contact" ? "active" : ""}`}>
            <h2 className="text-xl font-semibold theme-text-primary mb-6">Contact & Social Media</h2>
            <form onSubmit={handleSubmitContact}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                  <Input type="tel" name="whatsappNumber" value={profileData.whatsappNumber || ""} onChange={handleProfileChange} placeholder="+94 XX XXX XXXX" className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" />
                  <p className="text-gray-500 text-xs mt-1">For course updates and notifications</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telegram Username</label>
                  <Input type="text" name="telegram" value={profileData.telegram || ""} onChange={handleProfileChange} placeholder="@username" className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" />
                  <p className="text-gray-500 text-xs mt-1">For group discussions and support</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="submit" className="px-6 py-2.5 rounded-lg font-medium" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>

          {/* Identity Documents Tab */}
          <div id="documents" className={`tab-content ${activeTab === "documents" ? "active" : ""}`}>
            <h2 className="text-xl font-semibold theme-text-primary mb-2">Identity Documents</h2>
            <p className="theme-text-secondary mb-8 text-sm">Update your ID card images for verification purposes</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Front ID Card */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">ID Card (Front)</label>
                <div
                  className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-700 bg-gray-800/30 transition-all hover:border-blue-500/50"
                  style={{ aspectRatio: '16/10' }}
                >
                  {docPreviews.idCardFront || profileData.idCardFrontImage ? (
                    <img
                      src={docPreviews.idCardFront || getFileUrl(profileData.idCardFrontImage, 'image')}
                      alt="ID Front"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <ImageIcon size={48} className="mb-2 opacity-20" />
                      <p className="text-xs">No image uploaded</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputFrontRef.current?.click()}
                    >
                      <Upload size={16} className="mr-2" />
                      {profileData.idCardFrontImage ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputFrontRef}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idCardFront')}
                />
              </div>

              {/* Back ID Card */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">ID Card (Back)</label>
                <div
                  className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-700 bg-gray-800/30 transition-all hover:border-blue-500/50"
                  style={{ aspectRatio: '16/10' }}
                >
                  {docPreviews.idCardBack || profileData.idCardBackImage ? (
                    <img
                      src={docPreviews.idCardBack || getFileUrl(profileData.idCardBackImage, 'image')}
                      alt="ID Back"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <ImageIcon size={48} className="mb-2 opacity-20" />
                      <p className="text-xs">No image uploaded</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputBackRef.current?.click()}
                    >
                      <Upload size={16} className="mr-2" />
                      {profileData.idCardBackImage ? "Replace" : "Upload"}
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputBackRef}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'idCardBack')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                onClick={handleSubmitDocuments}
                className="px-6 py-2.5 rounded-lg font-medium"
                disabled={isSaving || (!newDocs.idCardFront && !newDocs.idCardBack)}
              >
                {isSaving ? "Saving..." : "Update Identity Documents"}
              </Button>
            </div>
          </div>

          {/* Security Tab */}
          <div id="security" className={`tab-content ${activeTab === "security" ? "active" : ""}`}>
            <h2 className="text-xl font-semibold theme-text-primary mb-6">Security Settings</h2>

            <div className="card rounded-lg p-6 mb-6 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Password Security</h3>
                  <p className="text-gray-400 text-sm">Keep your account secure by using a strong password</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitSecurity}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} name="currentPassword" value={passwordFields.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} name="newPassword" value={passwordFields.newPassword} onChange={handlePasswordChange} id="newPassword" placeholder="Enter new password" className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Minimum 8 characters, include uppercase, lowercase, and numbers</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <Input type="password" name="confirmNewPassword" value={passwordFields.confirmNewPassword} onChange={handlePasswordChange} id="confirmConfirmPassword" placeholder="Confirm new password" className="input-field w-full px-4 py-3 rounded-lg theme-text-primary" required />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button type="submit" className="px-6 py-2.5 rounded-lg font-medium" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .tab-button {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tab-button.active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
          box-shadow: 0 -2px 10px rgba(59, 130, 246, 0.5);
        }

        .input-field {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(71, 85, 105, 0.5);
          transition: all 0.3s ease;
        }

        .input-field:focus {
          background: rgba(30, 41, 59, 0.8);
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .card {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }

        .tab-content {
          display: none;
          animation: fadeIn 0.4s ease;
        }

        .tab-content.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: rgba(71, 85, 105, 0.5);
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(71, 85, 105, 0.7);
        }
      `}</style>
    </StudentLayout>
  );
}