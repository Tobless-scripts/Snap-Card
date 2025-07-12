"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import PasswordInput from "@/components/AuthSection/PasswordInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            router.push("/dashboard");
        } catch (err: unknown) {
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
                } else {
                    setError("Something went wrong. Please try again.");
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 transition-colors">
            <form
                onSubmit={handleLogin}
                className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded shadow"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Log In to SnapCard
                </h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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

                <div className="flex justify-between items-center my-4">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-blue-500"
                    >
                        Forgot password?
                    </Link>
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
                    {loading ? "Logging in..." : "Login in"}
                </button>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
