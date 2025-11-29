"use client";

import { PaperManagerLayout } from "@/components/paper-manager/PaperManagerLayout";
import { PaperForm } from "@/components/shared/papers/PaperForm";

export default function PaperManagerCreatePage() {
    return (
        <PaperManagerLayout>
            <PaperForm mode="create" basePath="/paper-manager" />
        </PaperManagerLayout>
    );
}
