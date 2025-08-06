"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const [data, setData] = useState({ username: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 0, text: "Too short" };
    if (password.length < 8) return { strength: 1, text: "Weak" };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/))
      return { strength: 3, text: "Strong" };
    if (
      password.match(/^(?=.*[a-z])(?=.*\d)/) ||
      password.match(/^(?=.*[A-Z])(?=.*\d)/)
    )
      return { strength: 2, text: "Medium" };
    return { strength: 1, text: "Weak" };
  };

  const passwordStrength = getPasswordStrength(data.password);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (data.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      window.location.href = "/auth/login";
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={48} className="text-white" />
            <h1 className="text-4xl font-bold">EduFlow</h1>
          </div>

          <h1 className="text-4xl font-bold">ICT Hub</h1>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Join Our ICT A-Level Class
          </h2>
          <p className="text-lg text-center opacity-90 max-w-md mb-8">
            Access programming tutorials, complete assignments, and prepare for
            your A-Level ICT examinations.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Programming resources & tutorials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Assignment submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Track your A-Level progress</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join ICT Class
          </h2>
          <p className="text-gray-600">
            Create account for A-Level ICT resources
          </p>

          {/* <span className="px-4 bg-white text-gray-500">
            Already registered for ICT class?
          </span> */}
          {/*  */}
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap size={32} className="text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">EduFlow</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join our learning community today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    name="username"
                    placeholder="Choose a username"
                    value={data.username}
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                    className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {data.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.strength === 0
                            ? "text-red-500"
                            : passwordStrength.strength === 1
                            ? "text-orange-500"
                            : passwordStrength.strength === 2
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength.strength
                              ? passwordStrength.strength === 1
                                ? "bg-orange-500"
                                : passwordStrength.strength === 2
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {data.password === confirmPassword ? (
                      <>
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <span className="text-red-500">
                        Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center w-full h-12 px-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
