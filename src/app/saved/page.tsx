"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

interface ContactData {
    id: string;
    displayName: string;
    role?: string;
    company?: string;
    phone?: string;
    email: string;
    photoURL?: string;
}

export default function SavedContactsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<ContactData[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Listen for auth state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return unsubscribe;
    }, []);

    // Fetch contacts from both sources
    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            if (!user?.uid) {
                setContacts([]);
                setLoading(false);
                return;
            }
            try {
                // Fetch from both contact sources
                const [q1, q2] = [
                    query(
                        collection(db, "users", user.uid, "savedContacts"),
                        orderBy("displayName")
                    ),
                    query(
                        collection(db, "users", user.uid, "scanContacts"),
                        orderBy("displayName")
                    ),
                ];
                const [snap1, snap2] = await Promise.all([
                    getDocs(q1),
                    getDocs(q2),
                ]);
                const allContacts = [
                    ...snap1.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<ContactData, "id">),
                    })),
                    ...snap2.docs.map((doc) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<ContactData, "id">),
                    })),
                ];
                // Deduplicate by email (or id if email not present)
                const uniqueContacts = Array.from(
                    new Map(
                        allContacts.map((c) => [c.email || c.id, c])
                    ).values()
                );
                setContacts(uniqueContacts);
            } catch (error) {
                console.error("Failed to load contacts", error);
                setContacts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [user]);

    // Enhanced search: by name, email, or phone
    const filteredContacts = contacts.filter((c) => {
        const q = search.trim().toLowerCase();
        return (
            c.displayName?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q)
        );
    });

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    {user ? (
                        <div className="w-full flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white">
                                Hello, {user.displayName || user.email}
                            </span>
                            <div className="hidden md:flex space-x-4">
                                <Link
                                    href="/profile"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Profile
                                </Link>
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                                    onClick={async () => {
                                        const auth = getAuth();
                                        await auth.signOut();
                                    }}
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Log in to view contacts
                        </Link>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Saved Contacts
                </h1>

                <input
                    type="text"
                    placeholder="Search contacts by name, email, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />

                {loading ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading contacts...
                    </p>
                ) : !user ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        Please log in to view your saved contacts.
                    </p>
                ) : filteredContacts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        No saved contacts found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="p-5 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 shadow"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <Image
                                        src={
                                            contact.photoURL ||
                                            "/default-avatar.webp"
                                        }
                                        alt={contact.displayName}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            {contact.displayName}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            {contact.role || "—"} •{" "}
                                            {contact.company || "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <p>
                                        📞{" "}
                                        <span className="font-medium">
                                            {contact.phone || "N/A"}
                                        </span>
                                    </p>
                                    <p>
                                        📧{" "}
                                        <span className="font-medium">
                                            {contact.email}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
