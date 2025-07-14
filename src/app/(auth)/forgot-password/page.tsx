"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        const actionCodeSettings = {
            url: "https://snap-card-one.vercel.app/forgot-password", // Custom reset page
            handleCodeInApp: true,
        };

        try {
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err: unknown) {
            if (err instanceof Error) {
                const message = err.message;

                if (message.includes("auth/email-already-in-use")) {
                    setError("This email is already in use. Try logging in.");
                } else if (message.includes("auth/invalid-email")) {
                    setError("Invalid email address.");
                } else if (message.includes("auth/user-not-found")) {
                    setError("No user found with that email.");
                } else if (message.includes("auth/network-request-failed")) {
                    setError("Network error. Check your connection.");
                } else if (message.includes("auth/operation-not-allowed")) {
                    setError("Password reset is currently disabled.");
                } else {
                    setError(
                        "Failed to send reset email. Check the email address."
                    );
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 transition-colors">
            <form
                onSubmit={handleReset}
                className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Forgot Password
                </h1>

                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded border dark:bg-gray-900 dark:text-white"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded text-white transition-colors cursor-pointer ${
                        loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    <Link href="/login" className="text-blue-500">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
