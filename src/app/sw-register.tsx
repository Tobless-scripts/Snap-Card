"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            process.env.NODE_ENV === "production"
        ) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("SW registered: ", registration);

                    // Check for updates
                    registration.addEventListener("updatefound", () => {
                        console.log("SW update found");
                    });
                })
                .catch((registrationError) => {
                    console.log("SW registration failed: ", registrationError);
                });

            // Check if there's an existing service worker
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                console.log("Current SW registrations:", registrations);
            });
        }
    }, []);

    return null; // This component doesn't render anything
}
