"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
    Edit3,
    QrCode,
    Globe,
    Shield,
    Link2,
    Sparkles,
    ArrowRightLeft,
    Activity,
    BarChart3,
} from "lucide-react";
import Link from "next/link";

const SnapCard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <section
                className="relative overflow-hidden 
    bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
    transition-colors duration-300"
            >
                <div
                    className="absolute inset-0 
        bg-gradient-to-r from-blue-500/20 to-blue-700/20 
        dark:from-gray-800/40 dark:to-gray-900/40
        transition-colors duration-300"
                >
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 1200 800"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <linearGradient
                                id="wave1"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="rgba(255, 255, 255, 0.1)"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="rgba(255, 255, 255, 0.3)"
                                />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,400 Q300,200 600,350 T1200,300 L1200,800 L0,800 Z"
                            fill="url(#wave1)"
                        />
                        <path
                            d="M0,500 Q400,300 800,450 T1200,400 L1200,800 L0,800 Z"
                            fill="url(#wave1)"
                            opacity="0.6"
                        />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Connect Instantly, Share Seamlessly
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                            Create your digital business card, share, and
                            connect with professionals worldwide with just one
                            tap.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {user ? (
                                <Link href="/dashboard">
                                    <button className="bg-white text-blue-600 dark:bg-gray-100 dark:text-blue-700 px-8 py-4 max-md:w-full rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                                        Go to Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/register">
                                    <button className="bg-white text-blue-600 dark:bg-gray-100 dark:text-blue-700 px-8 py-4 max-md:w-full rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                                        Sign Up Now
                                    </button>
                                </Link>
                            )}
                            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors cursor-pointer">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                icon: (
                                    <Edit3 className="w-full h-full text-blue-500" />
                                ),
                                title: "Connect Instantly",
                                text: "Scan others' QR codes to save their details directly to your device.",
                            },
                            {
                                icon: (
                                    <QrCode className="w-full h-full text-blue-500" />
                                ),
                                title: "Share Your QR",
                                text: "Generate a unique QR code to instantly share your contact information with anyone.",
                            },
                            {
                                icon: (
                                    <Link2 className="w-full h-full text-blue-500" />
                                ),
                                title: "Connect Instantly",
                                text: "Scan others' QR codes to save their details directly to your device.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="text-center shadow-lg p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300"
                            >
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-20 lg:py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Why Choose Snap Card?
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <Globe className="w-full h-full text-blue-500" />
                                ),
                                title: "Universal Compatibility",
                                text: "Share your card with anyone, on any device, without app installation.",
                            },
                            {
                                icon: (
                                    <Shield className="w-full h-full text-blue-500" />
                                ),
                                title: "Secure & Private",
                                text: "Your data is encrypted and shared only when you choose to. Full control over privacy.",
                            },
                            {
                                icon: (
                                    <Sparkles className="w-full h-full text-blue-500" />
                                ),
                                title: "Stunning Design",
                                text: "Craft beautiful and professional digital cards that leave a lasting impression.",
                            },
                            {
                                icon: (
                                    <ArrowRightLeft className="w-full h-full text-blue-500" />
                                ),
                                title: "Seamless Exchange",
                                text: "Eliminate manual data entry when exchanging free QR code scanning.",
                            },
                            {
                                icon: (
                                    <Activity className="w-full h-full text-blue-500" />
                                ),
                                title: "Activity Tracking",
                                text: "Keep a log of who you've connected with and when for easy follow-ups.",
                            },
                            {
                                icon: (
                                    <BarChart3 className="w-full h-full text-blue-500" />
                                ),
                                title: "Performance Insights",
                                text: "Understand how your card is being used with intuitive analytics.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:border dark:border-gray-100 text-left transition-colors duration-300"
                            >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        What Our Users Say
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                initials: "AJ",
                                text: "Snap Card transformed how I network. Exchanging contacts is now incredibly swift and professional!",
                                name: "Alex Johnson",
                                role: "Marketing Manager",
                            },
                            {
                                initials: "BW",
                                text: "The design options are fantastic, and the QR code is flawless. Highly recommend this app!",
                                name: "Bob Williams",
                                role: "Entrepreneur",
                            },
                            {
                                initials: "CB",
                                text: "Finally, a modern solution for business cards that actually works. My clients love it!",
                                name: "Charlie Brown",
                                role: "Financial Consultant",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transition-colors duration-300"
                            >
                                <div className="w-12 my-3 h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white font-bold">
                                    {item.initials}
                                </div>
                                <p className="text-gray-900 dark:text-white font-semibold italic mb-6 leading-relaxed">
                                    &quot;{item.text}&quot;
                                </p>
                                <div className="items-center">
                                    <p className="font-semibold text-blue-500">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/20 to-blue-700/20 dark:from-gray-800/40 dark:to-gray-900/40 transition-colors duration-300">
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 1200 800"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <linearGradient
                                id="wave1"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="rgba(255, 255, 255, 0.1)"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="rgba(255, 255, 255, 0.3)"
                                />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,400 Q300,200 600,350 T1200,300 L1200,800 L0,800 Z"
                            fill="url(#wave1)"
                        />
                        <path
                            d="M0,500 Q400,300 800,450 T1200,400 L1200,800 L0,800 Z"
                            fill="url(#wave1)"
                            opacity="0.6"
                        />
                    </svg>
                </div>
                <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Snap & Connect?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Join thousands of professionals simplifying their
                        networking. Get started with Snap Card today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Link href="/dashboard">
                                <button className="bg-white text-blue-600 dark:bg-gray-100 dark:text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                                    Go to My Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link href="/register">
                                <button className="bg-white text-blue-600 dark:bg-gray-100 dark:text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors cursor-pointer">
                                    Create My Free Card
                                </button>
                            </Link>
                        )}

                        {user ? (
                            <Link href="/profile">
                                <button className="border-2 w-full border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors cursor-pointer">
                                    Edit My Profile
                                </button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <button className="border-2 w-full border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors cursor-pointer">
                                    I Already Have an Account
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SnapCard;
