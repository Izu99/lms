"use client";

import { Suspense } from "react";
import RoleBasedRedirect from "@/components/RoleBasedRedirect";
import { ClientLayoutProvider } from "@/components/common/ClientLayoutProvider";

function HomePageContent() {
  return <RoleBasedRedirect />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLayoutProvider>
        <HomePageContent />
      </ClientLayoutProvider>
    </Suspense>
  );
}
