"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
    Linkedin,
    Twitter,
    Instagram,
    Music2 as Music,
    Mail,
    Phone,
    Briefcase,
    Edit3,
    QrCode,
    Scan,
    Users,
    ExternalLink,
    LogOut,
} from "lucide-react";

interface ProfileData {
    email: string;
    displayName: string;
    username: string;
    company: string;
    role: string;
    photoURL: string;
    phone?: string;
    links: {
        instagram?: string;
        twitter?: string;
        tiktok?: string;
        linkedin?: string;
    };
}

// CTA component
function DashboardCTA({ user }: { user: User | null }) {
    const auth = getAuth();
    if (user) {
        return (
            <div className="flex gap-2 justify-end mb-4">
                <Link
                    href="/profile"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Profile
                </Link>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 cursor-pointer"
                    onClick={() => signOut(auth)}
                >
                    Sign Out
                </button>
            </div>
        );
    }
    return (
        <div className="flex gap-2 justify-center items-center mb-4">
            <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Sign In
            </Link>
            <Link
                href="/register"
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
                Create Account
            </Link>
        </div>
    );
}

export default function Dashboard() {
    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsub();
    }, [auth]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            const docRef = doc(db, "profiles", user.email);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = snap.data() as ProfileData;
                setProfile({
                    ...data,
                    displayName: data.displayName || user.displayName || "",
                    photoURL:
                        data.photoURL ||
                        user.photoURL ||
                        "/default-avatar.webp",
                    email: user.email || "",
                });
            } else {
                setProfile({
                    displayName: user.displayName || "",
                    photoURL: user.photoURL || "/default-avatar.webp",
                    email: user.email || "",
                    username: "",
                    company: "",
                    role: "",
                    phone: "",
                    links: {},
                });
            }
            setLoading(false);
        };

        if (user) fetchProfile();
        else setLoading(false);
    }, [user]);

    const handleSignOut = () => {
        signOut(auth).catch((error) =>
            console.error("Error signing out:", error)
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen px-4">
                <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!user || !profile) {
        return (
            <main className="min-h-screen bg-gray-50 mx-auto dark:bg-gray-950 text-gray-950 dark:text-gray-50 py-12">
                <div className="max-w-md mx-auto text-center">
                    <DashboardCTA user={user} />
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">
                        Authentication Required
                    </h2>
                    <p className="text-base">
                        Please sign in to view your dashboard.
                    </p>
                </div>
            </main>
        );
    }

    const socialLinks = [
        {
            key: "linkedin",
            icon: Linkedin,
            url: profile.links.linkedin,
            color: "text-blue-600 hover:text-blue-700",
        },
        {
            key: "twitter",
            icon: Twitter,
            url: profile.links.twitter,
            color: "text-blue-400 hover:text-blue-500",
        },
        {
            key: "instagram",
            icon: Instagram,
            url: profile.links.instagram,
            color: "text-pink-600 hover:text-pink-700",
        },
        {
            key: "tiktok",
            icon: Music,
            url: profile.links.tiktok,
            color: "text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-300",
        },
    ].filter((link) => link.url);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <DashboardCTA user={user} />

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                        Welcome to Snap Card
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Your digital business card solution
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-2 static md:sticky max-h-fit top-25 order-1 lg:order-1 transition-all duration-300 ease-in-out">
                        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Profile Header */}
                            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                                            <Image
                                                src={profile.photoURL}
                                                alt="Profile"
                                                width={80}
                                                height={80}
                                                className="w-20 h-26 sm:h-24 rounded-xl sm:rounded-2xl object-top border-4 border-white dark:border-gray-700 shadow-lg"
                                            />
                                        </div>
                                        <div className="text-center sm:text-left w-full sm:w-auto">
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words">
                                                {profile.displayName ||
                                                    "Unnamed User"}
                                            </h2>
                                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 mb-3">
                                                <Briefcase
                                                    size={16}
                                                    className="hidden sm:block flex-shrink-0"
                                                />
                                                <span className="text-sm sm:text-base md:text-lg text-center sm:text-left break-words">
                                                    {profile.role ||
                                                        "No role added"}
                                                    {profile.company && (
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {" at " +
                                                                profile.company}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/profile">
                                        <button className="hidden md:block p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 self-end sm:self-start cursor-pointer">
                                            <Edit3
                                                size={18}
                                                className="text-gray-600 dark:text-gray-400"
                                            />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
                                        <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex-shrink-0">
                                            <Mail
                                                size={18}
                                                className="text-blue-600 dark:text-blue-400"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Email
                                            </p>
                                            <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-all">
                                                {profile.email}
                                            </p>
                                        </div>
                                    </div>

                                    {profile.phone && (
                                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
                                            <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Phone
                                                    size={18}
                                                    className="text-green-600 dark:text-green-400"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Phone
                                                </p>
                                                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-all">
                                                    {profile.phone}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                        Social Links
                                    </h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-4">
                                        {socialLinks.map(
                                            ({
                                                key,
                                                icon: Icon,
                                                url,
                                                color,
                                            }) => {
                                                // Add https:// if not present
                                                const fullUrl = url?.startsWith(
                                                    "http"
                                                )
                                                    ? url
                                                    : `https://${url}`;

                                                return (
                                                    <a
                                                        key={key}
                                                        href={fullUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${color}`}
                                                    >
                                                        <Icon size={20} />
                                                    </a>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="order-2 lg:order-2">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                            <Link href="/download" className="block">
                                <div className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg sm:rounded-xl">
                                            <QrCode
                                                size={20}
                                                className="text-indigo-600 dark:text-indigo-400"
                                            />
                                        </div>
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Download Card
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        Choose a format and download your
                                        business card
                                    </p>
                                </div>
                            </Link>

                            <Link href="/profile" className="block">
                                <div className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                                            <Edit3
                                                size={20}
                                                className="text-blue-600 dark:text-blue-400"
                                            />
                                        </div>
                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                        />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Edit Profile
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        Update your contact details and
                                        information
                                    </p>
                                </div>
                            </Link>

                            <Link href="/qrcode" className="block">
                                <div className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl">
                                            <QrCode
                                                size={20}
                                                className="text-purple-600 dark:text-purple-400"
                                            />
                                        </div>
                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                        />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Your QR Code
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        Share your profile instantly with others
                                    </p>
                                </div>
                            </Link>

                            <Link href="/scan" className="block">
                                <div className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl">
                                            <Scan
                                                size={20}
                                                className="text-green-600 dark:text-green-400"
                                            />
                                        </div>
                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                        />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Scan Code
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        Add new contacts by scanning QR codes
                                    </p>
                                </div>
                            </Link>

                            <Link href="/saved" className="block">
                                <div className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg sm:rounded-xl">
                                            <Users
                                                size={20}
                                                className="text-orange-600 dark:text-orange-400"
                                            />
                                        </div>
                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                        />
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Contacts
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        View and manage your saved contacts
                                    </p>
                                </div>
                            </Link>

                            {/* Sign Out */}
                            <button
                                onClick={handleSignOut}
                                className="w-full p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-red-200 dark:border-red-700 hover:shadow-xl transition-all duration-200 text-left group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl">
                                        <LogOut
                                            size={20}
                                            className="text-red-600 dark:text-red-400"
                                        />
                                    </div>
                                </div>
                                <h4 className="text-base sm:text-lg font-semibold text-red-700 dark:text-red-400 mb-1">
                                    Sign Out
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Log out of your Snap Card account
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
