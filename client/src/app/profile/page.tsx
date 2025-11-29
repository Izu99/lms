"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  User,
  Lock,
  Save,
  Edit,
  Eye,
  EyeOff,
  School,
  GraduationCap,
  Shield,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface UserData {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  institute?: string;
  year?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  telegram?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  role: "student" | "teacher" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  institute: string;
  year: string;
  phoneNumber: string;
  whatsappNumber: string;
  telegram: string;
  idCardFront: File | null;
  idCardBack: File | null;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorState {
  [key: string]: string;
}

interface Institute {
  _id: string;
  name: string;
  location: string;
}

interface Year {
  _id: string;
  name: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [frontThumbnailUrl, setFrontThumbnailUrl] = useState<string | null>(null);
  const [backThumbnailUrl, setBackThumbnailUrl] = useState<string | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loadingInstitutesYears, setLoadingInstitutesYears] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'id' | 'security'>('profile');

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    institute: "",
    year: "",
    phoneNumber: "",
    whatsappNumber: "",
    telegram: "",
    idCardFront: null,
    idCardBack: null,
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});

  // Enhanced auth headers function
  const getAuthHeaders = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      redirectToLogin("Authentication required");
      return {};
    }
  };

  // Centralized redirect function
  const redirectToLogin = (reason: string = "Authentication required") => {
    console.log("Redirecting to login:", reason);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Enhanced localStorage validation
  const validateStoredData = () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        throw new Error("No authentication data found");
      }

      let userData: UserData;
      try {
        userData = JSON.parse(savedUser);
      } catch (parseError) {
        throw new Error("Invalid user data format in storage");
      }

      const userId = userData._id || userData.id;
      if (!userId || !userData.username) {
        throw new Error("Invalid user data: missing required fields");
      }

      return { token, userData, userId };
    } catch (error) {
      console.error("Storage validation failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const validationResult = validateStoredData();
        if (!validationResult) {
          try {
            await fetchCurrentUserProfile();
            return;
          } catch (altError) {
            redirectToLogin("Invalid or missing authentication data");
            return;
          }
        }

        const { userData, userId } = validationResult;
        setUser(userData);

        // Load form data immediately
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          address: userData.address || "",
          institute: userData.institute || "",
          year: userData.year || "",
          phoneNumber: userData.phoneNumber || "",
          whatsappNumber: userData.whatsappNumber || "",
          telegram: userData.telegram || "",
          idCardFront: null, // Files are not pre-filled, only their URLs for preview
          idCardBack: null, // Files are not pre-filled, only their URLs for preview
          newPassword: "",
          confirmPassword: "",
        });

        // Set image thumbnail URLs if images exist
        if (userData.idCardFrontImage) {
          setFrontThumbnailUrl(`${API_URL}${userData.idCardFrontImage}`);
        }
        if (userData.idCardBackImage) {
          setBackThumbnailUrl(`${API_URL}${userData.idCardBackImage}`);
        }

        // Fetch fresh profile data
        await fetchUserProfile(userId);

      } catch (error) {
        console.error("Error in profile initialization:", error);
        setError("Failed to initialize profile");
        setTimeout(() => {
          redirectToLogin("Profile initialization failed");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  useEffect(() => {
    const fetchInstitutesAndYears = async () => {
      try {
        setLoadingInstitutesYears(true);
        const [institutesResponse, yearsResponse] = await Promise.all([
          axios.get(`${API_URL}/institutes`),
          axios.get(`${API_URL}/years`)
        ]);
        setInstitutes(institutesResponse.data.institutes);
        setYears(yearsResponse.data.years);
      } catch (error) {
        console.error("Failed to fetch institutes or years", error);
        setError("Failed to load institute and year options.");
      } finally {
        setLoadingInstitutesYears(false);
      }
    };
    fetchInstitutesAndYears();
  }, []);

  const fetchCurrentUserProfile = async () => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length === 0) return;

      const response = await axios.get(
        `${API_URL}/auth/me`,
        { headers }
      );

      const userData = response.data.user || response.data;
      if (!userData) {
        throw new Error("No user data received from server");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        institute: userData.institute || "",
        year: userData.year || "",
        phoneNumber: userData.phoneNumber || "",
        whatsappNumber: userData.whatsappNumber || "",
        telegram: userData.telegram || "",
        idCardFront: null, // Files are not pre-filled, only their URLs for preview
        idCardBack: null, // Files are not pre-filled, only their URLs for preview
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error("Error fetching current user profile:", error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length === 0) return;

      const response = await axios.get(
        `${API_URL}/auth/users/${userId}`,
        { headers }
      );

      const userData = response.data.user || response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        institute: userData.institute || "",
        year: userData.year || "",
        phoneNumber: userData.phoneNumber || "",
        whatsappNumber: userData.whatsappNumber || "",
        telegram: userData.telegram || "",
        idCardFront: null, // Files are not pre-filled, only their URLs for preview
        idCardBack: null, // Files are not pre-filled, only their URLs for preview
        newPassword: "",
        confirmPassword: "",
      });

      // Set image thumbnail URLs if images exist
      if (userData.idCardFrontImage) {
        setFrontThumbnailUrl(`${API_URL}${userData.idCardFrontImage}`);
      }
      if (userData.idCardBackImage) {
        setBackThumbnailUrl(`${API_URL}${userData.idCardBackImage}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.institute) {
      newErrors.institute = "Institute is required";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be 10 digits";
    }

    // Only require ID card images if they are not already present and no new file is uploaded
    if (!user?.idCardFrontImage && !formData.idCardFront) {
      newErrors.idCardFront = "ID Card Front Image is required";
    }
    if (!user?.idCardBackImage && !formData.idCardBack) {
      newErrors.idCardBack = "ID Card Back Image is required";
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    if (!user) {
      setError("User data not available");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updateFormData = new FormData();
      updateFormData.append('username', formData.username.trim());
      updateFormData.append('email', formData.email.trim());
      updateFormData.append('firstName', formData.firstName.trim());
      updateFormData.append('lastName', formData.lastName.trim());
      updateFormData.append('address', formData.address.trim());
      updateFormData.append('institute', formData.institute);
      updateFormData.append('year', formData.year);
      updateFormData.append('phoneNumber', formData.phoneNumber.trim());
      updateFormData.append('whatsappNumber', formData.whatsappNumber.trim());
      updateFormData.append('telegram', formData.telegram.trim());

      if (formData.newPassword) {
        updateFormData.append('newPassword', formData.newPassword);
      }

      if (formData.idCardFront) {
        updateFormData.append('idCardFront', formData.idCardFront);
      }
      if (formData.idCardBack) {
        updateFormData.append('idCardBack', formData.idCardBack);
      }

      const headers = getAuthHeaders();
      if (Object.keys(headers).length === 0) return;

      const userId = user._id || user.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(
        `${API_URL}/auth/users/${userId}`,
        updateFormData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data.user || response.data;
      if (!updatedUser) {
        throw new Error("No data received from update");
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Reset password fields and image files after successful update
      setFormData(prev => ({
        ...prev,
        idCardFront: null,
        idCardBack: null,
        newPassword: "",
        confirmPassword: "",
      }));

      // Update image thumbnail URLs from the updated user data with cache-busting
      const timestamp = new Date().getTime();
      if (updatedUser.idCardFrontImage) {
        setFrontThumbnailUrl(`${API_URL}${updatedUser.idCardFrontImage}?t=${timestamp}`);
      } else {
        setFrontThumbnailUrl(null);
      }
      if (updatedUser.idCardBackImage) {
        setBackThumbnailUrl(`${API_URL}${updatedUser.idCardBackImage}?t=${timestamp}`);
      } else {
        setBackThumbnailUrl(null);
      }

      setIsEditing(false);
      setError("");
      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          redirectToLogin("Session expired");
          return;
        } else if (error.response?.status === 400) {
          setError(`Update failed: ${error.response.data?.message || "Invalid data"}`);
        } else if (error.response?.status === 409) {
          setError("A user with this username, email, or phone number already exists.");
        } else if (error.response && error.response.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Update failed: ${error.response?.statusText || error.message}`);
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    if (error) {
      setError("");
    }
  };

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange("idCardFront", file);
      setFrontThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange("idCardBack", file);
      setBackThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      handleInputChange("idCardFront", null);
      setFrontThumbnailUrl(null);
      // Also clear the user's stored image if it exists
      if (user) setUser(prev => prev ? { ...prev, idCardFrontImage: undefined } : null);
    } else {
      handleInputChange("idCardBack", null);
      setBackThumbnailUrl(null);
      // Also clear the user's stored image if it exists
      if (user) setUser(prev => prev ? { ...prev, idCardBackImage: undefined } : null);
    }
  };

  const handleCancelEdit = () => {
    if (!user) return;

    setFormData({
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      address: user.address || "",
      institute: user.institute || "",
      year: user.year || "",
      phoneNumber: user.phoneNumber || "",
      whatsappNumber: user.whatsappNumber || "",
      telegram: user.telegram || "",
      idCardFront: null,
      idCardBack: null,
      newPassword: "",
      confirmPassword: "",
    });

    // Reset image previews
    if (user.idCardFrontImage) {
      setFrontThumbnailUrl(`${API_URL}${user.idCardFrontImage}`);
    } else {
      setFrontThumbnailUrl(null);
    }
    if (user.idCardBackImage) {
      setBackThumbnailUrl(`${API_URL}${user.idCardBackImage}`);
    } else {
      setBackThumbnailUrl(null);
    }

    setErrors({});
    setError("");
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <GraduationCap className="text-blue-600" size={20} />;
      case "student":
        return <School className="text-green-600" size={20} />;
      case "admin":
        return <Shield className="text-purple-600" size={20} />;
      default:
        return <User className="text-gray-600" size={20} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "User";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Error</h2>
            <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="text-red-500">⚠️</div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          {user && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={40} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {getDisplayName()}
                  </h2>
                  <p className="text-gray-600 mb-3">@{user.username}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {getRoleIcon(user.role)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      <span>Joined {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
                <Button
                  onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                  disabled={saving}
                >
                  <Edit size={16} />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile Details
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'id' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('id')}
                >
                  ID Verification
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username *
                        </label>
                        <Input
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.username ? "border-red-500" : ""}
                          placeholder="Enter your username"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.email ? "border-red-500" : ""}
                          placeholder="Enter your email"
                          type="email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.firstName ? "border-red-500" : ""}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.lastName ? "border-red-500" : ""}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Input
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.address ? "border-red-500" : ""}
                          placeholder="Enter your address"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institute *
                        </label>
                        <Select
                          onValueChange={(value) => handleInputChange("institute", value)}
                          value={formData.institute}
                          disabled={!isEditing || saving || loadingInstitutesYears}
                        >
                          <SelectTrigger
                            className={`w-full h-10 ${errors.institute ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select an institute" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingInstitutesYears ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              institutes.map((inst) => (
                                <SelectItem key={inst._id} value={inst._id}>
                                  {inst.name} - {inst.location}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.institute && (
                          <p className="text-red-500 text-xs mt-1">{errors.institute}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year *
                        </label>
                        <Select
                          onValueChange={(value) => handleInputChange("year", value)}
                          value={formData.year}
                          disabled={!isEditing || saving || loadingInstitutesYears}
                        >
                          <SelectTrigger
                            className={`w-full h-10 ${errors.year ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingInstitutesYears ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              years.map((yr) => (
                                <SelectItem key={yr._id} value={yr._id}>
                                  {yr.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors.year && (
                          <p className="text-red-500 text-xs mt-1">{errors.year}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          disabled={!isEditing || saving}
                          className={errors.phoneNumber ? "border-red-500" : ""}
                          placeholder="Enter your phone number"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Number (Optional)
                        </label>
                        <Input
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                          disabled={!isEditing || saving}
                          placeholder="Enter your WhatsApp number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telegram Username (Optional)
                        </label>
                        <Input
                          value={formData.telegram}
                          onChange={(e) => handleInputChange("telegram", e.target.value)}
                          disabled={!isEditing || saving}
                          placeholder="Enter your Telegram username"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'id' && (
                <div className="space-y-6">
                  {activeTab === 'id' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Card Front Image
                        </label>
                        {!frontThumbnailUrl && !user?.idCardFrontImage ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              id="idCardFront"
                              accept="image/*"
                              onChange={handleFrontImageChange}
                              className="hidden"
                              disabled={!isEditing || saving}
                            />
                            <label htmlFor="idCardFront" className="cursor-pointer block">
                              <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                <User size={20} className="text-blue-500" />
                              </div>
                              <p className="text-gray-600 text-sm">Upload Front</p>
                            </label>
                          </div>
                        ) : (
                          <div className="relative w-full max-h-32 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image
                              src={frontThumbnailUrl || `${API_URL}${user?.idCardFrontImage}`}
                              alt="ID Card Front Thumbnail"
                              width={200} // Example width, adjust as needed
                              height={120} // Example height, adjust as needed
                              objectFit="contain"
                            />                                          {isEditing && (
                              <Button
                                type="button"
                                onClick={() => removeImage("front")}
                                className="absolute top-1 right-1 p-1 h-auto w-auto bg-red-500 hover:bg-red-600 text-white rounded-full"
                                disabled={saving}
                              >
                                <X size={14} />
                              </Button>
                            )}
                          </div>
                        )}
                        {errors.idCardFront && (
                          <p className="text-red-500 text-xs mt-1">{errors.idCardFront}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Card Back Image
                        </label>
                        {!backThumbnailUrl && !user?.idCardBackImage ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                            <input
                              type="file"
                              id="idCardBack"
                              accept="image/*"
                              onChange={handleBackImageChange}
                              className="hidden"
                              disabled={!isEditing || saving}
                            />
                            <label htmlFor="idCardBack" className="cursor-pointer block">
                              <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                <User size={20} className="text-blue-500" />
                              </div>
                              <p className="text-gray-600 text-sm">Upload Back</p>
                            </label>
                          </div>
                        ) : (
                          <div className="relative w-full max-h-32 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image
                              src={backThumbnailUrl || `${API_URL}${user?.idCardBackImage}`}
                              alt="ID Card Back Thumbnail"
                              width={200} // Example width, adjust as needed
                              height={120} // Example height, adjust as needed
                              objectFit="contain"
                            />                                          {isEditing && (
                              <Button
                                type="button"
                                onClick={() => removeImage("back")}
                                className="absolute top-1 right-1 p-1 h-auto w-auto bg-red-500 hover:bg-red-600 text-white rounded-full"
                                disabled={saving}
                              >
                                <X size={14} />
                              </Button>
                            )}
                          </div>
                        )}
                        {errors.idCardBack && (
                          <p className="text-red-500 text-xs mt-1">{errors.idCardBack}</p>
                        )}
                      </div>
                    </div>
                  )}                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">
                          <Lock size={18} className="inline mr-2" />
                          Change Password
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                placeholder="Enter new password"
                                disabled={!isEditing || saving}
                                className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                disabled={!isEditing || saving}
                              >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            {errors.newPassword && (
                              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm new password"
                                disabled={!isEditing || saving}
                                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                disabled={!isEditing || saving}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          Leave password fields empty if you do not want to change your password.
                        </p>
                      </div>
                    </div>
                  )}                </div>
              )}

              {/* Save Button - Only when editing */}
              {isEditing && (
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save size={16} />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
