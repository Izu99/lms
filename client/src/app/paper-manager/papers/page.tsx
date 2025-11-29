/**
 * PAPER MANAGER - PAPERS PAGE
 * 
 * This page uses the SHARED PapersManagement component.
 * All paper CRUD logic is in /components/shared/papers/PapersManagement.tsx
 * 
 * Changes to paper management functionality should be made in the shared component,
 * not here. This ensures both teachers and paper managers have the same features.
 */

"use client";

import { PaperManagerLayout } from "@/components/paper-manager/PaperManagerLayout";
import { PapersManagement } from "@/components/shared/papers/PapersManagement";

export default function PaperManagerPapersPage() {
    return (
        <PaperManagerLayout>
            <PapersManagement basePath="/paper-manager" />
        </PaperManagerLayout>
    );
}
