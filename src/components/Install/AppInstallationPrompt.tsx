"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export default function AppInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Already installed? Don't show.
        const isInstalled =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as NavigatorStandalone).standalone === true;

        const hasInstalledBefore =
            localStorage.getItem("snapcard-installed") === "true";

        if (isInstalled || hasInstalledBefore) return;

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Wait 7 seconds before showing
            setTimeout(() => {
                setShowPrompt(true);
            }, 7000);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        // iOS fallback (no beforeinstallprompt event)
        const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
        if (isIOS && !isInstalled) {
            setTimeout(() => {
                setShowPrompt(true);
            }, 7000);
        }

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === "accepted") {
                localStorage.setItem("snapcard-installed", "true");
            }

            setShowPrompt(false);
            setDeferredPrompt(null);
        } else {
            // fallback for iOS
            localStorage.setItem("snapcard-installed", "true");
            setShowPrompt(false);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-2xl p-6 flex items-center gap-4 animate-fade-in">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <Image
                    src="/mobile.webp"
                    alt="SnapCard App"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">
                    Install SnapCard
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Experience SnapCard as a fast, professional business tool.
                    Add to your device for quick access—no App Store required.
                </p>
                <div className="block md:flex gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                    >
                        Install Now
                    </button>
                    <a
                        href="/snapcard.apk"
                        download
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold text-sm transition-colors"
                    >
                        Download App
                    </a>
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    For iOS: Tap <span className="font-bold">Share</span> 🔗 and
                    select{" "}
                    <span className="font-bold">
                        &quot;Add to Home Screen&quot;
                    </span>
                    .
                </div>
            </div>
        </div>
    );
}
