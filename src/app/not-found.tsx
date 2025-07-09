"use client";

import Link from "next/link";
import { QrCode, Edit3, Users } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-6">
                {/* SVG Illustration */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    className="w-40 h-40 text-gray-500 dark:text-gray-400 mb-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="10" y="8" width="44" height="48" rx="4" ry="4" />
                    <path d="M10 16h44" />
                    <text
                        x="32"
                        y="36"
                        textAnchor="middle"
                        fontSize="14"
                        fill="currentColor"
                        fontFamily="Arial, sans-serif"
                    >
                        404
                    </text>
                    <circle cx="24" cy="46" r="1.5" fill="currentColor" />
                    <circle cx="40" cy="46" r="1.5" fill="currentColor" />
                    <path d="M26 52c2 2 10 2 12 0" stroke="currentColor" />
                </svg>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Page Not Found
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    Sorry, the page you are looking for doesn’t exist or has
                    been moved.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
                            <QrCode size={18} />
                            Home
                        </button>
                    </Link>

                    <Link href="/profile">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                            <Edit3 size={18} />
                            Edit Profile
                        </button>
                    </Link>

                    <Link href="/saved">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-700 transition cursor-pointer">
                            <Users size={18} />
                            My Contacts
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
