import React from "react";
import Link from "next/link";
import { GraduationCap, Shield, Lock, Eye, FileText, AlertTriangle, CreditCard, Scale, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ezyICT",
    description: "Privacy Policy for ezyICT Learning Management System - PayHere Compliant",
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
                            Privacy Policy
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            At ezyICT, we are committed to protecting your privacy and handling your personal data responsibly.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">

                        {/* Information We Collect */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">1</span>
                                Information We Collect
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>When you visit our website, we may collect certain information about you, including:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Personal identification information</strong> (such as your name, email address, and phone number) provided voluntarily by you during the registration or checkout process</li>
                                    <li><strong>Payment and billing information</strong> necessary to process your orders, which are securely handled by trusted third-party payment processors</li>
                                    <li><strong>Browsing information</strong>, such as your IP address, browser type, and device information, collected automatically using cookies and similar technologies</li>
                                    <li><strong>Learning activity data</strong> including course access, progress, and submissions</li>
                                </ul>
                            </div>
                        </div>

                        {/* Use of Information */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">2</span>
                                Use of Information
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>We may use the collected information for the following purposes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Process enrollments and payments</li>
                                    <li>Provide access to learning materials and services</li>
                                    <li>Communicate important updates and support messages</li>
                                    <li>Improve platform performance and user experience</li>
                                    <li>Prevent fraud and unauthorized access</li>
                                </ul>
                            </div>
                        </div>

                        {/* Information Sharing */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">3</span>
                                Information Sharing
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>We do <strong>not sell or trade</strong> your personal data.</p>
                                <p>Information may be shared only with:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Trusted service providers (payment processors like PayHere)</li>
                                    <li>Legal authorities if required by law</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Security */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Lock className="text-blue-600" size={24} />
                                Data Security
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                We use industry-standard security measures to protect your data. While we strive for maximum security, no online system is completely secure. We implement encryption, access controls, and regular security audits to safeguard your personal information.
                            </p>
                        </div>

                        {/* Cookies */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Eye className="text-blue-600" size={24} />
                                Cookies
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Cookies are used to improve functionality and user experience. You may disable cookies via your browser, though some features may not work properly.
                            </p>
                        </div>

                        {/* Policy Updates */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <FileText className="text-blue-600" size={24} />
                                Policy Updates
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                This Privacy Policy may be updated periodically. Any changes will be posted on this page. We encourage you to review this policy regularly to stay informed about how we protect your information.
                            </p>
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
