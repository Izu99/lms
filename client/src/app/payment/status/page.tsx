"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from "@/lib/api-client";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order_id'); // PayHere might send order_id or we set orderId
    const canceled = searchParams.get('cancel');

    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'canceled'>('loading');
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        if (canceled) {
            setStatus('canceled');
            return;
        }

        if (!orderId) {
            setStatus('failed');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await api.get(`/payments/status?orderId=${orderId}`);
                const data = response.data;
                setDetails(data);

                if (data.status === 'PAID') {
                    setStatus('success');
                } else if (data.status === 'FAILED') {
                    setStatus('failed');
                } else {
                    // If still pending, maybe wait and retry? For now, show pending as failed/processing
                    setStatus('loading');
                    // Polling logic could be added here
                    setTimeout(checkStatus, 3000);
                }
            } catch (error) {
                console.error('Error checking status:', error);
                setStatus('failed');
            }
        };

        checkStatus();
    }, [orderId, canceled]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
                <p className="text-gray-600 mt-2">Please wait while we confirm your transaction.</p>
            </div>
        );
    }

    if (status === 'canceled') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <XCircle className="w-16 h-16 text-orange-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Payment Canceled</h1>
                <p className="text-gray-600 mt-2 text-center max-w-md">
                    You canceled the payment process. No charges were made.
                </p>
                <div className="mt-8">
                    <Link href="/">
                        <Button variant="outline">Return to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
                <p className="text-gray-600 mt-2 text-center max-w-md">
                    We couldn't confirm your payment. If you were charged, please contact support with Order ID: <span className="font-mono font-bold">{orderId}</span>
                </p>
                <div className="mt-8 flex gap-4">
                    <Link href="/">
                        <Button variant="outline">Return to Home</Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="destructive">Contact Support</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. You now have full access to this content.
                </p>

                {details && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Amount Paid:</span>
                            <span className="font-semibold">{details.currency} {details.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono">{orderId}</span>
                        </div>
                    </div>
                )}

                <Link href="/">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                        Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
