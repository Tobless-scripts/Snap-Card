"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

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
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);

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

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    // Fetch profile when user is available
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.email || authLoading) return;

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
                    // No profile exists, initialize with user data
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

    // Auto-hide message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

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
        if (!user?.email) return;

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
            svg: (
                <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-blue-700"
                    viewBox="0 0 24 24"
                >
                    <path d="M4.98 3.5c0 1.381-1.12 2.5-2.5 2.5S0 4.881 0 3.5 1.119 1 2.48 1c1.38 0 2.5 1.119 2.5 2.5zM.5 24V7.999h4.981V24H.5zm7.982 0V7.999h4.776v2.182h.069c.665-1.267 2.292-2.605 4.717-2.605 5.042 0 5.973 3.319 5.973 7.633V24h-4.981v-7.335c0-1.751-.031-4.003-2.438-4.003-2.438 0-2.812 1.898-2.812 3.868V24H8.482z" />
                </svg>
            ),
        },
        {
            name: "twitter",
            placeholder: "twitter.com/username",
            svg: (
                <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-blue-500"
                    viewBox="0 0 24 24"
                >
                    <path d="M24 4.56a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.15a4.922 4.922 0 001.524 6.573 4.903 4.903 0 01-2.229-.616v.06a4.922 4.922 0 003.946 4.827 4.934 4.934 0 01-2.224.084 4.928 4.928 0 004.6 3.417A9.868 9.868 0 010 19.54a13.94 13.94 0 007.548 2.212c9.056 0 14-7.496 14-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.56z" />
                </svg>
            ),
        },
        {
            name: "tiktok",
            placeholder: "tiktok.com/@username",
            svg: (
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 256 256"
                    className="text-black dark:text-white"
                    fill="currentColor"
                >
                    <path d="M232 72.3a75.6 75.6 0 01-44-13.4v83.1a68 68 0 11-68-68 67.1 67.1 0 0115.1 1.7v26.2a40.2 40.2 0 00-15.1-3 40 40 0 1040 40V24h24a51.7 51.7 0 0048 32.3z" />
                </svg>
            ),
        },
        {
            name: "instagram",
            placeholder: "instagram.com/username",
            svg: (
                <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-pink-500"
                    viewBox="0 0 24 24"
                >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.5-.75a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                </svg>
            ),
        },
    ];

    // Show loading state while auth is being restored
    if (authLoading) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 my-12 md:border-2 rounded-3xl shadow-3xl">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    // Show message if user is not authenticated
    if (!user) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 my-12 md:border-2 rounded-3xl shadow-3xl">
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-300">
                        Please log in to edit your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Success Message */}
            {message && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Profile saved successfully!
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 my-12 dark:md:border-2 rounded-3xl shadow-3xl space-y-6"
            >
                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                    <div className="relative w-26 md:w-36 h-26 md:h-36 rounded-full">
                        <Image
                            src={profile.photoURL || "/default-avatar.webp"}
                            alt="Profile"
                            width={1200}
                            height={100}
                            quality={100}
                            priority
                            className="w-full h-full rounded-full object-top border"
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
                            Upload a clear photo of yourself for your digital
                            business card.
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
                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <input
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                </div>

                <div className="space-y-4 border rounded-lg p-4 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Social Media
                    </h4>
                    {socialFields.map(({ name, placeholder, svg }) => (
                        <div
                            key={name}
                            className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border rounded"
                        >
                            <span>{svg}</span>
                            <input
                                name={name}
                                value={
                                    profile.links[
                                        name as keyof ProfileData["links"]
                                    ] || ""
                                }
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="flex-1 bg-transparent outline-none dark:text-white"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
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
                </div>
            </form>
        </div>
    );
}
