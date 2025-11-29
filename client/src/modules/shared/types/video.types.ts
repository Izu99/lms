export interface VideoData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadedBy: {
    _id: string;
    username: string;
    role: string;
  };
  institute?: {
    _id: string;
    name: string;
    location: string;
  };
  year?: {
    _id: string;
    year: number;
    name: string;
  };
  academicLevel?: string; // Add academicLevel property
  createdAt: string;
  updatedAt: string;
  availability?: string;
  price?: number;
  views?: number;
  thumbnailUrl?: string;
  thumbnail?: string; // Raw filename from backend
}