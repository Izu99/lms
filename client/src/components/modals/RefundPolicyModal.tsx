"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DollarSign, Clock, AlertCircle, CheckCircle, X } from "lucide-react";

interface RefundPolicyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RefundPolicyModal({ open, onOpenChange }: RefundPolicyModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full max-w-[1200px] h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950"
                showCloseButton={false}
                style={{ maxWidth: '1200px' }}
            >
                <DialogHeader className="relative px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 shrink-0">
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-800 dark:data-[state=open]:bg-slate-800">
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>

                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2 pr-8">
                        <DollarSign size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Refund Policy</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 pr-8">
                        Refund Policy for ezyICT
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 pr-8">
                        Our transparent refund terms and conditions.
                    </DialogDescription>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Scroll to read full policy</span>
                    </div>
                </DialogHeader>

                <div className="flex-1 w-full overflow-y-auto privacy-scroll-container">
                    <div className="p-6 md:p-8 space-y-10">
                        {/* Introduction */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <DollarSign className="text-orange-600 dark:text-orange-400" size={20} />
                                Thank You for Choosing ezyICT
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                                Thank you for choosing ezyICT Learning Management System. We value your trust and aim to provide high-quality educational services. Please read our refund policy carefully before making a payment.
                            </p>
                        </div>

                        <div className="grid gap-10">
                            {/* 1. Refund Eligibility */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-sm font-bold">1</span>
                                    Refund Eligibility
                                </h3>
                                <div className="pl-4 border-l-2 border-orange-100 dark:border-orange-800 space-y-4 text-sm md:text-base text-slate-600 dark:text-slate-400">
                                    <p><strong className="text-slate-900 dark:text-slate-100">Payments made for online courses, physical classes, tutorials, or digital learning materials are generally non-refundable</strong>, except under the conditions listed below.</p>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Refunds may be considered if:</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>A duplicate payment was made for the same course</li>
                                            <li>A technical error occurred during payment processing</li>
                                            <li>The course or service was cancelled by ezyICT</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Refund Process */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-sm font-bold">2</span>
                                    Refund Process
                                </h3>
                                <div className="pl-4 border-l-2 border-orange-100 dark:border-orange-800 space-y-4">
                                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400"><strong className="text-slate-900 dark:text-slate-100">All payments are processed via PayHere.</strong> Approved refunds will be issued <strong>only to the original payment method</strong> used during checkout.</p>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm md:text-base">Refunds are handled as:</p>
                                        <div className="space-y-3">
                                            <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm md:text-base">
                                                <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={20} />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Instant Refunds</h4>
                                                    <p className="text-slate-600 dark:text-slate-400">If refunded on the same day before settlement</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm md:text-base">
                                                <Clock className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={20} />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Delayed Refunds</h4>
                                                    <p className="text-slate-600 dark:text-slate-400">If refunded after settlement (may take <strong>5–10 business days</strong>)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Non-Refundable Items */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <AlertCircle className="text-orange-600 dark:text-orange-400" size={20} />
                                    Non-Refundable Items
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4">The following are <strong className="text-slate-900 dark:text-slate-100">not eligible for refunds</strong>:</p>
                                <ul className="space-y-2 pl-4 border-l-2 border-orange-100 dark:border-orange-800">
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                        <strong className="text-slate-900 dark:text-slate-100">Access to online video courses</strong> after access is granted
                                    </li>
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                        <strong className="text-slate-900 dark:text-slate-100">Downloadable study materials</strong>
                                    </li>
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                        <strong className="text-slate-900 dark:text-slate-100">Exam or registration fees</strong>
                                    </li>
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                        <strong className="text-slate-900 dark:text-slate-100">Customized or personalized educational services</strong>
                                    </li>
                                </ul>
                            </section>

                            {/* 4. Processing Time */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-sm font-bold">3</span>
                                    Processing Time
                                </h3>
                                <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Once approved, refunds are processed within <strong>5–10 business days</strong>, depending on your bank or card provider. Please note that it may take additional time for the refund to appear in your account.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Footer note */}
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-800 pt-6">
                            For questions about refunds, please contact our support team at support@ezyict.lk
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
