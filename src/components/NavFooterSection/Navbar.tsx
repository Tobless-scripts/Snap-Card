"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Home, ScanLine, Sun, Moon, QrCode, User } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NavItem = ({ to, label }: { to: string; label: string }) => {
    const pathname = usePathname();
    const baseStyle = "transition-colors duration-200 font-medium";
    const inactiveStyle =
        "text-gray-600 dark:text-gray-300 hover:text-blue-600";
    const activeStyle = "text-blue-600";

    const isActive = pathname === to;

    return (
        <Link
            href={to}
            className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
            {label}
        </Link>
    );
};

const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState<FirebaseUser | null>(null);

    const pathname = usePathname();

    // ✅ Watch Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    // Sticky header
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setIsSticky(scrollTop > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Theme init
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const initialTheme = savedTheme
            ? savedTheme === "dark"
            : systemPrefersDark;
        setIsDark(initialTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light");
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [isDark]);

    const navLinks = [
        { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
        { to: "/qrcode", label: "QR Code", icon: <QrCode size={20} /> },
        { to: "/saved", label: "Saved Contacts", icon: <Heart size={20} /> },
        { to: "/scan", label: "Scan", icon: <ScanLine size={20} /> },
    ];

    return (
        <>
            <header
                className={`w-full z-50 transition-all duration-300 ease-in-out border-b border-gray-300 dark:border-gray-700 ${
                    isSticky
                        ? "fixed top-0 left-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
                        : "relative bg-white dark:bg-gray-900"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link href="/">
                            <div className="flex items-center w-full space-x-3 cursor-pointer">
                                <div className="w-10 h-10 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="logo"
                                        title="logo"
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Snap Card
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link, index) => (
                                <NavItem key={index} {...link} />
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDark(!isDark)}
                                aria-label="Toggle Dark Mode"
                                className="p-2 rounded-full text-gray-600 dark:text-white bg-yellow-500/30 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            >
                                {isDark ? (
                                    <Sun size={20} />
                                ) : (
                                    <Moon size={20} />
                                )}
                            </button>

                            {/* Desktop: Profile or Auth Links */}
                            <div className="hidden md:flex items-center space-x-4">
                                {user ? (
                                    <Link href="/profile">
                                        <button
                                            aria-label="Profile"
                                            className="p-2 rounded-full text-gray-600 dark:text-white hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                        >
                                            <User size={20} />
                                        </button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <span className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer">
                                                Sign In
                                            </span>
                                        </Link>
                                        <Link href="/register">
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
                                                Get Started
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile: Profile or Get Started */}
                            <div className="block md:hidden">
                                {user ? (
                                    <Link href="/profile">
                                        <button
                                            aria-label="Profile"
                                            className="p-2 rounded-full text-gray-600 dark:text-white hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                        >
                                            <User size={20} />
                                        </button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
                                            Get Started
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-inner flex justify-around items-center py-2 border-t border-gray-200 dark:border-gray-700 z-40">
                {navLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.to}
                        className={`flex flex-col items-center text-xs ${
                            pathname === link.to
                                ? "text-blue-600"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Navbar;
