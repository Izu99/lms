
import AllowStudentsForm from '@/components/forms/AllowStudentsForm';

import PageLayout from '@/components/layout/PageLayout';

export default function AllowStudentsPage() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center">
        <AllowStudentsForm />
      </div>
    </PageLayout>
  );
}
