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
import { Scale, AlertTriangle, CheckCircle, Lock, FileText, X } from "lucide-react";

interface TermsConditionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TermsConditionsModal({ open, onOpenChange }: TermsConditionsModalProps) {
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

                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2 pr-8">
                        <Scale size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Terms & Conditions</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 pr-8">
                        Terms & Conditions for ezyICT
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 pr-8">
                        By using our platform, you agree to these terms.
                    </DialogDescription>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Scroll to read full terms</span>
                    </div>
                </DialogHeader>

                <div className="flex-1 w-full overflow-y-auto privacy-scroll-container">
                    <div className="p-6 md:p-8 space-y-10">
                        {/* Introduction */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <FileText className="text-purple-600 dark:text-purple-400" size={20} />
                                Welcome to ezyICT
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                                Welcome to ezyICT. By accessing our website or using our services, you agree to the following Terms and Conditions. Please read them carefully. If you do not agree with these terms, please do not use our platform.
                            </p>
                        </div>

                        <div className="grid gap-10">
                            {/* 1. Use of the Website */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
                                    Use of the Website
                                </h3>
                                <ul className="pl-4 border-l-2 border-purple-100 dark:border-purple-800 space-y-3">
                                    <li className="flex gap-3 items-start text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-600 dark:text-slate-400">You must be at least <strong className="text-slate-900 dark:text-slate-100">16 years old</strong> or have parental consent to use our platform</span>
                                    </li>
                                    <li className="flex gap-3 items-start text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-600 dark:text-slate-400">You are responsible for maintaining the confidentiality of your account and password</span>
                                    </li>
                                    <li className="flex gap-3 items-start text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-600 dark:text-slate-400">You agree to provide accurate and complete information during registration</span>
                                    </li>
                                    <li className="flex gap-3 items-start text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-600 dark:text-slate-400">Unauthorized use of the platform is strictly prohibited</span>
                                    </li>
                                </ul>
                            </section>

                            {/* 2. Courses and Services */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
                                    Courses and Services
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm md:text-base">
                                        <AlertTriangle className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300">Course content, pricing, and availability may change without notice</span>
                                    </li>
                                    <li className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm md:text-base">
                                        <AlertTriangle className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300">Access to courses is granted <strong>only after successful payment</strong></span>
                                    </li>
                                    <li className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm md:text-base">
                                        <AlertTriangle className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300"><strong>Sharing course materials or account credentials is strictly prohibited</strong></span>
                                    </li>
                                </ul>
                            </section>

                            {/* 3. Payments */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
                                    Payments
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300">All payments are processed securely via <strong>PayHere</strong></span>
                                    </li>
                                    <li className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300">ezyICT <strong>does not store</strong> payment card information</span>
                                    </li>
                                    <li className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm md:text-base">
                                        <CheckCircle className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={18} />
                                        <span className="text-slate-700 dark:text-slate-300">We reserve the right to cancel or refuse payments suspected of fraud</span>
                                    </li>
                                </ul>
                            </section>

                            {/* 4. Intellectual Property */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <Lock className="text-purple-600 dark:text-purple-400" size={20} />
                                    Intellectual Property
                                </h3>
                                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        All content including <strong>videos, documents, logos, and materials</strong> are the intellectual property of <strong>ezyICT</strong> and may not be copied or distributed without permission. Unauthorized use is a violation of intellectual property rights and may result in legal action.
                                    </p>
                                </div>
                            </section>

                            {/* 5. Limitation of Liability */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
                                    Limitation of Liability
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-4 font-semibold">ezyICT shall not be liable for:</p>
                                <ul className="space-y-2 pl-4 border-l-2 border-purple-100 dark:border-purple-800">
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">Service interruptions or downtime</li>
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">Data loss due to external factors</li>
                                    <li className="text-sm md:text-base text-slate-600 dark:text-slate-400">Indirect or consequential damages</li>
                                </ul>
                            </section>

                            {/* 6. Modifications */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-bold">4</span>
                                    Modifications to Terms
                                </h3>
                                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        We reserve the right to update these Terms and Conditions at any time. Continued use of the platform indicates your acceptance of any changes. We encourage you to review these terms periodically.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Footer note */}
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-800 pt-6">
                            For questions about our terms, please contact our support team at support@ezyict.lk
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
