"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateVCard, ProfileData } from "@/lib/generateVcard";
import BusinessCardFront from "@/components/download/BusinessCardFront";
import CardBack from "@/components/download/BusinessCardBack";
import Button from "@/components/ui/Button";
import { toPng } from "html-to-image";
import { CARD_SIZES } from "@/lib/cardSizes";

export default function DownloadCardPage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [qrImage, setQrImage] = useState<string>("");
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const cardFrontRef = useRef<HTMLDivElement>(null);
    const cardBackRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user?.email) {
                const snap = await getDoc(doc(db, "profiles", user.email));
                if (snap.exists()) {
                    const data = snap.data() as ProfileData;
                    setProfile(data);
                    const vCard = generateVCard(data);
                    const qr = await QRCode.toDataURL(vCard, {
                        margin: 1,
                        width: 120,
                    });
                    setQrImage(qr);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const downloadCards = async () => {
        if (
            !cardFrontRef.current ||
            !cardBackRef.current ||
            isDownloading ||
            !profile
        )
            return;

        setIsDownloading(true);
        try {
            // Create a sanitized filename from displayName
            const sanitizedName = profile.displayName
                .toLowerCase()
                .replace(/\s+/g, "-") // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, ""); // Remove special characters

            // Download front card
            const frontDataUrl = await toPng(cardFrontRef.current, {
                backgroundColor: theme === "dark" ? "#111827" : "#f9fafb",
                quality: 1,
                pixelRatio: 3,
                width: CARD_SIZES.large.width,
                height: CARD_SIZES.large.height,
            });

            // Download back card
            const backDataUrl = await toPng(cardBackRef.current, {
                backgroundColor: theme === "dark" ? "#111827" : "#f9fafb",
                quality: 1,
                pixelRatio: 3,
                width: CARD_SIZES.large.width,
                height: CARD_SIZES.large.height,
            });

            // Create download links with personalized filenames
            const frontLink = document.createElement("a");
            frontLink.href = frontDataUrl;
            frontLink.download = `${sanitizedName}-card-front.png`;

            const backLink = document.createElement("a");
            backLink.href = backDataUrl;
            backLink.download = `${sanitizedName}-card-back.png`;

            // Trigger downloads
            document.body.appendChild(frontLink);
            frontLink.click();

            // Small delay between downloads
            setTimeout(() => {
                document.body.appendChild(backLink);
                backLink.click();

                // Cleanup
                document.body.removeChild(frontLink);
                document.body.removeChild(backLink);
                setIsDownloading(false);
            }, 200);
        } catch (error) {
            console.error("Error generating images:", error);
            setIsDownloading(false);
        }
    };

    if (!profile)
        return <p className="text-center text-gray-500 w-full">Loading...</p>;

    return (
        <main className="px-6 py-12 bg-gray-50 dark:bg-gray-900">
            <h1 className="text-xl text-center dark:text-white font-bold mb-4">
                Download Your Business Card
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-6 dark:text-gray-400">
                Preview both sides below, then download your card ready for
                print or digital use.
            </p>
            <div className="flex flex-col xl:flex-row gap-6 items-center mx-auto justify-center">
                {/* 👀 Visible preview (responsive) */}
                <div>
                    <BusinessCardFront
                        profile={profile}
                        theme={theme}
                        showEdit
                    />
                </div>
                <div>
                    <CardBack
                        qrImage={qrImage}
                        profile={profile}
                        theme={theme}
                    />
                </div>

                {/* 🎯 Hidden download-only versions (always large) */}
                <div className="hidden">
                    <div ref={cardFrontRef}>
                        <BusinessCardFront
                            profile={profile}
                            theme={theme}
                            size="large"
                        />
                    </div>
                    <div ref={cardBackRef}>
                        <CardBack
                            qrImage={qrImage}
                            profile={profile}
                            theme={theme}
                            size="large"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-3 justify-center text-sm md:text-lg">
                <Button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                >
                    Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                </Button>
                <Button onClick={downloadCards} disabled={isDownloading}>
                    {isDownloading ? "Downloading..." : "Download PNGs"}
                </Button>
            </div>
        </main>
    );
}
