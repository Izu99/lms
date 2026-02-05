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
import { Shield, Lock, Eye, FileText, AlertTriangle, CreditCard, Scale, Mail, MapPin, Phone, GraduationCap, X } from "lucide-react";

interface PrivacyPolicyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicyModal({ open, onOpenChange }: PrivacyPolicyModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full max-w-[1200px] h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950"
                showCloseButton={false}
                style={{ maxWidth: '1200px' }}
            >
                <DialogHeader className="relative px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 shrink-0">
                    {/* Close Button - Positioned absolute for proper placement */}
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-800 dark:data-[state=open]:bg-slate-800">
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>

                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2 pr-8">
                        <Shield size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Privacy Policy</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 pr-8">
                        Privacy Policy for ezyICT
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 pr-8">
                        We are committed to protecting your privacy and handling your personal information responsibly.
                    </DialogDescription>
                    {/* Scroll indicator */}
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                                Introduction
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                                At ezyICT, your privacy is our priority. We are dedicated to protecting the personal and sensitive data of all users accessing our Learning Management System (LMS). This Privacy Policy explains how we collect, use, protect, and manage the data you provide to ensure a safe and effective learning experience.
                            </p>
                        </div>

                        <div className="grid gap-10">
                            {/* 1. Information We Collect */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                                    Information We Collect
                                </h3>
                                <div className="pl-4 border-l-2 border-blue-100 dark:border-blue-800 space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-sm">Personal Information</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                                            <li><strong>ID Card Images:</strong> Required only for Physical students to verify their identity and ensure they are genuine enrolled students. We do not collect National Identity Numbers.</li>
                                            <li><strong>Address (Optional):</strong> May be collected for delivering physical tutorial materials and official correspondence when needed.</li>
                                            <li><strong>Contact Details:</strong> Telephone numbers and email addresses used for communication, notifications, and support services.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-sm">Academic and Platform Data</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                                            <li><strong>Video and Study Material Access:</strong> Strictly limited to registered users under applicable regulations.</li>
                                            <li><strong>Platform Interaction:</strong> Data from quizzes, assignments, and AI-powered interactions is securely stored to enhance your academic progress.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 2. How We Protect Your Data */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                                    How We Protect Your Data
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3">
                                        <Lock className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Data Encryption</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">All sensitive information is encrypted during transmission and at rest.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3">
                                        <Shield className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Access Control</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Access to sensitive data is strictly limited to authorized personnel only.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3">
                                        <Eye className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Regular Audits</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Periodic security audits to identify and address potential vulnerabilities.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3">
                                        <CreditCard className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Secure Payments</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Partnering with trusted gateways ensures secure financial data processing.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Data Usage Policy */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                                    Data Usage Policy
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-4 border-l-2 border-blue-100 dark:border-blue-800 text-sm">
                                    Personal information is used solely for academic and administrative purposes, such as tutorial delivery, student verification, and academic progress tracking. Data from platform interactions is used to enhance the quality of the learning experience and provide personalized support.
                                </p>
                            </section>

                            {/* 4. Prohibited Actions */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold">4</span>
                                    Prohibited Actions
                                </h3>
                                <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                            <span className="text-slate-700 dark:text-slate-300 text-sm"><strong>Unauthorized Sharing:</strong> Distribution of LMS content without authorization is strictly forbidden.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                            <span className="text-slate-700 dark:text-slate-300 text-sm"><strong>Misuse of Credentials:</strong> Sharing login credentials with others is prohibited and may result in account suspension.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                            <span className="text-slate-700 dark:text-slate-300 text-sm"><strong>Copyright Violation:</strong> Infringement of intellectual property rights will lead to legal action.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                            <span className="text-slate-700 dark:text-slate-300 text-sm"><strong>Tampering:</strong> Hacking or interfering with the LMS platform is prohibited.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* 5. Third-Party Payment Services */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
                                    Third-Party Payment Services
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-4 border-l-2 border-blue-100 dark:border-blue-800 text-sm">
                                    All payments are securely processed by our trusted payment partners. ezyICT does not store or process any payment-related information (such as credit card details) on its servers. Users are encouraged to review the terms and conditions of the payment provider during the transaction process.
                                </p>
                            </section>

                            {/* 6. Legal Compliance */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-bold">6</span>
                                    Legal Compliance
                                </h3>
                                <div className="flex gap-4 pl-4 border-l-2 border-blue-100 dark:border-blue-800">
                                    <Scale className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={20} />
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                        ezyICT complies with all relevant government regulations related to data protection, digital security, and intellectual property rights. Any violations may result in legal action to protect the integrity of our platform and the rights of our content creators.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </DialogContent>

            <style jsx global>{`
                /* Custom scrollbar for privacy policy modal */
                .privacy-scroll-container {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(59, 130, 246, 0.6) rgba(0, 0, 0, 0.05);
                }
                
                .privacy-scroll-container::-webkit-scrollbar {
                    width: 12px;
                }
                
                .privacy-scroll-container::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 6px;
                }
                
                .privacy-scroll-container::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.6);
                    border-radius: 6px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                
                .privacy-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.9);
                    background-clip: padding-box;
                }
                
                /* Dark mode */
                .dark .privacy-scroll-container {
                    scrollbar-color: rgba(96, 165, 250, 0.6) rgba(255, 255, 255, 0.1);
                }
                
                .dark .privacy-scroll-container::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .dark .privacy-scroll-container::-webkit-scrollbar-thumb {
                    background: rgba(96, 165, 250, 0.6);
                }
                
                .dark .privacy-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(96, 165, 250, 0.9);
                }
                
                /* Blur background overlay when modal is open - Multiple selectors for better coverage */
                div[data-radix-dialog-overlay],
                [data-slot="dialog-overlay"],
                div[data-state="open"][data-radix-dialog-overlay] {
                    backdrop-filter: blur(20px) saturate(180%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                    background-color: rgba(0, 0, 0, 0.7) !important;
                }
                
                /* Additional targeting for the Portal */
                [data-slot="dialog-portal"] > div[data-radix-dialog-overlay] {
                    backdrop-filter: blur(20px) saturate(180%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                }
            `}</style>
        </Dialog>
    );
}
