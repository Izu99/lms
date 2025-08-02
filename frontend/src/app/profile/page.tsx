
import ProfileForm from '@/components/forms/ProfileForm';

import PageLayout from '@/components/layout/PageLayout';

export default function ProfilePage() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center">
        <ProfileForm />
      </div>
    </PageLayout>
  );
}
