"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        const registerSW = async () => {
            console.log("=== SW Registration Debug ===");
            console.log("1. Window defined:", typeof window !== "undefined");
            console.log("2. SW supported:", "serviceWorker" in navigator);
            console.log("3. Environment:", process.env.NODE_ENV);

            if (typeof window !== "undefined" && "serviceWorker" in navigator) {
                try {
                    // Check if SW file exists
                    console.log("4. Checking if SW file exists...");
                    const swResponse = await fetch("/sw.js");
                    console.log(
                        "5. SW file response:",
                        swResponse.status,
                        swResponse.statusText
                    );

                    if (!swResponse.ok) {
                        throw new Error(
                            `SW file not found: ${swResponse.status}`
                        );
                    }

                    // Check current registrations
                    const existingRegistrations =
                        await navigator.serviceWorker.getRegistrations();
                    console.log(
                        "6. Existing registrations:",
                        existingRegistrations.length
                    );

                    // Try to register
                    console.log("7. Attempting registration...");
                    const registration = await navigator.serviceWorker.register(
                        "/sw.js",
                        {
                            scope: "/",
                        }
                    );

                    console.log("8. Registration successful:", registration);
                    console.log("9. Registration scope:", registration.scope);
                    console.log(
                        "10. Registration state:",
                        registration.installing
                            ? "installing"
                            : registration.waiting
                            ? "waiting"
                            : registration.active
                            ? "active"
                            : "unknown"
                    );

                    if (registration.active) {
                        console.log(
                            "11. SW is active:",
                            registration.active.scriptURL
                        );
                    }

                    // Listen for updates
                    registration.addEventListener("updatefound", () => {
                        console.log("SW update found");
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                console.log(
                                    "SW state changed:",
                                    newWorker.state
                                );
                            });
                        }
                    });

                    // Check if SW is controlling the page
                    if (navigator.serviceWorker.controller) {
                        console.log("12. SW is controlling this page");
                    } else {
                        console.log("12. SW is NOT controlling this page yet");
                    }
                } catch {
                    console.error("SW registration failed:");
                }
            } else {
                console.log("SW registration skipped - requirements not met");
            }
        };

        registerSW();
    }, []);

    return null;
}
