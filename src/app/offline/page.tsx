"use client";

import Link from "next/link";

export default function OfflinePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
            <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    You&apos;re Offline
                </h1>
                <p className="text-gray-600 mb-6">
                    It looks like you&apos;ve lost your internet connection.
                    Some content may still be available while offline.
                </p>
                <div className="flex flex-col space-y-3">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                        prefetch={false}
                    >
                        Try to Reconnect
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </main>
    );
}
