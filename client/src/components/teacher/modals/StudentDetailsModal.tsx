"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Mail, Phone, Home, GraduationCap, Calendar, ShieldCheck, Image as ImageIcon, Info } from "lucide-react";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import Cookies from "js-cookie";
import { ImageViewerModal } from "./ImageViewerModal";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";

interface StudentData {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  whatsappNumber?: string;
  telegram?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  studentType?: string;
  status: string;
  notes?: string;
  institute?: { name: string; location: string };
  year?: { name: string; year: number };
  createdAt: string;
}

interface StudentDetailsModalProps {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StudentDetailsModal({ studentId, isOpen, onClose, onSuccess }: StudentDetailsModalProps) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageToView, setCurrentImageToView] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const { isCollapsed } = useSidebar();

  const handleStatusChange = async (newStatus: string) => {
    if (!student || student.status === newStatus) return;

    try {
      setUpdatingStatus(true);
      const token = Cookies.get("token");
      await axios.put(
        `${API_URL}/auth/students/${student._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudent({ ...student, status: newStatus });
      if (onSuccess) onSuccess();
      toast.success("Student status updated successfully");
    } catch (err) {
      console.error("Error updating student status:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchStudentDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const token = Cookies.get("token");
          const response = await axios.get(`${API_URL}/auth/users/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudent(response.data.user);
        } catch (err) {
          console.error("Error fetching student details:", err);
          setError("Failed to load student details.");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentDetails();
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-2 sm:gap-4">
      <div className="text-muted-foreground sm:mt-1">{icon}</div>
      <div className="min-w-0 w-full">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground break-words">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const IdCardImage = ({ src, title }: { src?: string; title: string }) => {
    return (
      <div className="w-full flex flex-col items-center sm:items-start">
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        {src ? (
          <img
            src={getFileUrl(src, 'image')}
            alt={title}
            className="rounded-lg border border-border w-full h-48 object-cover cursor-pointer bg-muted/20"
            onClick={() => {
              setCurrentImageToView(getFileUrl(src, 'image'));
              setIsImageViewerOpen(true);
            }}
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center bg-muted rounded-lg border-dashed border-border">
            <p className="text-muted-foreground text-sm">Not provided</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-72'}`}
        onClick={onClose}
      >
        <div 
          className="bg-card w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-border rounded-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <User size={24} className="text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  {student ? `${student.firstName} ${student.lastName}` : "Student Details"}
                </h2>
                <p className="text-muted-foreground text-sm truncate">@{student?.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full shrink-0">
              <X size={20} className="text-muted-foreground" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Info size={48} className="text-destructive mb-4" />
                <p className="text-destructive-foreground font-semibold">{error}</p>
              </div>
            )}
            {!loading && !error && student && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-border/50">
                    {/* Contact Details - ID, Email, Phone */}
                    <DetailItem icon={<User size={16} />} label="Student ID" value={student._id} />
                    <DetailItem icon={<Mail size={16} />} label="Email" value={student.email} />
                    <DetailItem icon={<Phone size={16} />} label="Phone Number" value={student.phoneNumber} />

                    {/* Social/Messaging Details - WhatsApp, Telegram */}
                    <DetailItem icon={<i className="fab fa-whatsapp text-lg w-4 h-4" />} label="WhatsApp" value={student.whatsappNumber} />
                    <DetailItem icon={<i className="fab fa-telegram-plane text-lg w-4 h-4" />} label="Telegram" value={student.telegram} />
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
                    <DetailItem icon={<Home size={16} />} label="Address" value={student.address} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <DetailItem icon={<GraduationCap size={16} />} label="Institute" value={student.institute ? `${student.institute.name} - ${student.institute.location}` : "Not set"} />
                    <DetailItem icon={<Calendar size={16} />} label="Academic Year" value={student.year?.name} />
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-xl border border-border/50 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-2 sm:gap-4">
                        <div className="text-muted-foreground sm:mt-1 shrink-0"><ShieldCheck size={16} /></div>
                        <div className="w-full">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Status</p>
                          <div className="relative inline-block w-full max-w-[200px] sm:max-w-none">
                            <select
                              value={student.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              disabled={updatingStatus}
                              className={`appearance-none block w-full pl-3 pr-10 py-1.5 text-sm font-bold border-none focus:ring-2 focus:ring-primary rounded-full cursor-pointer disabled:opacity-50 transition-colors ${
                                student.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                                student.status === 'paid' ? 'bg-blue-500/10 text-blue-500' : 
                                student.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                student.status === 'unpaid' ? 'bg-orange-500/10 text-orange-500' : 
                                'bg-red-500/10 text-red-500'}`}
                            >
                              <option value="active" className="bg-background text-foreground">Active</option>
                              <option value="pending" className="bg-background text-foreground">Pending</option>
                              <option value="inactive" className="bg-background text-foreground">Inactive</option>
                              <option value="paid" className="bg-background text-foreground">Paid</option>
                              <option value="unpaid" className="bg-background text-foreground">Unpaid</option>
                            </select>
                            <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              student.status === 'pending' ? 'text-yellow-600' : 
                              student.status === 'active' ? 'text-green-600' : 
                              student.status === 'paid' ? 'text-blue-600' : 
                              student.status === 'unpaid' ? 'text-orange-600' : 
                              'text-red-600'}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DetailItem icon={<User size={16} />} label="Student Type" value={student.studentType} />
                    </div>
                    <DetailItem icon={<Calendar size={16} />} label="Joined On" value={new Date(student.createdAt).toLocaleDateString()} />
                  </div>
                  
                  {student.notes && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
                      <DetailItem icon={<Info size={16} />} label="Teacher's Notes" value={student.notes} />
                    </div>
                  )}
                </div>

                {/* Right Column: ID Cards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon size={20} className="text-primary" />
                    ID Verification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <IdCardImage src={student.idCardFrontImage} title="ID Card (Front)" />
                    <IdCardImage src={student.idCardBackImage} title="ID Card (Back)" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ImageViewerModal
        imageUrl={currentImageToView}
        isOpen={isImageViewerOpen}
        onClose={() => {
          setIsImageViewerOpen(false);
          setCurrentImageToView(null);
        }}
      />
    </>
  );
}
