import React from "react";
import Link from "next/link";
import { GraduationCap, Scale, AlertCircle, CheckCircle, Lock, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | ezyICT",
    description: "Terms and Conditions for ezyICT Learning Management System - PayHere Compliant",
};

export default function TermsConditionsPage() {
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
                            <Scale size={16} />
                            <span>Legal Terms</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            By accessing our platform, you agree to comply with these terms. Please read them carefully.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">

                        {/* Welcome */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <FileText className="text-blue-600" size={28} />
                                Welcome to ezyICT
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Welcome to <strong>ezyICT</strong>. By accessing our website or using our services, you agree to the following Terms and Conditions. Please read them carefully. If you do not agree with these terms, please do not use our platform.
                            </p>
                        </div>

                        {/* Use of the Website */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">1</span>
                                Use of the Website
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>You must be at least <strong>16 years old</strong> or have parental consent to use our platform</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>You are responsible for maintaining the confidentiality of your account and password</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>You agree to provide accurate and complete information during registration</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>Unauthorized use of the platform is strictly prohibited</span>
                                </li>
                            </ul>
                        </div>

                        {/* Courses and Services */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">2</span>
                                Courses and Services
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex gap-3 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                                    <span>Course content, pricing, and availability may change without notice</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                                    <span>Access to courses is granted <strong>only after successful payment</strong></span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                                    <span><strong>Sharing course materials or account credentials is strictly prohibited</strong></span>
                                </li>
                            </ul>
                        </div>

                        {/* Payments */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">3</span>
                                Payments
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex gap-3 items-start p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>All payments are processed securely via <strong>PayHere</strong></span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>ezyICT <strong>does not store</strong> payment card information</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                    <span>We reserve the right to cancel or refuse payments suspected of fraud</span>
                                </li>
                            </ul>
                        </div>

                        {/* Refunds */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">4</span>
                                Refunds
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Refunds are governed by our <Link href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-semibold underline">Refund Policy</Link>, available on our website. Please review it carefully before making a purchase.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Lock className="text-blue-600" size={28} />
                                Intellectual Property
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">
                                    All content including <strong>videos, documents, logos, and materials</strong> are the intellectual property of <strong>ezyICT</strong> and may not be copied or distributed without permission. Unauthorized use is a violation of intellectual property rights and may result in legal action.
                                </p>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <AlertTriangle className="text-orange-500" size={28} />
                                Limitation of Liability
                            </h2>
                            <p className="text-slate-600 mb-4 font-semibold">ezyICT shall not be liable for:</p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700">Service interruptions or downtime</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700">Data loss due to external factors</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                    <span className="text-slate-700">Indirect or consequential damages</span>
                                </li>
                            </ul>
                        </div>

                        {/* Modifications */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">5</span>
                                Modifications to Terms
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">
                                    We reserve the right to update these Terms and Conditions at any time. Continued use of the platform indicates your acceptance of any changes. We encourage you to review these terms periodically.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-slate-900 text-white py-16 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Questions About Our Terms?</h2>
                                <p className="text-slate-400 mb-8 text-lg">
                                    If you have any questions or concerns regarding these Terms and Conditions, please contact our support team.
                                </p>
                                <Link href="/contact">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-blue-300 transition-all hover:scale-105 active:scale-95">
                                        Contact Support
                                    </Button>
                                </Link>
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
                                    "Empowering education through technology."
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
