"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { shareVCard as doShareVCard } from "@/lib/shareVcard";
import { generateVCard, ProfileData } from "@/lib/generateVcard";

export default function QRCodePage() {
    const auth = getAuth();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [error, setError] = useState("");
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
                const vCard = generateVCard(data);
                const qrImage = await QRCode.toDataURL(vCard);
                setQr(qrImage);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) fetchProfileAndGenerateQR();
    }, [userEmail]);

    const handleDownloadVCard = () => {
        if (!profile) return;
        const vCard = generateVCard(profile);
        const blob = new Blob([vCard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${profile.displayName.replace(/\s+/g, "_")}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const shareVCard = async () => {
        try {
            if (profile) await doShareVCard(profile);
        } catch {
            setError("Sharing is not available on this device.");
            setTimeout(() => setError(""), 5000);
        }
    };

    if (loading) {
        return <p>Loading QR Code...</p>;
    }

    if (!profile) {
        return <p>No profile found.</p>;
    }

    return (
        <main className="flex flex-col items-center justify-center px-6 py-12 min-h-screen bg-gray-50 dark:bg-gray-900">
            {error && (
                <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
                    {error}
                </div>
            )}
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
                        onClick={handleDownloadVCard}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition cursor-pointer"
                    >
                        Download
                    </button>
                    <button
                        onClick={shareVCard}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 px-4 rounded-lg text-center transition cursor-pointer"
                    >
                        Share
                    </button>
                </div>
            </div>
        </main>
    );
}
