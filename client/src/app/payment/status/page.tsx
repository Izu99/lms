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
    const [showBypass, setShowBypass] = useState(false);
    const [verifyingManually, setVerifyingManually] = useState(false);

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
                const response = await api.get<any>(`/payments/status?orderId=${orderId}`);
                const data = response.data;
                console.log('Payment status response:', data);
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

    // Logic to determine the redirect path
    const getRedirectPath = () => {
        if (!details) return "/student/dashboard";

        const { itemModel, itemId } = details;
        switch (itemModel) {
            case 'Video':
                return `/student/videos/${itemId}`;
            case 'Paper':
                return `/student/papers/${itemId}`;
            case 'Tute':
                return `/student/tutes/${itemId}`;
            case 'CoursePackage':
                return `/student/course-packages/${itemId}`;
            default:
                return "/student/dashboard";
        }
    };

    // Auto-redirect on success after a short delay
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                router.push(getRedirectPath());
            }, 3000); // 3 second delay to show success message
            return () => clearTimeout(timer);
        }
    }, [status, details]);

    // Show bypass button after 5 seconds if still loading
    useEffect(() => {
        if (status === 'loading') {
            const timer = setTimeout(() => setShowBypass(true), 5000); // Show bypass after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleManualVerify = async () => {
        if (!orderId) return;
        setVerifyingManually(true);
        try {
            await api.post<any>('/payments/verify-sandbox', { orderId });
            // Immediately check status again
            const response = await api.get<any>(`/payments/status?orderId=${orderId}`);
            if (response.data.status === 'PAID') {
                setDetails(response.data);
                setStatus('success');
            }
        } catch (error) {
            console.error('Manual verification failed:', error);
        } finally {
            setVerifyingManually(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Verifying Payment...</h1>
                <p className="text-gray-600 mt-2 text-center max-w-md">
                    Please wait while we confirm your transaction with PayHere.
                </p>

                {showBypass && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center max-w-sm">
                        <p className="text-sm text-blue-800 mb-4">
                            Verification taking too long? If you already completed the payment in sandbox, you can manually verify it.
                        </p>
                        <Button
                            onClick={handleManualVerify}
                            disabled={verifyingManually}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {verifyingManually ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                            ) : (
                                "Manually Verify (Sandbox Only)"
                            )}
                        </Button>
                    </div>
                )}
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
                    Thank you for your purchase. Redirecting you to your content in a few seconds...
                </p>

                {details && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
                        {details.itemTitle && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Item:</span>
                                <span className="font-semibold">{details.itemTitle}</span>
                            </div>
                        )}
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Amount Paid:</span>
                            <span className="font-semibold">{details.currency} {details.amount?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono">{orderId}</span>
                        </div>
                    </div>
                )}

                <Link href={getRedirectPath()}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                        Start Learning Now <ArrowRight className="ml-2 w-4 h-4" />
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
