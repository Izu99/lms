"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Shield, Lock, Eye, FileText, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
    en: {
        title: "Privacy Policy",
        subtitle: "Privacy Policy for ezyICT Learning Management System",
        heroTag: "Your Privacy Matters",
        heroText: "At ezyICT, we are committed to protecting your privacy and handling your personal data responsibly.",
        sections: [
            {
                id: 1,
                title: "Information We Collect",
                icon: "1",
                content: [
                    "When you visit our website, we may collect certain information about you, including:",
                    "Personal identification information (such as your name, email address, and phone number) provided voluntarily by you during the registration or checkout process",
                    "Payment and billing information necessary to process your orders, which are securely handled by trusted third-party payment processors",
                    "Browsing information, such as your IP address, browser type, and device information, collected automatically using cookies and similar technologies",
                    "Learning activity data including course access, progress, and submissions"
                ]
            },
            {
                id: 2,
                title: "Use of Information",
                icon: "2",
                content: [
                    "We may use the collected information for the following purposes:",
                    "Process enrollments and payments",
                    "Provide access to learning materials and services",
                    "Communicate important updates and support messages",
                    "Improve platform performance and user experience",
                    "Prevent fraud and unauthorized access"
                ]
            },
            {
                id: 3,
                title: "Information Sharing",
                icon: "3",
                content: [
                    "We do not sell or trade your personal data. Information may be shared only with:",
                    "Trusted service providers (payment processors like PayHere)",
                    "Legal authorities if required by law"
                ]
            }
        ],
        extraSections: [
            {
                title: "Data Security",
                icon: <Lock className="text-blue-600" size={24} />,
                text: "We use industry-standard security measures to protect your data. While we strive for maximum security, no online system is completely secure. We implement encryption, access controls, and regular security audits to safeguard your personal information."
            },
            {
                title: "Cookies",
                icon: <Eye className="text-blue-600" size={24} />,
                text: "Cookies are used to improve functionality and user experience. You may disable cookies via your browser, though some features may not work properly."
            }
        ],
        contact: {
            title: "Contact Us",
            text: "If you have any questions, concerns, or requests regarding this Privacy Policy, please don't hesitate to reach out to our support team."
        }
    },
    si: {
        title: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
        subtitle: "ezyICT ඉගෙනුම් කළමනාකරණ පද්ධතිය සඳහා පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
        heroTag: "ඔබගේ පෞද්ගලිකත්වය අපට වැදගත් වේ",
        heroText: "ezyICT හි දී, අපි ඔබේ පෞද්ගලිකත්වය ආරක්ෂා කිරීමට සහ ඔබේ පුද්ගලික දත්ත වගකීමෙන් යුතුව හැසිරවීමට බැඳී සිටිමු.",
        sections: [
            {
                id: 1,
                title: "අපි රැස් කරන තොරතුරු",
                icon: "1",
                content: [
                    "ඔබ අපගේ වෙබ් අඩවියට පිවිසෙන විට, අපි ඔබ ගැන යම් තොරතුරු රැස් කළ හැකිය:",
                    "ලියාපදිංචි වීමේදී හෝ ගෙවීමේදී ඔබ ස්වෙච්ඡාවෙන් ලබා දෙන හඳුනාගැනීමේ තොරතුරු (නම, ඊමේල් ලිපිනය සහ දුරකථන අංකය වැනි)",
                    "ඔබේ ඇණවුම් සැකසීමට අවශ්‍ය ගෙවීම් තොරතුරු, ඒවා විශ්වාසදායක තෙවන පාර්ශවීය ගෙවීම් සපයන්නන් විසින් ආරක්ෂිතව හසුරුවනු ලැබේ",
                    "කුකීස් (Cookies) සහ සමාන තාක්ෂණයන් භාවිතයෙන් ස්වයංක්‍රීයව රැස් කරන බ්‍රව්සින් තොරතුරු (IP ලිපිනය, බ්‍රව්සර් වර්ගය සහ උපාංග තොරතුරු වැනි)",
                    "පාඨමාලා ප්‍රවේශය, ප්‍රගතිය සහ ඉදිරිපත් කිරීම් ඇතුළුව ඉගෙනුම් ක්‍රියාකාරකම් දත්ත"
                ]
            },
            {
                id: 2,
                title: "තොරතුරු භාවිතය",
                icon: "2",
                content: [
                    "අපි රැස් කරන ලද තොරතුරු පහත සඳහන් අරමුණු සඳහා භාවිතා කළ හැකිය:",
                    "ලියාපදිංචි කිරීම් සහ ගෙවීම් සැකසීම",
                    "ඉගෙනුම් ද්‍රව්‍ය සහ සේවාවන් සඳහා ප්‍රවේශය ලබා දීම",
                    "වැදගත් යාවත්කාලීන කිරීම් සහ සහාය පණිවිඩ සන්නිවේදනය කිරීම",
                    "පද්ධතියේ ක්‍රියාකාරීත්වය සහ පරිශීලක අත්දැකීම් වැඩිදියුණු කිරීම",
                    "වංචා සහ අනවසර ප්‍රවේශයන් වැළැක්වීම"
                ]
            },
            {
                id: 3,
                title: "තොරතුරු බෙදා ගැනීම",
                icon: "3",
                content: [
                    "අපි ඔබේ පුද්ගලික දත්ත විකිණීම හෝ වෙළඳාම් කිරීම සිදු නොකරමු. තොරතුරු බෙදා ගනු ලබන්නේ පහත අයට පමණි:",
                    "විශ්වාසදායක සේවා සපයන්නන් (PayHere වැනි ගෙවීම් සපයන්නන්)",
                    "නීතියෙන් අවශ්‍ය නම් නීතිමය බලධාරීන් වෙත"
                ]
            }
        ],
        extraSections: [
            {
                title: "දත්ත ආරක්ෂාව",
                icon: <Lock className="text-blue-600" size={24} />,
                text: "ඔබේ දත්ත ආරක්ෂා කිරීම සඳහා අපි කර්මාන්තයේ සම්මත ආරක්ෂක පියවරයන් භාවිතා කරමු. උපරිම ආරක්ෂාව සඳහා අපි උත්සාහ කළද, කිසිදු ඔන්ලයින් පද්ධතියක් සම්පූර්ණයෙන්ම ආරක්ෂිත නොවේ. අපි සංකේතනය (Encryption), ප්‍රවේශ සීමා කිරීම් සහ නිතිපතා ආරක්ෂක පරීක්ෂාවන් සිදු කරමු."
            },
            {
                title: "කුකීස් (Cookies)",
                icon: <Eye className="text-blue-600" size={24} />,
                text: "ක්‍රියාකාරීත්වය සහ පරිශීලක අත්දැකීම් වැඩිදියුණු කිරීමට කුකීස් භාවිතා කරයි. ඔබට බ්‍රව්සරය හරහා කුකීස් අක්‍රීය කළ හැකිය, නමුත් එවිට සමහර පහසුකම් නිවැරදිව ක්‍රියා නොකරනු ඇත."
            }
        ],
        contact: {
            title: "අපව අමතන්න",
            text: "මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක් හෝ ඉල්ලීමක් ඇත්නම්, කරුණාකර අපගේ සහාය කණ්ඩායම අමතන්න."
        }
    },
    ta: {
        title: "தனியுரிமைக் கொள்கை",
        subtitle: "ezyICT கற்றல் மேலாண்மை அமைப்புக்கான தனியுரிமைக் கொள்கை",
        heroTag: "உங்கள் தனியுரிமை முக்கியமானது",
        heroText: "ezyICT இல், உங்கள் தனியுரிமையைப் பாதுகாப்பதற்கும் உங்கள் தனிப்பட்ட தரவை பொறுப்புடன் கையாளுவதற்கும் நாங்கள் கடமைப்பட்டுள்ளோம்.",
        sections: [
            {
                id: 1,
                title: "நாங்கள் சேகரிக்கும் தகவல்கள்",
                icon: "1",
                content: [
                    "நீங்கள் எமது இணையதளத்தைப் பார்வையிடும்போது, உங்களுடை சில தகவல்களை நாங்கள் சேகரிக்கலாம்:",
                    "பதிவு செய்யும் போது அல்லது பணம் செலுத்தும் போது நீங்கள் தானாக முன்வந்து வழங்கும் அடையாளத் தகவல்கள் (பெயர், மின்னஞ்சல் முகவரி மற்றும் தொலைபேசி எண் போன்றவை)",
                    "கட்டணங்களைச் செயல்படுத்தத் தேவையான தகவல்கள், இவை பாதுகாப்பான மூன்றாம் தரப்பு கட்டணச் செயலிகளால் கையாளப்படுகின்றன",
                    "குக்கீகள் (Cookies) மூலம் தானாகவே சேகரிக்கப்படும் உலாவல் தகவல்கள் (IP முகவரி, உலாவி வகை போன்றவை)",
                    "பாடநெறி அணுகல், முன்னேற்றம் மற்றும் சமர்ப்பிப்புகள் உள்ளிட்ட கற்றல் செயல்பாட்டுத் தரவு"
                ]
            },
            {
                id: 2,
                title: "தகவல் பயன்பாடு",
                icon: "2",
                content: [
                    "சேகரிக்கப்பட்ட தகவல்களை பின்வரும் நோக்கங்களுக்காக நாங்கள் பயன்படுத்தலாம்:",
                    "பதிவுகள் மற்றும் கட்டணங்களைச் செயலாக்குதல்",
                    "கற்றல் பொருட்கள் மற்றும் சேவைகளுக்கான அணுகலை வழங்குதல்",
                    "முக்கியமான புதுப்பிப்புகள் மற்றும் ஆதரவுச் செய்திகளைத் தொடர்புகொள்ளுதல்",
                    "தளத்தின் செயல்திறன் மற்றும் பயனர் அனுபவத்தை மேம்படுத்துதல்",
                    "மோசடி மற்றும் அங்கீகரிக்கப்படாத அணுகலைத் தடுத்தல்"
                ]
            },
            {
                id: 3,
                title: "தகவல் பகிர்தல்",
                icon: "3",
                content: [
                    "நாங்கள் உங்கள் தனிப்பட்ட தரவை விற்பனை செய்வதோ அல்லது வர்த்தகம் செய்வதோ இல்லை. தகவல்கள் பின்வருவனவற்றுடன் மட்டுமே பகிரப்படலாம்:",
                    "நம்பகமான சேவை வழங்குநர்கள் (PayHere போன்ற கட்டணச் செயலிகள்)",
                    "சட்டப்படி தேவைப்பட்டால் சட்ட அதிகாரிகள்"
                ]
            }
        ],
        extraSections: [
            {
                title: "தரவு பாதுகாப்பு",
                icon: <Lock className="text-blue-600" size={24} />,
                text: "உங்கள் தரவைப் பாதுகாக்க நாங்கள் தொழில்துறை தரமான பாதுகாப்பு நடவடிக்கைகளைப் பயன்படுத்துகிறோம். குறியாக்கம் (Encryption) மற்றும் வழக்கமான பாதுகாப்பு தணிக்கைகளை நாங்கள் மேற்கொள்கிறோம்."
            },
            {
                title: "குக்கீகள் (Cookies)",
                icon: <Eye className="text-blue-600" size={24} />,
                text: "செயல்பாடு மற்றும் பயனர் அனுபவத்தை மேம்படுத்த குக்கீகள் பயன்படுத்தப்படுகின்றன. உங்கள் உலாவியின் மூலம் குக்கீகளை நீங்கள் முடக்கலாம்."
            }
        ],
        contact: {
            title: "எங்களைத் தொடர்பு கொள்ளுங்கள்",
            text: "இந்த தனியுரிமைக் கொள்கை குறித்து உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால், தயவுசெய்து எமது ஆதரவு குழுவைத் தொடர்பு கொள்ளவும்."
        }
    }
};

export default function PrivacyPolicyPage() {
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
                            <Shield size={16} />
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
                                    <p>{section.content[0]}</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        {section.content.slice(1).map((item, idx) => (
                                            <li key={idx} className="leading-relaxed">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        {t.extraSections.map((section, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    {section.icon}
                                    {section.title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed">{section.text}</p>
                            </div>
                        ))}
                    </div>
                </section>


            </main>
        </div>
    );
}
