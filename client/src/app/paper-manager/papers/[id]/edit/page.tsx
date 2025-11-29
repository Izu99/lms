"use client";

import { PaperManagerLayout } from "@/components/paper-manager/PaperManagerLayout";
import { PaperForm } from "@/components/shared/papers/PaperForm";
import { useParams } from "next/navigation";

export default function PaperManagerEditPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <PaperManagerLayout>
            <PaperForm mode="edit" paperId={id} basePath="/paper-manager" />
        </PaperManagerLayout>
    );
}
