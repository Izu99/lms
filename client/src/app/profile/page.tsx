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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface UserData {
  _id?: string;
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "student" | "teacher" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorState {
  [key: string]: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    username: "",
    firstName: "",
    lastName: "",
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
      redirectToLogin("Authentication token not found");
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
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          newPassword: "",
          confirmPassword: "",
        });

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

  const fetchCurrentUserProfile = async () => {
    try {
      const headers = getAuthHeaders();
      if (Object.keys(headers).length === 0) return;

      const response = await axios.get(
        `http://localhost:5000/api/auth/me`,
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
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
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
        `http://localhost:5000/api/auth/users/${userId}`,
        { headers }
      );
      
      const userData = response.data.user || response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setFormData({
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        newPassword: "",
        confirmPassword: "",
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          redirectToLogin("Session expired");
          return;
        } else if (error.response?.status === 404) {
          setError("User not found");
        } else if (error.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Failed to load profile: ${error.response?.statusText || error.message}`);
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
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
      
      const updateData: Partial<UserData & { newPassword?: string }> = {
        username: formData.username.trim(),
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
      };

      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      const headers = getAuthHeaders();
      if (Object.keys(headers).length === 0) return;

      const userId = user._id || user.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(
        `http://localhost:5000/api/auth/users/${userId}`,
        updateData,
        { headers }
      );

      const updatedUser = response.data.user || response.data;
      if (!updatedUser) {
        throw new Error("No data received from update");
      }
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      
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
          setError("Username already exists");
        } else if (error.response?.status >= 500) {
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    if (error) {
      setError("");
    }
  };

  const handleCancelEdit = () => {
    if (!user) return;
    
    setFormData({
      username: user.username || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      newPassword: "",
      confirmPassword: "",
    });
    
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">You will be redirected to login.</p>
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
                        First Name (Optional)
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing || saving}
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name (Optional)
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing || saving}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change Section - Always Visible */}
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
                    Leave password fields empty if you don't want to change your password.
                  </p>
                </div>

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
        </div>
      </main>
    </div>
  );
}
