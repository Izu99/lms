"use client";

import React, { useState } from 'react';
import { PayHereButton } from './PayHereButton';
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, AlertCircle, CreditCard, Banknote, UploadCloud, User, CheckCircle, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PaymentCheckoutProps {
    itemId: string;
    itemModel: 'Video' | 'Paper' | 'Tute' | 'CoursePackage';
    amount: number;
    title: string;
    className?: string;
}

const translations = {
    si: {
        title: "ගෙවීම් සහ රිෆන්ඩ් ප්‍රතිපත්තිය",
        onlineTitle: "ඔන්ලයින් ගෙවීම් (Online Payment)",
        bankTitle: "බැංකු තැන්පතු (Bank Transfer)",
        guidelines: "ගෙවීම් උපදෙස් (Payment Guidelines)",
        refund: "මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය (Refund Policy)",
        agree: "මම ඉහත සඳහන් සියලුම උපදෙස් සහ කොන්දේසි කියවා ඒවාට එකඟ වෙමි.",
        steps: [
            "ඔබ තෝරාගෙන ඇති අයිතමය සහ එහි මිල නිවැරදිදැයි පරීක්ෂා කරන්න.",
            "කාඩ්පත් මගින් ආරක්ෂිතව ගෙවීම් සිදු කිරීම සඳහා පහත ඇති 'Pay' බොත්තම භාවිතා කරන්න.",
            "ගෙවීම සාර්ථක වූ පසු, ස්වයංක්‍රීයව රිසිට්පතක් Gmail වෙත ලැබෙනු ඇත.",
            "එසැණින් ඔබ මිලදී ගත් අන්තර්ගතය සක්‍රීය (Active) වනු ඇත."
        ],
        bankDetails: {
            header: "අපගේ බැංකු ගිණුම් විස්තර:",
            bank: "බැංකුව: සම්පත් බැංකුව (Sampath Bank)",
            name: "නම: ezyICT Learning (PVT) LTD",
            account: "ගිණුම් අංකය: 1109 4532 9987",
            branch: "ශාඛාව: ගම්පහ (Gampaha)",
            usernameLabel: "ඔබගේ යූසර් නේම් එක (Username)",
            uploadLabel: "ගෙවීම් රිසිට්පත (Payment Slip)",
            uploadPlaceholder: "IMG_2024.jpg වැනි ගොනුවක් තෝරන්න",
            submitBtn: "සත්‍යාපනය සඳහා ඉදිරිපත් කරන්න",
            notice: "සටහන: බැංකු තැන්පත් සත්‍යාපනය සඳහා වැඩ කරන දින 1ක් දක්වා කාලයක් ගත විය හැක."
        }
    },
    en: {
        title: "Payment & Refund Policy",
        onlineTitle: "Online Payment",
        bankTitle: "Bank Transfer",
        guidelines: "Payment Guidelines",
        refund: "Refund Policy",
        agree: "I have read and agree to all the guidelines and conditions mentioned above.",
        steps: [
            "Check if the item you have selected and its price are correct.",
            "Use the 'Pay' button below to securely make payments via cards.",
            "Once the payment is successful, a receipt will be sent to your Gmail.",
            "The content you purchased will be activated instantly."
        ],
        bankDetails: {
            header: "Our Bank Account Details:",
            bank: "Bank: Sampath Bank",
            name: "Name: ezyICT Learning (PVT) LTD",
            account: "Account Number: 1109 4532 9987",
            branch: "Branch: Gampaha",
            usernameLabel: "Your Site Username",
            uploadLabel: "Payment Slip Image",
            uploadPlaceholder: "Select or drag slip image",
            submitBtn: "Submit for Verification",
            notice: "Note: Bank transfer verification may take up to 1 working day."
        }
    },
    ta: {
        title: "கட்டணம் மற்றும் பணத்தைத் திரும்பப் பெறுதல் கொள்கை",
        onlineTitle: "ஆன்லைன் கட்டணம்",
        bankTitle: "வங்கி வைப்பு",
        guidelines: "கட்டண வழிகாட்டுதல்கள்",
        refund: "பணத்தைத் திரும்பப் பெறுதல் கொள்கை",
        agree: "மேலே குறிப்பிட்டுள்ள அனைத்து வழிகாட்டுதல்களையும் நிபந்தனைகளையும் நான் படித்து ஒப்புக்கொள்கிறேன்.",
        steps: [
            "நீங்கள் தேர்ந்தெடுத்த பொருள் மற்றும் அதன் விலை சரியாக உள்ளதா என சரிபார்க்கவும்.",
            "அட்டைகள் மூலம் பாதுகாப்பாக பணம் செலுத்த கீழே உள்ள 'Pay' பொத்தானைப் பயன்படுத்தவும்.",
            "வெற்றிகரமாக முடிந்ததும், உங்கள் Gmail முகவரிக்கு ரசீது அனுப்பப்படும்.",
            "நீங்கள் வாங்கிய உள்ளடக்கம் உடனடியாகச் செயல்படும்."
        ],
        bankDetails: {
            header: "எங்கள் வங்கி கணக்கு விபரங்கள்:",
            bank: "வங்கி: Sampath Bank",
            name: "பெயர்: ezyICT Learning (PVT) LTD",
            account: "கணக்கு எண்: 1109 4532 9987",
            branch: "கிளை: Gampaha",
            usernameLabel: "உங்கள் தள பயனர் பெயர் (Username)",
            uploadLabel: "கட்டண ரசீது (Payment Slip)",
            uploadPlaceholder: "ரசீது படத்தைத் தேர்ந்தெடுக்கவும்",
            submitBtn: "சரிபார்ப்பிற்கு சமர்ப்பிக்கவும்",
            notice: "குறிப்பு: வங்கி வைப்பு சரிபார்ப்பிற்கு 1 வேலை நாள் வரை ஆகலாம்."
        }
    }
};

export function PaymentCheckout({ itemId, itemModel, amount, title, className }: PaymentCheckoutProps) {
    const [agreed, setAgree] = useState(false);
    const [lang, setLang] = useState<'si' | 'en' | 'ta'>('si');
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank'>('online');
    const [bankData, setBankData] = useState<{ username: string; slip: File | null }>({
        username: '',
        slip: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = translations[lang];

    const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBankData(prev => ({ ...prev, slip: e.target.files![0] }));
        }
    };

    const handleBankSubmit = async () => {
        if (!bankData.username || !bankData.slip) {
            alert(lang === 'si' ? 'කරුණාකර සියලු විස්තර ඇතුළත් කරන්න' : 'Please fill all details');
            return;
        }
        setIsSubmitting(true);
        // Backend logic for slip submission goes here
        setTimeout(() => {
            setIsSubmitting(false);
            alert(lang === 'si' ? 'ඔබේ ගෙවීම් රිසිට්පත සාර්ථකව ඉදිරිපත් කරන ලදී. අපි එය සත්‍යාපනය කර ඉක්මනින් සම්බන්ධ වන්නෙමු.' : 'Slip submitted successfully! We will verify it and activate your content soon.');
        }, 1500);
    };

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
            {/* Top Bar: Icon & Language */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                            {t.title}
                        </h3>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Secured by ezyICT</p>
                    </div>
                </div>

                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {(['en', 'si', 'ta'] as const).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${lang === l ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {l === 'en' ? 'English' : l === 'si' ? 'සිංහල' : 'தமிழ்'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="p-6 md:p-8">
                <Tabs defaultValue="online" onValueChange={(val) => setPaymentMethod(val as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl h-14">
                        <TabsTrigger value="online" className="rounded-xl font-bold flex items-center gap-2 text-sm">
                            <CreditCard size={18} />
                            {t.onlineTitle}
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="rounded-xl font-bold flex items-center gap-2 text-sm">
                            <Banknote size={18} />
                            {t.bankTitle}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="online" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            {/* Guidelines */}
                            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-blue-600" size={24} />
                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                                        {t.guidelines}
                                    </h4>
                                </div>
                                <ul className="space-y-4">
                                    {t.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 flex items-center justify-center font-black text-xs shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {idx + 1}
                                            </span>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Summary & Button */}
                            <div className="space-y-6">
                                <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Total Amount</p>
                                    <div className="text-4xl font-black tracking-tighter mb-1">LKR {amount.toFixed(2)}</div>
                                    <p className="text-sm opacity-90 font-medium">{title}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className={!agreed ? "opacity-40 grayscale pointer-events-none" : ""}>
                                        <PayHereButton
                                            itemId={itemId}
                                            itemModel={itemModel}
                                            amount={amount}
                                            title={title}
                                            className="w-full h-16 rounded-2xl text-xl font-black shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
                                        />
                                    </div>
                                    {!agreed && (
                                        <div className="flex items-center justify-center gap-2 text-orange-500 font-bold text-xs animate-pulse">
                                            <AlertCircle size={14} />
                                            PLEASE AGREE TO TERMS BELOW
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Bank Details */}
                            <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Banknote size={120} />
                                </div>
                                <h4 className="font-bold text-blue-400 uppercase tracking-widest text-xs">
                                    {t.bankDetails.header}
                                </h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="pb-4 border-b border-white/10">
                                        <p className="text-[10px] uppercase opacity-50 mb-1 font-bold">Bank</p>
                                        <p className="font-bold text-lg">{t.bankDetails.bank}</p>
                                    </div>
                                    <div className="pb-4 border-b border-white/10">
                                        <p className="text-[10px] uppercase opacity-50 mb-1 font-bold">Account Name</p>
                                        <p className="font-bold text-lg">{t.bankDetails.name}</p>
                                    </div>
                                    <div className="pb-4 border-b border-white/10">
                                        <p className="text-[10px] uppercase opacity-50 mb-1 font-bold">Account Number</p>
                                        <p className="font-black text-2xl tracking-widest text-blue-400">{t.bankDetails.account.split(':')[1].trim()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase opacity-50 mb-1 font-bold">Branch</p>
                                        <p className="font-bold">{t.bankDetails.branch}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Slip Upload Form */}
                            <div className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="font-bold flex items-center gap-2">
                                        <User size={16} className="text-blue-600" />
                                        {t.bankDetails.usernameLabel}
                                    </Label>
                                    <Input
                                        id="username"
                                        placeholder="e.g. kamal_perera"
                                        value={bankData.username}
                                        onChange={(e) => setBankData({ ...bankData, username: e.target.value })}
                                        className="h-12 rounded-xl focus:ring-blue-600 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-bold flex items-center gap-2">
                                        <UploadCloud size={16} className="text-blue-600" />
                                        {t.bankDetails.uploadLabel}
                                    </Label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            onChange={handleSlipUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                            accept="image/*"
                                        />
                                        <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors ${bankData.slip ? 'bg-blue-50 border-blue-400 group-hover:bg-blue-100' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover:border-blue-400 group-hover:bg-slate-100'}`}>
                                            {bankData.slip ? (
                                                <>
                                                    <CheckCircle className="text-green-500" size={32} />
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full italic px-4">
                                                        {bankData.slip.name}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="text-slate-400 group-hover:text-blue-600 transition-colors" size={32} />
                                                    <p className="text-xs font-bold text-slate-500 text-center px-4">
                                                        {t.bankDetails.uploadPlaceholder}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className={!agreed ? "opacity-40 grayscale pointer-events-none" : ""}>
                                        <Button
                                            onClick={handleBankSubmit}
                                            disabled={isSubmitting || !bankData.username || !bankData.slip}
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                                        >
                                            {isSubmitting ? '...' : t.bankDetails.submitBtn}
                                        </Button>
                                    </div>
                                    <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl">
                                        <Clock className="text-amber-600 shrink-0" size={16} />
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
                                            {t.bankDetails.notice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Terms Agreement Toggle */}
            <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto">
                    <label className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer shadow-sm group">
                        <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgree(checked as boolean)}
                            className="mt-1 w-6 h-6 rounded-lg border-2 data-[state=checked]:bg-blue-600"
                        />
                        <div className="flex-1">
                            <span className="text-sm md:text-base text-slate-900 dark:text-white font-bold group-hover:text-blue-600 transition-colors">
                                {t.agree}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                                (මම මෙහි ඇති සියලුම කොන්දේසි කියවා ඒවාට එකඟ වෙමි. I have read and agree to all terms, including the{" "}
                                <Link
                                    href="/refund-policy"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700 underline font-black"
                                >
                                    Refund Policy
                                </Link>
                                )
                            </p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}