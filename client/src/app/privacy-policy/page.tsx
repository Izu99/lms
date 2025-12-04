import React from "react";
import Link from "next/link";
import { GraduationCap, Shield, Lock, Eye, FileText, AlertTriangle, CreditCard, Scale, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ezyICT",
    description: "Privacy Policy for ezyICT Learning Management System",
};

export default function PrivacyPolicyPage() {
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
                            <Shield size={16} />
                            <span>Your Privacy Matters</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Privacy Policy for <span className="text-blue-600">ezyICT</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            We are committed to protecting your personal information and ensuring a secure learning environment for all our students.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-slate prose-lg max-w-none">

                        {/* Introduction */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <FileText className="text-blue-600" />
                                Introduction
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                At ezyICT, your privacy is our priority. We are dedicated to protecting the personal and sensitive data of all users accessing our Learning Management System (LMS). This Privacy Policy explains how we collect, use, protect, and manage the data you provide to ensure a safe and effective learning experience.
                            </p>
                        </div>

                        <div className="grid gap-12">

                            {/* 1. Information We Collect */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">1</span>
                                    Information We Collect
                                </h3>
                                <div className="pl-4 border-l-2 border-blue-100 space-y-6">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-2">Personal Information</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                            <li><strong>National Identity Number:</strong> Required for identity verification and security purposes.</li>
                                            <li><strong>Address:</strong> Collected solely for delivering tutorial materials and official correspondence.</li>
                                            <li><strong>Contact Details:</strong> Telephone numbers and email addresses used for communication, notifications, and support services.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-2">Academic and Platform Data</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                            <li><strong>Video and Study Material Access:</strong> Strictly limited to registered users under applicable regulations.</li>
                                            <li><strong>Platform Interaction:</strong> Data from quizzes, assignments, and AI-powered interactions is securely stored to enhance your academic progress.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 2. How We Protect Your Data */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">2</span>
                                    How We Protect Your Data
                                </h3>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid sm:grid-cols-2 gap-6">
                                    <div className="flex gap-4">
                                        <Lock className="text-blue-600 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Data Encryption</h4>
                                            <p className="text-sm text-slate-600 mt-1">All sensitive information is encrypted during transmission and at rest.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Shield className="text-blue-600 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Access Control</h4>
                                            <p className="text-sm text-slate-600 mt-1">Access to sensitive data is strictly limited to authorized personnel only.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Eye className="text-blue-600 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Regular Audits</h4>
                                            <p className="text-sm text-slate-600 mt-1">Periodic security audits to identify and address potential vulnerabilities.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <CreditCard className="text-blue-600 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-slate-900">Secure Payments</h4>
                                            <p className="text-sm text-slate-600 mt-1">Partnering with trusted gateways ensures secure financial data processing.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Data Usage Policy */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">3</span>
                                    Data Usage Policy
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-blue-100">
                                    Personal information is used solely for academic and administrative purposes, such as tutorial delivery, student verification, and academic progress tracking. Data from platform interactions is used to enhance the quality of the learning experience and provide personalized support.
                                </p>
                            </div>

                            {/* 4. Prohibited Actions */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600 text-lg font-bold">4</span>
                                    Prohibited Actions
                                </h3>
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                                            <span className="text-slate-700"><strong>Unauthorized Sharing:</strong> Distribution of LMS content without authorization is strictly forbidden.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                                            <span className="text-slate-700"><strong>Misuse of Credentials:</strong> Sharing login credentials with others is prohibited and may result in account suspension.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                                            <span className="text-slate-700"><strong>Copyright Violation:</strong> Infringement of intellectual property rights will lead to legal action.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                                            <span className="text-slate-700"><strong>Tampering:</strong> Hacking or interfering with the LMS platform is prohibited.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* 5. Third-Party Payment Services */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">5</span>
                                    Third-Party Payment Services
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-blue-100">
                                    All payments are securely processed by our trusted payment partners. ezyICT does not store or process any payment-related information (such as credit card details) on its servers. Users are encouraged to review the terms and conditions of the payment provider during the transaction process.
                                </p>
                            </div>

                            {/* 6. Legal Compliance */}
                            <div className="group">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">6</span>
                                    Legal Compliance
                                </h3>
                                <div className="flex gap-4 pl-4 border-l-2 border-blue-100">
                                    <Scale className="text-blue-600 shrink-0 mt-1" />
                                    <p className="text-slate-600 leading-relaxed">
                                        ezyICT complies with all relevant government regulations related to data protection, digital security, and intellectual property rights. Any violations may result in legal action to protect the integrity of our platform and the rights of our content creators.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-slate-900 text-white py-16 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                                <p className="text-slate-400 mb-8 text-lg">
                                    If you have any questions, concerns, or requests regarding this Privacy Policy, please don't hesitate to reach out to our support team.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                            <Mail size={20} />
                                        </div>
                                        <span>info@ezyict.lk</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                            <Phone size={20} />
                                        </div>
                                        <span>074-1783886</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                            <MapPin size={20} />
                                        </div>
                                        <span>No 453, Gampaha</span>
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
                                        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Physics</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 italic">
                                    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
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
