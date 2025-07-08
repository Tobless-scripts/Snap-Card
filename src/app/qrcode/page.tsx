"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ProfileData {
    displayName: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
    photoURL?: string;
    links: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        tiktok?: string;
    };
}

export default function QRCodePage() {
    const auth = getAuth();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [qr, setQr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchProfileAndGenerateQR = async () => {
            if (!userEmail) return;

            try {
                const docRef = doc(db, "profiles", userEmail);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    console.error("Profile not found");
                    setLoading(false);
                    return;
                }

                const data = docSnap.data() as ProfileData;
                setProfile(data);

                const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${data.displayName}
ORG:${data.company || ""}
TITLE:${data.role || ""}
TEL;TYPE=CELL:${data.phone || ""}
EMAIL:${data.email}
${data.links?.linkedin ? `URL;TYPE=LinkedIn:${data.links.linkedin}` : ""}
${data.links?.twitter ? `URL;TYPE=Twitter:${data.links.twitter}` : ""}
${data.links?.instagram ? `URL;TYPE=Instagram:${data.links.instagram}` : ""}
${data.links?.tiktok ? `URL;TYPE=TikTok:${data.links.tiktok}` : ""}
END:VCARD
        `.trim();

                const qrImage = await QRCode.toDataURL(vCard);
                setQr(qrImage);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchProfileAndGenerateQR();
        }
    }, [userEmail]);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = qr;
        link.download = "contact_qr_code.png";
        link.click();
    };

    if (loading) {
        return (
            <main className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-gray-500 animate-pulse">
                    Loading your QR Code...
                </p>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-red-500 font-medium">
                    No profile found. Please sign in to generate your QR code.
                </p>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center px-6 py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
                {profile.photoURL && (
                    <Image
                        src={profile.photoURL}
                        alt="Profile Photo"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-top mb-4"
                    />
                )}
                <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    {profile.displayName}
                </h1>
                <p className="text-gray-500 mb-6 text-center">
                    {profile.role} at {profile.company}
                </p>
                {qr && (
                    <Image
                        src={qr}
                        alt="QR Code"
                        width={256}
                        height={256}
                        className="rounded-md border mb-6"
                    />
                )}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button
                        onClick={handleDownload}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition"
                    >
                        Download
                    </button>
                    <button
                        onClick={() =>
                            navigator.share && navigator.share({ url: qr })
                        }
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 px-4 rounded-lg text-center transition"
                    >
                        Share
                    </button>
                </div>
            </div>
        </main>
    );
}
