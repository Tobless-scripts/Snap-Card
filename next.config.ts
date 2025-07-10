import type { NextConfig } from "next";
import withPWA from "next-pwa";

/**
 * Next.js base configuration
 */
const nextConfig: NextConfig = {
    reactStrictMode: true,
};

/**
 * PWA Configuration
 */
const pwaConfig = {
    dest: "public",
    register: false, // We'll handle registration manually
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    dynamicStartUrl: false,
    exclude: [
        /^.*\/_next\/app-build-manifest\.json$/,
        /^.*\/_next\/build-manifest\.json$/,
        /^.*\/_next\/static\/.*\.map$/,
    ],
    runtimeCaching: [
        // Cache Google Fonts
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
            },
        },
        // Cache images
        {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp|ico)/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "images",
                expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
            },
        },
        // Cache Firebase Firestore requests
        {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
                cacheName: "firebase-firestore",
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
            },
        },
        // Cache HTML pages (App Router)
        {
            urlPattern: ({ request }: { request: Request }) =>
                request.destination === "document",
            handler: "NetworkFirst",
            options: {
                cacheName: "html-pages",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
            },
        },
        // Cache API routes
        {
            urlPattern: /^.*\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 5 * 60, // 5 minutes
                },
            },
        },
    ],
};

// Apply PWA wrapper
export default withPWA(pwaConfig)(nextConfig);
