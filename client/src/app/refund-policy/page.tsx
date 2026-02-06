"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Shield, CreditCard, DollarSign, Clock, AlertCircle, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
    en: {
        title: "Refund Policy",
        heroTag: "Transparent Refund Policy",
        heroText: "We value your satisfaction. Learn about our refund eligibility, process, and terms.",
        introTitle: "Thank You for Choosing ezyICT",
        introText: "Thank you for choosing ezyICT Learning Management System. We value your trust and aim to provide high-quality educational services. Please read our refund policy carefully before making a payment.",
        sections: [
            {
                id: 1,
                title: "Refund Eligibility",
                icon: "1",
                text: "Payments made for online courses, physical classes, tutorials, or digital learning materials are generally non-refundable, except under the conditions listed below.",
                subTitle: "Refunds may be considered if:",
                list: [
                    "A duplicate payment was made for the same course",
                    "A technical error occurred during payment processing",
                    "The course or service was cancelled by ezyICT"
                ]
            },
            {
                id: 2,
                title: "Refund Process",
                icon: "2",
                text: "All payments are processed via PayHere. Approved refunds will be issued only to the original payment method used during checkout.",
                subTitle: "Refunds are handled as:",
                cards: [
                    {
                        title: "Instant Refunds",
                        desc: "If refunded on the same day before settlement",
                        type: "instant"
                    },
                    {
                        title: "Delayed Refunds",
                        desc: "If refunded after settlement (may take 5–10 business days)",
                        type: "delayed"
                    }
                ]
            }
        ],
        nonRefundable: {
            title: "Non-Refundable Items",
            text: "The following are not eligible for refunds:",
            items: [
                "Access to online video courses after access is granted",
                "Downloadable study materials",
                "Exam or registration fees",
                "Customized or personalized educational services"
            ]
        },
        processingTime: {
            title: "Processing Time",
            text: "Once approved, refunds are processed within 5–10 business days, depending on your bank or card provider. Please note that it may take additional time for the refund to appear in your account."
        },
        questions: {
            title: "Have Questions?",
            text: "If you believe you qualify for a refund or have questions about our refund policy, please contact us via the support details provided on our website. We are here to assist you and ensure your experience with us is satisfactory."
        },
        footer: {
            help: "Need Help?",
            helpText: "For any questions about refunds or our policies, reach out to our support team."
        }
    },
    si: {
        title: "මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය",
        heroTag: "විනිවිදභාවයෙන් යුත් ප්‍රතිපත්තිය",
        heroText: "අපි ඔබේ තෘප්තිය අගය කරමු. අපගේ මුදල් ආපසු ගෙවීමේ සුදුසුකම්, ක්‍රියාවලිය සහ කොන්දේසි ගැන දැනගන්න.",
        introTitle: "ezyICT තෝරා ගැනීම ගැන ස්තූතියි",
        introText: "ezyICT ඉගෙනුම් කළමනාකරණ පද්ධතිය තෝරා ගැනීම ගැන ස්තූතියි. අපි ඔබේ විශ්වාසය අගය කරන අතර උසස් තත්ත්වයේ අධ්‍යාපනික සේවාවන් සැපයීම අපගේ අරමුණයි. කරුණාකර ගෙවීමක් කිරීමට පෙර අපගේ මුදල් ආපසු ගෙවීමේ ප්‍රතිපත්තිය ප්‍රවේශමෙන් කියවන්න.",
        sections: [
            {
                id: 1,
                title: "මුදල් ආපසු ලබා ගැනීම සඳහා සුදුසුකම්",
                icon: "1",
                text: "සබැඳි පාඨමාලා, භෞතික පන්ති, නිබන්ධන හෝ ඩිජිටල් ඉගෙනුම් ද්‍රව්‍ය සඳහා කරන ලද ගෙවීම් සාමාන්‍යයෙන් ආපසු ගෙවනු නොලැබේ, පහත සඳහන් කොන්දේසි යටතේ හැර.",
                subTitle: "පහත අවස්ථාවලදී මුදල් ආපසු ගෙවීමක් ගැන සලකා බැලිය හැක:",
                list: [
                    "එකම පාඨමාලාව සඳහා වැරදීමකින් දෙවරක් ගෙවීමක් කර ඇත්නම්",
                    "ගෙවීම් සැකසීමේදී තාක්ෂණික දෝෂයක් සිදු වූයේ නම්",
                    "පාඨමාලාව හෝ සේවාව ezyICT විසින් අවලංගු කරන ලද්දේ නම්"
                ]
            },
            {
                id: 2,
                title: "මුදල් ආපසු ගෙවීමේ ක්‍රියාවලිය",
                icon: "2",
                text: "සියලුම ගෙවීම් PayHere හරහා සකසනු ලැබේ. අනුමත කරන ලද මුදල් ආපසු ගෙවීම් නිකුත් කරනු ලබන්නේ ගෙවීම සඳහා භාවිතා කරන ලද මුල් ගෙවීම් ක්‍රමයට පමණි.",
                subTitle: "මුදල් ආපසු ගෙවීම් හසුරුවන ආකාරය:",
                cards: [
                    {
                        title: "ක්ෂණික ප්‍රතිපූරණය",
                        desc: "එදිනම මූල්‍ය පියවීම් වලට පෙර ආපසු ගෙවන්නේ නම්",
                        type: "instant"
                    },
                    {
                        title: "ප්‍රමුදිත ප්‍රතිපූරණය",
                        desc: "මූල්‍ය පියවීම් වලින් පසුව ආපසු ගෙවන්නේ නම් (වැඩ කරන දින 5-10ක් ගත විය හැක)",
                        type: "delayed"
                    }
                ]
            }
        ],
        nonRefundable: {
            title: "මුදල් ආපසු ලබාගත නොහැකි අවස්ථා",
            text: "පහත සඳහන් දෑ සඳහා මුදල් ආපසු ගෙවීම් කරනු නොලැබේ:",
            items: [
                "පාඨමාලා ප්‍රවේශය ලබා දුන් පසු සබැඳි වීඩියෝ පාඨමාලා සඳහා",
                "බාගත කළ හැකි අධ්‍යයන ද්‍රව්‍ය සඳහා",
                "විභාග හෝ ලියාපදිංචි ගාස්තු සඳහා",
                "විශේෂයෙන් සකස් කරන ලද අධ්‍යාපනික සේවාවන් සඳහා"
            ]
        },
        processingTime: {
            title: "ගතවන කාලය",
            text: "අනුමත වූ පසු, ඔබේ බැංකුව හෝ කාඩ්පත් සැපයුම්කරු මත පදනම්ව වැඩ කරන දින 5-10ක් ඇතුළත මුදල් ආපසු ගෙවීම් සිදු කෙරේ. ඔබේ ගිණුමේ මුදල් දිස්වීමට අමතර කාලයක් ගත විය හැකි බව කරුණාවෙන් සලකන්න."
        },
        questions: {
            title: "ප්‍රශ්න තිබේද?",
            text: "ඔබ මුදල් ආපසු ලබා ගැනීමට සුදුසු යැයි විශ්වාස කරන්නේ නම් හෝ අපගේ ප්‍රතිපත්තිය ගැන ප්‍රශ්න ඇත්නම්, කරුණාකර අපගේ වෙබ් අඩවියේ ඇති සහාය විස්තර හරහා අපව අමතන්න. ඔබට සහාය වීමට අපි සැදී පැහැදී සිටිමු."
        },
        footer: {
            help: "සහාය අවශ්‍යද?",
            helpText: "මුදල් ආපසු ගෙවීම් හෝ අපගේ ප්‍රතිපත්ති පිළිබඳ ඕනෑම ප්‍රශ්නයක් සඳහා අපගේ සහාය කණ්ඩායම අමතන්න."
        }
    },
    ta: {
        title: "பணத்தைத் திரும்பப் பெறும் கொள்கை",
        heroTag: "வெளிப்படையான கொள்கை",
        heroText: "உங்கள் திருப்தியை நாங்கள் மதிக்கிறோம். பணத்தைத் திரும்பப் பெறுவதற்கான தகுதி, செயல்முறை மற்றும் விதிமுறைகளைப் பற்றி தெரிந்து கொள்ளுங்கள்.",
        introTitle: "ezyICT ஐத் தேர்ந்தெடுத்தமைக்கு நன்றி",
        introText: "ezyICT கற்றல் மேலாண்மை முறையைத் தேர்ந்தெடுத்தமைக்கு நன்றி. உங்கள் நம்பிக்கையை நாங்கள் மதிக்கிறோம் மற்றும் உயர்தர கல்விச் சேவைகளை வழங்குவதை நோக்கமாகக் கொண்டுள்ளோம். பணம் செலுத்துவதற்கு முன் எமது பணத்தைத் திரும்பப் பெறும் கொள்கையை கவனமாகப் படிக்கவும்.",
        sections: [
            {
                id: 1,
                title: "பணத்தைத் திரும்பப் பெறுவதற்கான தகுதி",
                icon: "1",
                text: "ஒன்லைன் பாடநெறிகள், நேரடி வகுப்புகள் அல்லது டிஜிட்டல் கற்றல் பொருட்களுக்காக செலுத்தப்பட்ட பணம் பொதுவாகத் திரும்பப் பெறப்படமாட்டாது, கீழ்க்கண்ட நிபந்தனைகளைத் தவிர.",
                subTitle: "கீழ்க்கண்ட சந்தர்ப்பங்களில் பணத்தைத் திரும்பப் பெறுவது குறித்து பரிசீலிக்கப்படலாம்:",
                list: [
                    "ஒரே பாடநெறிக்குத் தவறுதலாக இருமுறை பணம் செலுத்தப்பட்டிருந்தால்",
                    "பணம் செலுத்தும் போது தொழில்நுட்பக் கோளாறு ஏற்பட்டிருந்தால்",
                    "பாடநெறி அல்லது சேவை ezyICT ஆல் ரத்து செய்யப்பட்டிருந்தால்"
                ]
            },
            {
                id: 2,
                title: "பணத்தைத் திரும்பப் பெறும் செயல்முறை",
                icon: "2",
                text: "அனைத்து கொடுப்பனவுகளும் PayHere மூலம் செயல்படுத்தப்படுகின்றன. அங்கீகரிக்கப்பட்ட பணத்தைத் திரும்பப் பெறுதல்கள் அசல் கட்டண முறைக்கு மட்டுமே வழங்கப்படும்.",
                subTitle: "பணத்தைத் திரும்பப் பெறுதல் கையாளப்படும் விதம்:",
                cards: [
                    {
                        title: "உடனடி பணத்தைத் திரும்பப் பெறுதல்",
                        desc: "குடியேற்றத்திற்கு முன் அதே நாளில் திரும்பப் பெறப்பட்டால்",
                        type: "instant"
                    },
                    {
                        title: "தாமதமான பணத்தைத் திரும்பப் பெறுதல்",
                        desc: "குடியேற்றத்திற்குப் பிறகு திரும்பப் பெறப்பட்டால் (5-10 வேலை நாட்கள் ஆகலாம்)",
                        type: "delayed"
                    }
                ]
            }
        ],
        nonRefundable: {
            title: "திரும்பப் பெற முடியாதவை",
            text: "பின்வருவனவற்றுக்கு பணத்தைத் திரும்பப் பெற முடியாது:",
            items: [
                "அணுகல் வழங்கப்பட்ட பிறகு ஒன்லைன் வீடியோ பாடநெறிகள்",
                "பதிவிறக்கம் செய்யக்கூடிய ஆய்வுப் பொருட்கள்",
                "தேர்வு அல்லது பதிவு கட்டணங்கள்",
                "தனிப்பயனாக்கப்பட்ட கல்விச் சேவைகள்"
            ]
        },
        processingTime: {
            title: "செயலாக்க நேரம்",
            text: "அங்கீகரிக்கப்பட்டதும், உங்கள் வங்கி அல்லது அட்டை வழங்குநரைப் பொறுத்து 5-10 வேலை நாட்களுக்குள் பணம் திரும்பப் பெறப்படும்."
        },
        questions: {
            title: "கேள்விகள் உள்ளதா?",
            text: "பணத்தைத் திரும்பப் பெறும் கொள்கை குறித்து ஏதேனும் கேள்விகள் இருந்தால், தயவுசெய்து எமது ஆதரவுக் குழுவைத் தொடர்பு கொள்ளவும்."
        },
        footer: {
            help: "உதவி தேவையா?",
            helpText: "பணத்தைத் திரும்பப் பெறுதல் குறித்த கேள்விகளுக்கு எமது ஆதரவுக் குழுவை அணுகவும்."
        }
    }
};

export default function RefundPolicyPage() {
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
                            <DollarSign size={16} />
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
                        {/* Introduction */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <Shield className="text-blue-600" size={28} />
                                {t.introTitle}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">{t.introText}</p>
                        </div>

                        {t.sections.map((section) => (
                            <div key={section.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 text-lg font-bold">{section.icon}</span>
                                    {section.title}
                                </h2>
                                <div className="space-y-4 text-slate-600">
                                    <p>{section.text}</p>
                                    <div className="font-semibold text-slate-900">{section.subTitle}</div>
                                    {section.list && (
                                        <ul className="list-disc pl-6 space-y-2">
                                            {section.list.map((item, idx) => (
                                                <li key={idx} className="leading-relaxed">{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.cards && (
                                        <div className="space-y-3">
                                            {section.cards.map((card, idx) => (
                                                <div key={idx} className={`flex gap-4 items-start p-4 rounded-2xl border ${card.type === 'instant' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                                                    {card.type === 'instant' ? <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} /> : <Clock className="text-blue-600 shrink-0 mt-1" size={20} />}
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{card.title}</h4>
                                                        <p className="text-sm">{card.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Non-Refundable Items */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <AlertCircle className="text-orange-500" size={28} />
                                {t.nonRefundable.title}
                            </h2>
                            <p className="text-slate-600 mb-4">{t.nonRefundable.text}</p>
                            <ul className="space-y-3">
                                {t.nonRefundable.items.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                        <span className="text-orange-600 font-bold text-lg mt-1">•</span>
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Processing Time */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Clock className="text-blue-600" size={28} />
                                {t.processingTime.title}
                            </h2>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-slate-700 leading-relaxed">{t.processingTime.text}</p>
                            </div>
                        </div>

                        {/* Have Questions? */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CreditCard className="text-blue-600" size={28} />
                                {t.questions.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">{t.questions.text}</p>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}
