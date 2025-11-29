"use client";

import { PaperManagerLayout } from "@/components/paper-manager/PaperManagerLayout";
import { PaperResultsView } from "@/components/shared/papers/PaperResultsView";

export default function PaperManagerResultsPage() {
    return (
        <PaperManagerLayout>
            <PaperResultsView basePath="/paper-manager" />
        </PaperManagerLayout>
    );
}
