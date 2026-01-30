"use client";

import React, { useState } from 'react';
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface PayHereButtonProps {
    itemId: string;
    itemModel: 'Video' | 'Paper' | 'Tute' | 'CoursePackage';
    amount: number;
    title: string;
    className?: string;
    onSuccess?: () => void;
}

export function PayHereButton({ itemId, itemModel, amount, title, className, onSuccess }: PayHereButtonProps) {
    const [loading, setLoading] = useState(false);
    const [payhereData, setPayhereData] = useState<{ url: string, payload: any } | null>(null);

    const handlePayment = async () => {
        if (!amount || amount <= 0 || isNaN(amount)) {
            alert('Invalid payment amount.');
            return;
        }

        try {
            setLoading(true);
            // Initiate payment session with backend
            const response = await api.post<any>('/payments/initiate', {
                itemId,
                itemModel,
                amount,
                title
            });

            if (response.data.success) {
                setPayhereData({
                    url: response.data.payhereUrl,
                    payload: response.data.payload
                });

                // Small delay to ensure state updates before submitting form
                setTimeout(() => {
                    const form = document.getElementById('payhere-form') as HTMLFormElement;
                    if (form) {
                        form.submit();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Failed to start payment. Please try again.');
        } finally {
            if (!payhereData) {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Button
                onClick={handlePayment}
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay LKR {amount.toFixed(2)}
                    </>
                )}
            </Button>

            {/* Hidden Auto-Submit Form */}
            {payhereData && (
                <form
                    id="payhere-form"
                    method="POST"
                    action={payhereData.url}
                    className="hidden"
                >
                    {Object.entries(payhereData.payload).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={String(value)} />
                    ))}
                </form>
            )}
        </>
    );
}
