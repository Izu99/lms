import VideoForm from "../VideoForm";

interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
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
  createdAt: string;
}

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  video?: VideoData | null;
}

export function CreateVideoModal({ isOpen, onClose, onSuccess, video }: CreateVideoModalProps) {
  if (!isOpen) return null;

  return (
    <VideoForm
      video={video}
      onSuccess={() => {
        if (onSuccess) onSuccess();
        onClose();
      }}
      onClose={onClose}
    />
  );
}
