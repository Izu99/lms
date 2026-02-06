"use client";

import React, { useState } from 'react';
import { PayHereButton } from './PayHereButton';
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface PaymentCheckoutProps {
    itemId: string;
    itemModel: 'Video' | 'Paper' | 'Tute' | 'CoursePackage';
    amount: number;
    title: string;
    className?: string;
}

const translations = {
    si: {
        title: "ගෙවීම් උපදෙස් සහ රිෆන්ඩ් ප්‍රතිපත්තිය",
        guidelines: "ගෙවීම් උපදෙස් (Payment Guidelines)",
        refund: "මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය (Refund Policy)",
        agree: "මම ඉහත සඳහන් සියලුම උපදෙස් සහ කොන්දේසි කියවා ඒවාට එකඟ වෙමි.",
        steps: [
            "ඔබ තෝරාගෙන ඇති අයිතමය සහ එහි මිල නිවැරදිදැයි පරීක්ෂා කරන්න.",
            "කාඩ්පත් මගින් ආරක්ෂිතව ගෙවීම් සිදු කිරීම සඳහා පහත ඇති 'Pay' බොත්තම භාවිතා කරන්න.",
            "ඔබගේ කාඩ්පත් තොරතුරු ඇතුළත් කර ආරක්ෂිත ගෙවීම් පද්ධතිය (Payment Gateway) හරහා ගෙවීම සිදු කරන්න.",
            "ගෙවීම සාර්ථක වූ පසු, ස්වයංක්‍රීයව රිසිට්පතක් ඔබගේ Gmail ලිපිනයට ලැබෙනු ඇත.",
            "එසැණින් ඔබ මිලදී ගත් අන්තර්ගතය සක්‍රීය (Active) වනු ඇත."
        ]
    },
    en: {
        title: "Payment Guidelines & Refund Policy",
        guidelines: "Payment Guidelines",
        refund: "Refund Policy",
        agree: "I have read and agree to all the guidelines and conditions mentioned above.",
        steps: [
            "Check if the item you have selected and its price are correct.",
            "Use the 'Pay' button below to securely make payments via cards.",
            "Enter your card details and complete the payment through the secure Payment Gateway.",
            "Once the payment is successful, a receipt will be automatically sent to your Gmail address.",
            "The content you purchased will be activated instantly."
        ]
    },
    ta: {
        title: "கட்டண வழிகாட்டுதல்கள் மற்றும் பணத்தைத் திரும்பப் பெறுதல் கொள்கை",
        guidelines: "கட்டண வழிகாட்டுதல்கள் (Payment Guidelines)",
        refund: "பணத்தைத் திரும்பப் பெறுதல் கொள்கை (Refund Policy)",
        agree: "மேலே குறிப்பிட்டுள்ள அனைத்து வழிகாட்டுதல்களையும் நிபந்தனைகளையும் நான் படித்து ஒப்புக்கொள்கிறேன்.",
        steps: [
            "நீங்கள் தேர்ந்தெடுத்த பொருள் மற்றும் அதன் விலை சரியாக உள்ளதா என சரிபார்க்கவும்.",
            "அட்டைகள் மூலம் பாதுகாப்பாக பணம் செலுத்த கீழே உள்ள 'Pay' பொத்தானைப் பயன்படுத்தவும்.",
            "உங்கள் அட்டை விவரங்களை உள்ளிட்டு பாதுகாப்பான கட்டண நுழைவாயில் மூலம் பணம் செலுத்துங்கள்.",
            "பணம் செலுத்துதல் வெற்றிகரமாக முடிந்ததும், உங்கள் Gmail முகவரிக்கு ரசீது தானாகவே அனுப்பப்படும்.",
            "நீங்கள் വാங்கிய உள்ளடக்கம் உடனடியாகச் செயல்படும் (Active)."
        ]
    }
};

export function PaymentCheckout({ itemId, itemModel, amount, title, className }: PaymentCheckoutProps) {
    const [agreed, setAgree] = useState(false);
    const [lang, setLang] = useState<'si' | 'en' | 'ta'>('si');

    const t = translations[lang];

    return (
        <>

            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-blue-500/20 overflow-hidden ${className}`}>
            {/* Header / Language Switcher */}
            <div className="p-6 border-b theme-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl theme-text-primary tracking-tight">
                            {t.title}
                        </h3>
                        <p className="text-xs theme-text-tertiary font-bold uppercase tracking-widest">Secure Payment Portal</p>
                    </div>
                </div>
                
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border theme-border shadow-sm">
                    <button 
                        onClick={() => setLang('si')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${lang === 'si' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 theme-text-secondary'}`}
                    >
                        සිංහල
                    </button>
                    <button 
                        onClick={() => setLang('ta')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${lang === 'ta' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 theme-text-secondary'}`}
                    >
                        தமிழ்
                    </button>
                    <button 
                        onClick={() => setLang('en')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 theme-text-secondary'}`}
                    >
                        English
                    </button>
                </div>
            </div>

            {/* Content Area - Single Column for Guidelines */}
            <div className="p-6 sm:p-10">
                <div className="max-w-3xl mx-auto">
                    {/* Guidelines Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b-2 border-blue-500/10">
                            <AlertCircle className="text-blue-600 dark:text-blue-400" size={24} />
                            <h4 className="font-black text-lg theme-text-primary uppercase tracking-tight">
                                {t.guidelines}
                            </h4>
                        </div>
                        <ul className="space-y-4">
                            {t.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-4 group">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </span>
                                    <p className="text-base theme-text-secondary leading-relaxed pt-1">
                                        {step}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Footer / Action Area */}
            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-t-2 theme-border">
                <div className="max-w-3xl mx-auto space-y-8">
                    <label className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500 transition-all cursor-pointer shadow-sm group">
                        <Checkbox 
                            id="terms" 
                            checked={agreed} 
                            onCheckedChange={(checked) => setAgree(checked as boolean)}
                            className="mt-1 w-6 h-6 border-2 data-[state=checked]:bg-blue-600"
                        />
                        <div className="flex-1">
                            <span className="text-base theme-text-primary leading-tight font-bold group-hover:text-blue-600 transition-colors">
                                {t.agree}
                            </span>
                            <p className="text-sm theme-text-tertiary mt-2 font-medium">
                                මම මෙහි ඇති සියලුම කොන්දේසි කියවා ඒවාට එකඟ වෙමි. (I have read and agree to all the terms and conditions, including the{" "}
                                <Link
                                    href="/refund-policy"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700 underline font-extrabold focus:outline-none"
                                >
                                    Refund Policy
                                </Link>
                                )
                            </p>
                        </div>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-white dark:bg-gray-950 p-6 rounded-2xl border theme-border shadow-inner">
                        <div className="text-center sm:text-left">
                            <p className="text-xs theme-text-tertiary uppercase font-black tracking-widest mb-1">Payable Total</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-green-600 dark:text-green-400 tracking-tighter">LKR {amount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="w-full sm:w-auto text-center">
                            <div className={!agreed ? "opacity-40 pointer-events-none grayscale" : ""}>
                                <PayHereButton 
                                    itemId={itemId}
                                    itemModel={itemModel}
                                    amount={amount}
                                    title={title}
                                    className="w-full sm:w-80 h-16 text-2xl font-black shadow-2xl shadow-blue-500/40 rounded-xl transform hover:scale-[1.02] active:scale-95 transition-all"
                                />
                            </div>
                            {!agreed && (
                                <p className="text-xs text-orange-500 mt-3 font-black animate-pulse flex items-center justify-center gap-2">
                                    <AlertCircle size={14} />
                                    ACCEPT TERMS TO UNLOCK PAYMENT
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}