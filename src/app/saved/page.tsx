"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

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

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?.uid) return;
            try {
                const q = query(
                    collection(db, "users", user.uid, "savedContacts"),
                    orderBy("displayName")
                );
                const snapshot = await getDocs(q);
                const data: ContactData[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<ContactData, "id">),
                }));
                setContacts(data);
            } catch (error) {
                console.error("Failed to load contacts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [user]);

    const filteredContacts = contacts.filter((c) =>
        c.displayName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Saved Contacts
                </h1>

                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-6 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />

                {loading ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading contacts...
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
                                            {contact.role} • {contact.company}
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
