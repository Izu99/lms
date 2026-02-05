import React from "react";
import Link from "next/link";
import { GraduationCap, Shield, CreditCard, DollarSign, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund Policy | ezyICT",
    description: "Refund Policy for ezyICT Learning Management System - PayHere Compliant",
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                <GraduationCap size={28} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tight text-slate-900">ezyICT</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Smart Learning</span>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                Log In
                            </Link>
                            <Link href="/register">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 animate-fade-in-up">
                            <DollarSign size={16} />
                            <span>Transparent Refund Policy</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Refund Policy
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            We value your satisfaction. Learn about our refund eligibility, process, and terms.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">

                        {/* Introduction */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <Shield className="text-blue-600" size={28} />
                                Thank You for Choosing ezyICT
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Thank you for choosing <strong>ezyICT Learning Management System</strong>. We value your trust and aim to provide high-quality educational services. Please read our refund policy carefully before making a payment.
                            </p>
                        </div>

                        {/* Refund Eligibility */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">1</span>
                                Refund Eligibility
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p><strong>Payments made for online courses, physical classes, tutorials, or digital learning materials are generally non-refundable</strong>, except under the conditions listed below.</p>
                                <p className="font-semibold text-slate-900">Refunds may be considered if:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>A duplicate payment was made for the same course</li>
                                    <li>A technical error occurred during payment processing</li>
                                    <li>The course or service was cancelled by ezyICT</li>
                                </ul>
                            </div>
                        </div>

                        {/* Refund Process */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">2</span>
                                Refund Process
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p><strong>All payments are processed via PayHere.</strong> Approved refunds will be issued <strong>only to the original payment method</strong> used during checkout.</p>
                                <p className="font-semibold text-slate-900">Refunds are handled as:</p>
                                <div className="space-y-3">
                                    <div className="flex gap-4 items-start p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Instant Refunds</h4>
                                            <p className="text-sm">If refunded on the same day before settlement</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <Clock className="text-blue-600 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Delayed Refunds</h4>
                                            <p className="text-sm">If refunded after settlement (may take <strong>5–10 business days</strong>)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Non-Refundable Items */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <AlertCircle className="text-orange-500" size={28} />
                                Non-Refundable Items
                            </h2>
                            <p className="text-slate-600 mb-4">The following are <strong>not eligible for refunds</strong>:</p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700"><strong>Access to online video courses</strong> after access is granted</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700"><strong>Downloadable study materials</strong></span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700"><strong>Exam or registration fees</strong></span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700"><strong>Customized or personalized educational services</strong></span>
                                </li>
                            </ul>
                        </div>

                        {/* Processing Time */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Clock className="text-blue-600" size={28} />
                                Processing Time
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">
                                    Once approved, refunds are processed within <strong>5–10 business days</strong>, depending on your bank or card provider. Please note that it may take additional time for the refund to appear in your account.
                                </p>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CreditCard className="text-blue-600" size={28} />
                                Have Questions?
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                If you believe you qualify for a refund or have questions about our refund policy, please contact us via the support details provided on our website. We are here to assist you and ensure your experience with us is satisfactory.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-slate-900 text-white py-16 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
                                <p className="text-slate-400 mb-8 text-lg">
                                    For any questions about refunds or our policies, reach out to our support team.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                            <AlertCircle size={20} />
                                        </div>
                                        <span>support@ezyict.lk</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-600 rounded-xl">
                                        <GraduationCap size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">ezyICT</h3>
                                        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">ezyICT</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 italic">
                                    "Quality education accessible to all."
                                </p>
                                <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-500">
                                    &copy; {new Date().getFullYear()} ezyICT. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
