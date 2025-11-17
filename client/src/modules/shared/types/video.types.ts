export interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  views?: number;
  uploadedBy: string; // User ID
  institute?: { _id: string; name: string };
  year?: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
