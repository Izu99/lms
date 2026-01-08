"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Mail, Phone, Home, GraduationCap, Calendar, ShieldCheck, Image as ImageIcon, Info } from "lucide-react";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { getFileUrl } from "@/lib/fileUtils";
import Cookies from "js-cookie";
import { ImageViewerModal } from "./ImageViewerModal";

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
}

export function StudentDetailsModal({ studentId, isOpen, onClose }: StudentDetailsModalProps) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageToView, setCurrentImageToView] = useState<string | null>(null);

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
    <div className="flex items-start gap-4">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const IdCardImage = ({ src, title }: { src?: string; title: string }) => {
    return (
      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        {src ? (
          <img
            src={getFileUrl(src, 'image')}
            alt={title}
            className="rounded-lg border border-border w-full object-contain cursor-pointer"
            onClick={() => {
              setCurrentImageToView(getFileUrl(src, 'image'));
              setIsImageViewerOpen(true);
            }}
          />
        ) : (
          <div className="h-40 w-full flex items-center justify-center bg-muted rounded-lg border-dashed border-border">
            <p className="text-muted-foreground text-sm">Not provided</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {student ? `${student.firstName} ${student.lastName}` : "Student Details"}
                </h2>
                <p className="text-muted-foreground">@{student?.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} className="text-muted-foreground" />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg">
                    <DetailItem icon={<User size={16} />} label="Student ID" value={student._id} />
                    <DetailItem icon={<Mail size={16} />} label="Email" value={student.email} />
                    <DetailItem icon={<Phone size={16} />} label="Phone Number" value={student.phoneNumber} />
                    <DetailItem icon={<i className="fab fa-whatsapp text-xl w-4 h-4" />} label="WhatsApp" value={student.whatsappNumber} />
                    <DetailItem icon={<i className="fab fa-telegram-plane text-xl w-4 h-4" />} label="Telegram" value={student.telegram} />
                  </div>
                  <div className="border-t border-border pt-6 bg-muted/20 p-4 rounded-lg">
                    <DetailItem icon={<Home size={16} />} label="Address" value={student.address} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6 bg-muted/20 p-4 rounded-lg">
                    <DetailItem icon={<GraduationCap size={16} />} label="Institute" value={student.institute ? `${student.institute.name} - ${student.institute.location}` : "Not set"} />
                    <DetailItem icon={<Calendar size={16} />} label="Academic Year" value={student.year?.name} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6 bg-muted/20 p-4 rounded-lg">
                    <DetailItem icon={<ShieldCheck size={16} />} label="Status" value={student.status} />
                    <DetailItem icon={<User size={16} />} label="Student Type" value={student.studentType} />
                    <DetailItem icon={<Calendar size={16} />} label="Joined On" value={new Date(student.createdAt).toLocaleDateString()} />
                  </div>
                  {student.notes && (
                    <div className="border-t border-border pt-6 bg-muted/20 p-4 rounded-lg">
                      <DetailItem icon={<Info size={16} />} label="Teacher's Notes" value={student.notes} />
                    </div>
                  )}
                </div>

                {/* Right Column: ID Cards */}
                <div className="space-y-6">
                  <IdCardImage src={student.idCardFrontImage} title="ID Card (Front)" />
                  <IdCardImage src={student.idCardBackImage} title="ID Card (Back)" />
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
