"use client";

import React, { useState } from 'react';
import { PayHereButton } from './PayHereButton';
import { RefundPolicyModal } from "@/components/modals/RefundPolicyModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

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
        ],
        refundPolicy: [
            "පාඨමාලාව මිලදී ගත් දින සිට දින 7ක් ඇතුළත පමණක් රිෆන්ඩ් ඉල්ලීම් සිදු කළ යුතුය.",
            "අදාළ පාඨමාලාවේ අන්තර්ගතයෙන් 20%කට වඩා ඔබ නරඹා හෝ අධ්‍යයනය කර නොතිබිය යුතුය.",
            "පාඨමාලාවට අදාළ කිසිදු සහතික පත්‍රයක් (Certificate) ඔබ විසින් ලබාගෙන නොතිබිය යුතුය.",
            "පාඨමාලාවට අදාළ නිබන්ධන (Downloadable materials) බාගත කර නොතිබිය යුතුය.",
            "විශේෂ දීමනා (Discount offers/Promo codes) යටතේ මිලදී ගත් පාඨමාලා සඳහා මුදල් ආපසු ගෙවනු නොලැබේ.",
            "ඔබගේ ඉල්ලීම සාධාරණ යැයි තහවුරු වූ පසු, වැඩ කරන දින 7-14ක් ඇතුළත මුදල් ආපසු එවීමට පියවර ගනු ලැබේ.",
            "මෙහිදී සිදුවන බැංකු ගාස්තු හෝ පරිපාලන ගාස්තු (Transaction fees) අය කර ඉතිරි මුදල පමණක් ආපසු ගෙවනු ලැබේ."
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
        ],
        refundPolicy: [
            "Refund requests must be made within 7 days of purchase.",
            "You must not have watched or studied more than 20% of the course content.",
            "No certificates should have been issued for the course.",
            "Downloadable materials must not have been downloaded.",
            "No refunds for courses purchased under special discount offers or promo codes.",
            "Refunds will be processed within 7-14 working days after approval.",
            "Transaction fees or administrative charges will be deducted from the refund amount."
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
            "நீங்கள் வாங்கிய உள்ளடக்கம் உடனடியாகச் செயல்படும் (Active)."
        ],
        refundPolicy: [
            "வாங்கிய 7 நாட்களுக்குள் பணத்தைத் திரும்பப் பெறுவதற்கான கோரிக்கைகள் சமர்ப்பிக்கப்பட வேண்டும்.",
            "பாடத்திட்டத்தின் 20% க்கும் அதிகமான உள்ளடக்கத்தை நீங்கள் பார்த்திருக்கக் கூடாது.",
            "எந்தவொரு சான்றிதழும் பெறப்பட்டிருக்கக் கூடாது.",
            "வழங்கப்பட்ட ஆவணங்கள் அல்லது குறிப்புகளைப் பதிவிறக்கம் செய்திருக்கக் கூடாது.",
            "சிறப்பு தள்ளுபடி சலுகைகளின் கீழ் வாங்கப்பட்ட பாடங்களுக்கு பணம் திரும்ப வழங்கப்பட மாட்டாது.",
            "கோரிக்கை அங்கீகரிக்கப்பட்ட பிறகு 7-14 வேலை நாட்களுக்குள் பணம் திரும்பச் செலுத்தப்படும்.",
            "பரிவர்த்தனை கட்டணங்களைக் கழித்த பிறகு மீதமுள்ள தொகை மட்டுமே திரும்பச் செலுத்தப்படும்."
        ]
    }
};

export function PaymentCheckout({ itemId, itemModel, amount, title, className }: PaymentCheckoutProps) {
    const [agreed, setAgree] = useState(false);
    const [lang, setLang] = useState<'si' | 'en' | 'ta'>('si');
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

    const t = translations[lang];

    return (
        <>
            <RefundPolicyModal open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen} />
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

            {/* Content Area - Two Columns on Desktop */}
            <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

                    {/* Refund Policy Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b-2 border-orange-500/10">
                            <FileText className="text-orange-600 dark:text-orange-400" size={24} />
                            <h4 className="font-black text-lg theme-text-primary uppercase tracking-tight">
                                {t.refund}
                            </h4>
                        </div>
                        <div className="bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30 space-y-4">
                            {t.refundPolicy.map((point, idx) => (
                                <div key={idx} className="flex gap-3 text-sm theme-text-secondary leading-relaxed">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                                    <p>{point}</p>
                                </div>
                            ))}
                        </div>
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
                            <p className="text-xs theme-text-tertiary mt-2">
                                View the{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsRefundModalOpen(true)}
                                    className="text-blue-600 hover:text-blue-700 underline font-semibold focus:outline-none"
                                >
                                    Refund Policy
                                </button>
                                {" "}before making your payment.
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