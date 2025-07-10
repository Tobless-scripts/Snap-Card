"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

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

export default function ProfileForm() {
    const auth = getAuth();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const [offlineMsg, setOfflineMsg] = useState(false);

    const [profile, setProfile] = useState<ProfileData>({
        email: "",
        displayName: "",
        username: "",
        company: "",
        role: "",
        photoURL: "",
        phone: "",
        links: {
            instagram: "",
            twitter: "",
            tiktok: "",
            linkedin: "",
        },
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email || authLoading || !db) return;

            const email = user.email;
            const docRef = doc(db, "profiles", email);

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as ProfileData;
                    setProfile({
                        email,
                        displayName: data.displayName || user.displayName || "",
                        photoURL: data.photoURL || user.photoURL || "",
                        username: data.username || "",
                        company: data.company || "",
                        role: data.role || "",
                        phone: data.phone || "",
                        links: {
                            instagram: data.links?.instagram || "",
                            twitter: data.links?.twitter || "",
                            tiktok: data.links?.tiktok || "",
                            linkedin: data.links?.linkedin || "",
                        },
                    });
                } else {
                    setProfile((prev) => ({
                        ...prev,
                        email,
                        displayName: user.displayName || "",
                        photoURL: user.photoURL || "",
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [user, authLoading]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (offlineMsg) {
            const timer = setTimeout(() => {
                setOfflineMsg(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [offlineMsg]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const linkKeys = ["instagram", "twitter", "tiktok", "linkedin"];

        if (linkKeys.includes(name)) {
            setProfile((prev) => ({
                ...prev,
                links: {
                    ...prev.links,
                    [name]: value,
                },
            }));
        } else {
            setProfile((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile((prev) => ({
                ...prev,
                photoURL: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user?.email || !db) return;

        // Check online status
        if (typeof window !== "undefined" && !navigator.onLine) {
            setOfflineMsg(true);
            return;
        }

        setLoading(true);
        try {
            await setDoc(doc(db, "profiles", profile.email), profile);
            setMessage(true);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const socialFields = [
        {
            name: "linkedin",
            placeholder: "linkedin.com/in/username",
        },
        {
            name: "twitter",
            placeholder: "twitter.com/username",
        },
        {
            name: "tiktok",
            placeholder: "tiktok.com/@username",
        },
        {
            name: "instagram",
            placeholder: "instagram.com/username",
        },
    ];

    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">
                    Loading...
                </span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 my-12 md:border-2 rounded-3xl shadow-3xl text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please log in to edit your profile.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => router.push("/signup")}
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => router.push("/login")}
                        className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {message && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                    ✅ Profile saved successfully!
                </div>
            )}
            {offlineMsg && (
                <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                    ⚠️ Please go online to update your profile.
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 my-12 border dark:border-gray-700 rounded-3xl shadow-3xl space-y-6"
            >
                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                    <div className="relative w-28 h-28 rounded-full border">
                        <Image
                            src={profile.photoURL || "/default-avatar.webp"}
                            alt="Profile"
                            width={112}
                            height={112}
                            quality={100}
                            className="object-center w-full h-full rounded-full"
                        />
                        <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                        >
                            📷
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                            Profile Photo
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            Upload a clear photo for your business card.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                        [
                            "displayName",
                            "username",
                            "company",
                            "role",
                        ] as (keyof ProfileData)[]
                    ).map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-black dark:text-white capitalize">
                                {field}
                            </label>
                            <input
                                type="text"
                                name={field}
                                value={(profile[field] as string) ?? ""}
                                onChange={handleChange}
                                className="w-full border rounded p-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-4 border rounded-lg p-4 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Contact Information
                    </h4>
                    <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <input
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        placeholder="+234 812 345 6789"
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                </div>

                <div className="space-y-4 border rounded-lg p-4 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Social Media Links
                    </h4>
                    {socialFields.map(({ name, placeholder }) => (
                        <div key={name} className="flex items-center gap-2">
                            <input
                                name={name}
                                value={
                                    profile.links[
                                        name as keyof ProfileData["links"]
                                    ] || ""
                                }
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded text-white transition-colors cursor-pointer ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            await signOut(auth);
                            router.push("/");
                        }}
                        className="px-6 py-3 rounded text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </form>
        </div>
    );
}
