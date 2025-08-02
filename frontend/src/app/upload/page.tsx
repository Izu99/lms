
import VideoUploadForm from '@/components/forms/VideoUploadForm';

import PageLayout from '@/components/layout/PageLayout';

export default function UploadPage() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center">
        <VideoUploadForm />
      </div>
    </PageLayout>
  );
}
