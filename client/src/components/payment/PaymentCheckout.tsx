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
        onlineTitle: "ඔන්ලයින් ගෙවීම්",
        bankTitle: "බැංකු තැන්පතු",
        guidelines: "ගෙවීම් උපදෙස්",
        refund: "මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය",
        agree: "මම ඉහත සඳහන් සියලුම උපදෙස් සහ කොන්දේසි කියවා ඒවාට එකඟ වෙමි.",
        steps: [
            "ඔබ තෝරාගෙන ඇති අයිතමය සහ එහි මිල නිවැරදිදැයි පරීක්ෂා කරන්න.",
            "කාඩ්පත් මගින් ආරක්ෂිතව ගෙවීම් සිදු කිරීම සඳහා පහත ඇති 'Pay' බොත්තම භාවිතා කරන්න.",
            "ගෙවීම සාර්ථක වූ පසු, ස්වයංක්‍රීයව රිසිට්පතක් Gmail වෙත ලැබෙනු ඇත.",
            "එසැණින් ඔබ මිලදී ගත් අන්තර්ගතය සක්‍රීය (Active) වනු ඇත."
        ],
        bankDetails: {
            header: "අපගේ බැංකු ගිණුම් විස්තර:",
            bank: "බැංකුව: HNB (Hatton National Bank)",
            name: "නම: Hansaka Prabath",
            account: "ගිණුම් අංකය: 200020020341",
            branch: "ශාඛාව: හක්මන (Hakmana)",
            usernameLabel: "ඔබගේ යූසර් නේම් එක (Username)",
            uploadLabel: "ගෙවීම් රිසිට්පත (Payment Slip)",
            uploadPlaceholder: "IMG_2024.jpg වැනි ගොනුවක් තෝරන්න",
            submitBtn: "සත්‍යාපනය සඳහා ඉදිරිපත් කරන්න",
            notice: "සටහන: බැංකු තැන්පත් සත්‍යාපනය සඳහා වැඩ කරන දින 1ක් දක්වා කාලයක් ගත විය හැක.",
            submitSuccess: "ඔබගේ ගෙවීම් පත්‍රිකාව සාර්ථකව ඉදිරිපත් කරන ලදි. අපි එය පරීක්ෂා කර ඔබගේ අන්තර්ගතය ඉක්මනින් සක්‍රිය කරන්නෙමු.",
            submitError: "ගෙවීම් පත්‍රිකාව ඉදිරිපත් කිරීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
            fillAll: "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න"
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
            bank: "Bank: HNB (Hatton National Bank)",
            name: "Name: Hansaka Prabath",
            account: "Account Number: 200020020341",
            branch: "Branch: Hakmana",
            usernameLabel: "Your Site Username",
            uploadLabel: "Payment Slip Image",
            uploadPlaceholder: "Select or drag slip image",
            submitBtn: "Submit for Verification",
            notice: "Note: Bank transfer verification may take up to 1 working day.",
            submitSuccess: "Slip submitted successfully! We will verify it and activate your content soon.",
            submitError: "Failed to submit payment slip. Please try again.",
            fillAll: "Please fill all details"
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
            bank: "வங்கி: HNB (Hatton National Bank)",
            name: "பெயர்: Hansaka Prabath",
            account: "கணக்கு எண்: 200020020341",
            branch: "கிளை: Hakmana",
            usernameLabel: "உங்கள் தள பயனர் பெயர் (Username)",
            uploadLabel: "கட்டண ரசீது (Payment Slip)",
            uploadPlaceholder: "ரசீது படத்தைத் தேர்ந்தெடுக்கவும்",
            submitBtn: "சரிபார்ப்பிற்கு சமர்ப்பிக்கவும்",
            notice: "குறிப்பு: வங்கி வைப்பு சரிபார்ப்பிற்கு 1 வேலை நாள் வரை ஆகலாம்.",
            submitSuccess: "உங்கள் கட்டண ரசீது வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் அதை சரிபார்த்து உங்கள் உள்ளடக்கத்தை விரைவில் செயல்படுத்துவோம்.",
            submitError: "கட்டண ரசீதை சமர்ப்பிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            fillAll: "எல்லா விவரங்களையும் நிரப்பவும்"
        }
    }
};

import { api } from '@/lib/api-client';

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
            alert(t.bankDetails.fillAll);
            return;
        }
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('itemId', itemId);
            formData.append('itemModel', itemModel);
            formData.append('username', bankData.username);
            formData.append('slip', bankData.slip);

            const res = await api.post('/payments/submit-manual', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                alert(t.bankDetails.submitSuccess);
                setBankData({
                    username: '',
                    slip: null
                });
            } else {
                alert(t.bankDetails.submitError);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(t.bankDetails.submitError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full max-w-5xl mx-auto ${className}`}>
            {/* Top Bar: Icon & Language */}
            <div className="p-3 sm:p-4 lg:p-6 bg-slate-50 dark:bg-slate-800 border-b theme-border">
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg lg:text-xl theme-text-primary tracking-tight truncate">
                                {t.title}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Secured by ezyICT</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm p-1 rounded-lg sm:rounded-xl border theme-border shadow-sm w-full sm:w-auto">
                        {(['en', 'si', 'ta'] as const).map((l) => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md sm:rounded-lg transition-all whitespace-nowrap ${lang === l
                                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-md'
                                        : 'theme-text-secondary hover:bg-white/10 dark:hover:bg-slate-600/50'
                                    }`}
                            >
                                {l === 'en' ? 'EN' : l === 'si' ? 'සිං' : 'த'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="p-3 sm:p-4 lg:p-8">
                <Tabs defaultValue="online" onValueChange={(val) => setPaymentMethod(val as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 lg:mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg sm:rounded-xl lg:rounded-2xl h-11 sm:h-12 lg:h-14">
                        <TabsTrigger value="online" className="rounded-md sm:rounded-lg lg:rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            <span className="hidden xs:inline">{t.onlineTitle}</span>
                            <span className="xs:hidden">ඔන්ලයින්</span>
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="rounded-md sm:rounded-lg lg:rounded-xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            <span className="hidden xs:inline">{t.bankTitle}</span>
                            <span className="xs:hidden">බැංකු</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="online" className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
                            {/* Guidelines */}
                            <div className="space-y-4 sm:space-y-5 lg:space-y-6 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl border theme-border order-2 lg:order-1">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <AlertCircle className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" />
                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-xs sm:text-sm">
                                        {t.guidelines}
                                    </h4>
                                </div>
                                <ul className="space-y-3 sm:space-y-4">
                                    {t.steps.map((step, idx) => (
                                        <li key={idx} className="flex gap-2 sm:gap-3 lg:gap-4 group">
                                            <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-white dark:bg-slate-800 border theme-border text-blue-600 flex items-center justify-center font-black text-xs sm:text-sm shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {idx + 1}
                                            </span>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium flex-1">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Summary & Button */}
                            <div className="space-y-4 sm:space-y-5 lg:space-y-6 order-1 lg:order-2">
                                <div className="p-5 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-3xl border theme-border shadow-sm">
                                    <p className="text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest theme-text-secondary mb-1 sm:mb-2">Total Amount</p>
                                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter mb-1 theme-text-primary">LKR {amount.toFixed(2)}</div>
                                    <p className="text-xs sm:text-sm theme-text-secondary font-medium line-clamp-2">{title}</p>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className={!agreed ? "opacity-40 grayscale pointer-events-none" : ""}>
                                        <PayHereButton
                                            itemId={itemId}
                                            itemModel={itemModel}
                                            amount={amount}
                                            title={title}
                                            className="w-full h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-black shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95"
                                        />
                                    </div>
                                    {!agreed && (
                                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-orange-500 font-bold text-[10px] sm:text-xs animate-pulse text-center px-2">
                                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                            <span>කරුණාකර පහත කොන්දේසි වලට එකඟ වන්න</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            {/* Bank Details */}
                            <div className="p-5 sm:p-6 lg:p-8 bg-slate-900 text-white rounded-xl sm:rounded-2xl lg:rounded-3xl space-y-4 sm:space-y-5 lg:space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 sm:p-6 lg:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Banknote className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32" />
                                </div>
                                <h4 className="font-bold text-blue-400 uppercase tracking-widest text-[10px] sm:text-xs relative z-10">
                                    {t.bankDetails.header}
                                </h4>
                                <div className="space-y-3 sm:space-y-4 relative z-10">
                                    <div className="pb-3 sm:pb-4 border-b border-white/10">
                                        <p className="text-[9px] sm:text-[10px] uppercase opacity-50 mb-1 font-bold">Bank</p>
                                        <p className="font-bold text-sm sm:text-base lg:text-lg">{t.bankDetails.bank}</p>
                                    </div>
                                    <div className="pb-3 sm:pb-4 border-b border-white/10">
                                        <p className="text-[9px] sm:text-[10px] uppercase opacity-50 mb-1 font-bold">Account Name</p>
                                        <p className="font-bold text-sm sm:text-base lg:text-lg break-words">{t.bankDetails.name}</p>
                                    </div>
                                    <div className="pb-3 sm:pb-4 border-b border-white/10">
                                        <p className="text-[9px] sm:text-[10px] uppercase opacity-50 mb-1 font-bold">Account Number</p>
                                        <p className="font-black text-lg sm:text-xl lg:text-2xl tracking-widest text-blue-400">{t.bankDetails.account.split(':')[1]?.trim() || '1109 4532 9987'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] uppercase opacity-50 mb-1 font-bold">Branch</p>
                                        <p className="font-bold text-sm sm:text-base">{t.bankDetails.branch}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Slip Upload Form */}
                            <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-4 sm:p-5 lg:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl lg:rounded-3xl border theme-border shadow-sm">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        {t.bankDetails.usernameLabel}
                                    </Label>
                                    <Input
                                        id="username"
                                        placeholder="e.g. kamal_perera"
                                        value={bankData.username}
                                        onChange={(e) => setBankData({ ...bankData, username: e.target.value })}
                                        className="h-10 sm:h-11 lg:h-12 rounded-lg sm:rounded-xl focus:ring-blue-600 font-medium text-sm sm:text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-bold flex items-center gap-2 text-xs sm:text-sm">
                                        <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        {t.bankDetails.uploadLabel}
                                    </Label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            onChange={handleSlipUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                            accept="image/*"
                                            key={bankData.slip ? 'loaded' : 'empty'}
                                        />
                                        <div className={`p-5 sm:p-6 lg:p-8 border-2 border-dashed rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-2 sm:gap-3 transition-colors min-h-[120px] sm:min-h-[140px] ${bankData.slip
                                                ? 'bg-blue-50 border-blue-400 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-500'
                                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover:border-blue-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                                            }`}>
                                            {bankData.slip ? (
                                                <>
                                                    <CheckCircle className="text-green-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                                                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-full px-2 text-center">
                                                        {bankData.slip.name}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="text-slate-400 group-hover:text-blue-600 transition-colors w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                                                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 text-center px-2 sm:px-4">
                                                        {t.bankDetails.uploadPlaceholder}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 sm:pt-3 lg:pt-4 space-y-3 sm:space-y-4">
                                    <div className={!agreed ? "opacity-40 grayscale pointer-events-none" : ""}>
                                        <Button
                                            onClick={handleBankSubmit}
                                            disabled={isSubmitting || !bankData.username || !bankData.slip}
                                            className="w-full h-11 sm:h-12 lg:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? '⏳ යවමින්...' : t.bankDetails.submitBtn}
                                        </Button>
                                    </div>
                                    <div className="flex items-start gap-2 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl sm:rounded-2xl">
                                        <Clock className="text-amber-600 shrink-0 mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
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
            <div className="p-3 sm:p-4 lg:p-8 bg-slate-50 dark:bg-slate-800/50 border-t theme-border">
                <div className="max-w-3xl mx-auto">
                    <label className="flex items-start gap-2.5 sm:gap-3 lg:gap-4 p-3 sm:p-4 lg:p-5 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer shadow-sm group">
                        <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={(checked) => setAgree(checked as boolean)}
                            className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg border-2 data-[state=checked]:bg-blue-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <span className="text-xs sm:text-sm lg:text-base text-slate-900 dark:text-white font-bold group-hover:text-blue-600 transition-colors block leading-tight">
                                {t.agree}
                            </span>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 font-medium leading-relaxed">
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