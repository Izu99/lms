import VideoForm from "../VideoForm";

import { VideoData } from '@/modules/shared/types/video.types';

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
