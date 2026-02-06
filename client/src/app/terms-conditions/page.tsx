"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Scale, AlertCircle, CheckCircle, Lock, FileText, AlertTriangle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
    en: {
        title: "Terms & Conditions",
        heroTag: "Legal Terms",
        heroText: "By accessing our platform, you agree to comply with these terms. Please read them carefully.",
        sections: [
            {
                id: 1,
                title: "Use of the Website",
                icon: "1",
                list: [
                    "You must be at least 16 years old or have parental consent to use our platform",
                    "You are responsible for maintaining the confidentiality of your account and password",
                    "You agree to provide accurate and complete information during registration",
                    "Unauthorized use of the platform is strictly prohibited"
                ]
            },
            {
                id: 2,
                title: "Courses and Services",
                icon: "2",
                alerts: [
                    "Course content, pricing, and availability may change without notice",
                    "Access to courses is granted only after successful payment",
                    "Sharing course materials or account credentials is strictly prohibited"
                ]
            },
            {
                id: 3,
                title: "Payments",
                icon: "3",
                checks: [
                    "All payments are processed securely via PayHere",
                    "ezyICT does not store payment card information",
                    "We reserve the right to cancel or refuse payments suspected of fraud"
                ]
            }
        ],
        refunds: {
            title: "Refunds",
            icon: "4",
            text: "Refunds are governed by our Refund Policy, available on our website. Please review it carefully before making a purchase."
        },
        intellectualProperty: {
            title: "Intellectual Property",
            text: "All content including videos, documents, logos, and materials are the intellectual property of ezyICT and may not be copied or distributed without permission. Unauthorized use is a violation of intellectual property rights and may result in legal action."
        },
        limitationOfLiability: {
            title: "Limitation of Liability",
            subTitle: "ezyICT shall not be liable for:",
            items: [
                "Service interruptions or downtime",
                "Data loss due to external factors",
                "Indirect or consequential damages"
            ]
        },
        modifications: {
            title: "Modifications to Terms",
            icon: "5",
            text: "We reserve the right to update these Terms and Conditions at any time. Continued use of the platform indicates your acceptance of any changes. We encourage you to review these terms periodically."
        },
        footer: {
            title: "Questions About Our Terms?",
            text: "If you have any questions or concerns regarding these Terms and Conditions, please contact our support team."
        }
    },
    si: {
        title: "නියමයන් සහ කොන්දේසි",
        heroTag: "නීතිමය නියමයන්",
        heroText: "අපගේ පද්ධතිය භාවිතා කිරීමෙන්, ඔබ මෙම නියමයන්ට අනුකූල වීමට එකඟ වේ. කරුණාකර ඒවා ප්‍රවේශමෙන් කියවන්න.",
        sections: [
            {
                id: 1,
                title: "වෙබ් අඩවිය භාවිතා කිරීම",
                icon: "1",
                list: [
                    "අපගේ පද්ධතිය භාවිතා කිරීමට ඔබ අවම වශයෙන් වයස අවුරුදු 16 ක් විය යුතුය නැතහොත් දෙමාපියන්ගේ අවසරය තිබිය යුතුය",
                    "ඔබේ ගිණුමේ සහ මුරපදයේ රහස්‍යභාවය පවත්වා ගැනීම ඔබගේ වගකීමකි",
                    "ලියාපදිංචි වීමේදී නිවැරදි සහ සම්පූර්ණ තොරතුරු ලබා දීමට ඔබ එකඟ වේ",
                    "අනවසරයෙන් පද්ධතිය භාවිතා කිරීම සපුරා තහනම් වේ"
                ]
            },
            {
                id: 2,
                title: "පාඨමාලා සහ සේවාවන්",
                icon: "2",
                alerts: [
                    "පාඨමාලා අන්තර්ගතය, මිල ගණන් සහ පවතින බව පූර්ව දැනුම්දීමකින් තොරව වෙනස් විය හැක",
                    "පාඨමාලා සඳහා ප්‍රවේශය ලබා දෙන්නේ සාර්ථක ගෙවීමකින් පසුව පමණි",
                    "පාඨමාලා ද්‍රව්‍ය හෝ ගිණුම් විස්තර බෙදා ගැනීම සපුරා තහනම් වේ"
                ]
            },
            {
                id: 3,
                title: "ගෙවීම්",
                icon: "3",
                checks: [
                    "සියලුම ගෙවීම් PayHere හරහා ආරක්ෂිතව සකසනු ලැබේ",
                    "ezyICT විසින් ගෙවීම් කාඩ්පත් තොරතුරු ගබඩා කරනු නොලැබේ",
                    "වංචනික යැයි සැක කෙරෙන ගෙවීම් අවලංගු කිරීමට හෝ ප්‍රතික්ෂේප කිරීමට අපට අයිතිය ඇත"
                ]
            }
        ],
        refunds: {
            title: "මුදල් ආපසු ගෙවීම්",
            icon: "4",
            text: "මුදල් ආපසු ගෙවීම් අපගේ මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය මගින් පාලනය වේ. මිලදී ගැනීමක් කිරීමට පෙර කරුණාකර එය ප්‍රවේශමෙන් කියවන්න."
        },
        intellectualProperty: {
            title: "බුද්ධිමය දේපළ",
            text: "වීඩියෝ, ලේඛන, ලාංඡන සහ ද්‍රව්‍ය ඇතුළු සියලුම අන්තර්ගතයන් ezyICT හි බුද්ධිමය දේපළ වන අතර අවසරයකින් තොරව පිටපත් කිරීම හෝ බෙදා හැරීම නොකළ යුතුය. අනවසර භාවිතය නීතිමය ක්‍රියාමාර්ගවලට හේතු විය හැක."
        },
        limitationOfLiability: {
            title: "වගකීම් සීමාවන්",
            subTitle: "ezyICT පහත සඳහන් දෑ සඳහා වගකියනු නොලැබේ:",
            items: [
                "සේවා බාධා කිරීම් හෝ පද්ධතිය අක්‍රිය වීම්",
                "බාහිර සාධක හේතුවෙන් දත්ත නැතිවීම",
                "වක්‍ර හෝ අනුෂංගික හානි"
            ]
        },
        modifications: {
            title: "කොන්දේසි වෙනස් කිරීම",
            icon: "5",
            text: "ඕනෑම අවස්ථාවක මෙම නියමයන් සහ කොන්දේසි යාවත්කාලීන කිරීමට අපට අයිතිය ඇත. පද්ධතිය දිගටම භාවිතා කිරීමෙන් ඔබ එම වෙනස්කම් පිළිගන්නා බව අදහස් වේ."
        },
        footer: {
            title: "ප්‍රශ්න තිබේද?",
            text: "මෙම නියමයන් සහ කොන්දේසි සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක් ඇත්නම්, කරුණාකර අපගේ සහාය කණ්ඩායම අමතන්න."
        }
    },
    ta: {
        title: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
        heroTag: "சட்ட விதிகூறுகள்",
        heroText: "எமது தளத்தை அணுகுவதன் மூலம், இந்த விதிமுறைகளுக்குக் கட்டுப்பட ஒப்புக்கொள்கிறீர்கள். தயவுசெய்து அவற்றை கவனமாகப் படிக்கவும்.",
        sections: [
            {
                id: 1,
                title: "வலைத்தளத்தைப் பயன்படுத்துதல்",
                icon: "1",
                list: [
                    "தளத்தைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 16 வயதுடையவராக இருக்க வேண்டும்",
                    "உங்கள் கணக்கு மற்றும் கடவுச்சொல்லின் ரகசியத்தைப் பாதுகாப்பது உங்கள் பொறுப்பாகும்",
                    "பதிவு செய்யும் போது துல்லியமான தகவல்களை வழங்க ஒப்புக்கொள்கிறீர்கள்",
                    "தளத்தை அங்கீகரிக்கப்படாத வகையில் பயன்படுத்துவது கண்டிப்பாகத் தடைசெய்யப்பட்டுள்ளது"
                ]
            },
            {
                id: 2,
                title: "பாடநெறிகள் மற்றும் சேவைகள்",
                icon: "2",
                alerts: [
                    "பாடநெறி உள்ளடக்கம் மற்றும் விலைகள் முன்னறிவிப்பின்றி மாற்றப்படலாம்",
                    "வெற்றிகரமான கட்டணத்திற்குப் பிறகே பாடநெறிகளுக்கான அணுகல் வழங்கப்படும்",
                    "பாடப் பொருட்கள் அல்லது கணக்கு விபரங்களைப் பகிர்வது கண்டிப்பாகத் தடைசெய்யப்பட்டுள்ளது"
                ]
            },
            {
                id: 3,
                title: "கொடுப்பனவுகள்",
                icon: "3",
                checks: [
                    "அனைத்து கொடுப்பனவுகளும் PayHere மூலம் பாதுகாப்பாக செயல்படுத்தப்படுகின்றன",
                    "ezyICT கட்டண அட்டை தகவல்களைச் சேமிப்பதில்லை",
                    "மோசடி என்று சந்தேகிக்கப்படும் கொடுப்பனவுகளை ரத்து செய்ய எங்களுக்கு உரிமை உண்டு"
                ]
            }
        ],
        refunds: {
            title: "பணத்தைத் திரும்பப் பெறுதல்",
            icon: "4",
            text: "பணத்தைத் திரும்பப் பெறுதல் எமது பணத்தைத் திரும்பப் பெறும் கொள்கைக்கு உட்பட்டது. பணம் செலுத்து முன் அதை கவனமாகப் படிக்கவும்."
        },
        intellectualProperty: {
            title: "அறிவுசார் சொத்து",
            text: "வீடியோக்கள், ஆவணங்கள் உட்பட அனைத்து உள்ளடக்கங்களும் ezyICT இன் அறிவுசார் சொத்துரிமையாகும். அனுமதியின்றி இவற்றை நகலெடுப்பதோ அல்லது பகிர்வதோ சட்டவிரோதமானது."
        },
        limitationOfLiability: {
            title: "பொறுப்பு வரம்புகள்",
            subTitle: "ezyICT பின்வருவனவற்றிற்கு பொறுப்பேற்காது:",
            items: [
                "சேவை தடங்கல்கள் அல்லது செயலிழப்புகள்",
                "வெளிப்புற காரணிகளால் ஏற்படும் தரவு இழப்பு",
                "மறைமுகமான சேதங்கள்"
            ]
        },
        modifications: {
            title: "விதிமுறைகளில் மாற்றங்கள்",
            icon: "5",
            text: "விதிமுறைகளை எந்த நேரத்திலும் புதுப்பிக்க எங்களுக்கு உரிமை உண்டு. தளத்தை தொடர்ந்து பயன்படுத்துவது மாற்றங்களை ஏற்றுக்கொள்வதைக் குறிக்கிறது."
        },
        footer: {
            title: "கேள்விகள் உள்ளதா?",
            text: "இந்த விதிமுறைகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால், எமது ஆதரவுக் குழுவைத் தொடர்பு கொள்ளவும்."
        }
    }
};

export default function TermsConditionsPage() {
    const [lang, setLang] = useState<'en' | 'si' | 'ta'>('en');
    const t = translations[lang];

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

                        {/* Language & Actions */}
                        <div className="flex items-center gap-6">
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                                <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}>English</button>
                                <button onClick={() => setLang('si')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'si' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}>සිංහල</button>
                                <button onClick={() => setLang('ta')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'ta' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}>தமிழ்</button>
                            </div>
                            <div className="hidden sm:flex items-center gap-4 border-l pl-6 border-slate-200">
                                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Log In</Link>
                                <Link href="/register">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">Sign Up</Button>
                                </Link>
                            </div>
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
                            <span>{t.heroTag}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            {t.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {t.heroText}
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {t.sections.map((section) => (
                            <div key={section.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">{section.icon}</span>
                                    {section.title}
                                </h2>
                                <div className="space-y-4 text-slate-600">
                                    {section.list && (
                                        <ul className="space-y-3">
                                            {section.list.map((item, idx) => (
                                                <li key={idx} className="flex gap-3 items-start">
                                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.alerts && (
                                        <div className="space-y-3">
                                            {section.alerts.map((alert, idx) => (
                                                <div key={idx} className="flex gap-3 items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                    <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                                                    <span>{alert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {section.checks && (
                                        <div className="space-y-3">
                                            {section.checks.map((check, idx) => (
                                                <div key={idx} className="flex gap-3 items-start p-4 bg-green-50 rounded-2xl border border-green-100">
                                                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                                                    <span>{check}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Refunds */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">{t.refunds.icon}</span>
                                {t.refunds.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {t.refunds.text.split('Refund Policy').map((part, i, arr) => (
                                    <React.Fragment key={i}>
                                        {part}
                                        {i < arr.length - 1 && <Link href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-semibold underline">{lang === 'si' ? 'මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය' : lang === 'ta' ? 'பணத்தைத் திரும்பப் பெறும் கொள்கை' : 'Refund Policy'}</Link>}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Lock className="text-blue-600" size={28} />
                                {t.intellectualProperty.title}
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">{t.intellectualProperty.text}</p>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <AlertTriangle className="text-orange-500" size={28} />
                                {t.limitationOfLiability.title}
                            </h2>
                            <p className="text-slate-600 mb-4 font-semibold">{t.limitationOfLiability.subTitle}</p>
                            <ul className="space-y-3">
                                {t.limitationOfLiability.items.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                        <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Modifications */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">{t.modifications.icon}</span>
                                {t.modifications.title}
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">{t.modifications.text}</p>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}
