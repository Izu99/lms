import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import VideoForm from "../VideoForm";
import { VideoData } from '@/modules/shared/types/video.types';

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  video?: VideoData | null;
}

export function CreateVideoModal({ isOpen, onClose, onSuccess, video }: CreateVideoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <VideoForm
      video={video}
      onSuccess={() => {
        if (onSuccess) onSuccess();
        onClose();
      }}
      onClose={onClose}
    />,
    document.body
  );
}
