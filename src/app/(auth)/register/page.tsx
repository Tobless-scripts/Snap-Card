"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/AuthSection/PasswordInput";

function encodeEmail(email: string) {
    return email.replace(/\./g, "(dot)").replace(/@/g, "(at)");
}

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [strength, setStrength] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "password") {
            let score = 0;
            if (value.length >= 8) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;
            if (/[@\-_=!$%&*#^+]/.test(value)) score++;
            setStrength(score);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (form.password !== form.confirmPassword) {
            setLoading(false);
            return setError("Passwords do not match");
        }

        const nameRegex = /^[a-zA-Z\s]{2,30}$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@\-_=!$%&*#^+]).{8,}$/;

        if (!nameRegex.test(form.name)) {
            setLoading(false);
            return setError(
                "Name should be 2–30 letters (you may include spaces, hyphens, or ’)."
            );
        }

        if (!usernameRegex.test(form.username)) {
            setLoading(false);
            return setError(
                "Username must be 3–20 characters, letters/numbers/underscore only, no trailing underscore."
            );
        }

        if (!emailRegex.test(form.email)) {
            setLoading(false);
            return setError("Please enter a valid e‑mail address.");
        }

        if (!passwordRegex.test(form.password)) {
            setLoading(false);
            return setError(
                "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
            );
        }

        const encodedEmail = encodeEmail(form.email);

        try {
            // Check for username existence
            const usernameDoc = await getDoc(doc(db, "users", form.username));
            if (usernameDoc.exists()) {
                setLoading(false);
                return setError("Username already taken");
            }

            // Check for email existence
            const emailDoc = await getDoc(doc(db, "emails", encodedEmail));
            if (emailDoc.exists()) {
                setLoading(false);
                return setError("Email already in use");
            }

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            await updateProfile(userCredential.user, {
                displayName: form.name,
            });

            // Store user info in Firestore
            await setDoc(doc(db, "users", form.username), {
                uid: userCredential.user.uid,
                name: form.name,
                email: form.email,
            });

            // Store email mapping in Firestore
            await setDoc(doc(db, "emails", encodedEmail), {
                uid: userCredential.user.uid,
            });

            router.push("/dashboard");
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof Error) {
                const message = err.message;
                if (message.includes("auth/email-already-in-use")) {
                    setError("This email is already in use. Try logging in.");
                } else if (message.includes("auth/invalid-email")) {
                    setError("Invalid email address.");
                } else if (message.includes("auth/weak-password")) {
                    setError("Password is too weak.");
                } else if (message.includes("auth/network-request-failed")) {
                    setError("Network error. Check your connection.");
                } else if (message.includes("auth/operation-not-allowed")) {
                    setError("Sign up is disabled. Try again later.");
                } else if (message.includes("permission-denied")) {
                    setError("Permission denied. Please contact support.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 transition-colors">
            <form
                onSubmit={handleSubmit}
                className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Create your account
                </h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-3 rounded border dark:bg-gray-900 dark:text-white"
                    required
                />
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-3 rounded border dark:bg-gray-900 dark:text-white"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-3 rounded border dark:bg-gray-900 dark:text-white"
                    required
                />

                <PasswordInput
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    action={handleChange}
                />
                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    action={handleChange}
                />

                <div className="w-full h-2 bg-gray-300 rounded my-4">
                    <div
                        className={`h-2 rounded ${
                            strength === 1
                                ? "bg-red-500 w-1/4"
                                : strength === 3
                                ? "bg-yellow-500 w-1/2"
                                : strength >= 4
                                ? "bg-green-500 w-full"
                                : ""
                        }`}
                    ></div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded text-white transition-colors cursor-pointer ${
                        loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
