import type { NextConfig } from "next";
import withPWA from "next-pwa";

/**
 * Next.js base configuration
 */
const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {
        resolveAlias: {
            "@components": "./src/components",
            "@utils": "./src/utils",
        },
    },
    // swcMinify is handled automatically in recent Next.js versions
};

/**
 * PWA Configuration (production-only)
 */
const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    dynamicStartUrl: false, // Prevent issues with dynamic routes and start URL
    exclude: [
        /^.*\/_next\/app-build-manifest\.json$/,
        /^.*\/_next\/build-manifest\.json$/,
        /^.*\/_next\/static\/.*\.map$/,
    ], // Exclude files that are not accessible in production
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
        // Cache HTML pages (SSR/SSG)
        {
            urlPattern: ({ request }: { request: Request }) =>
                request.destination === "document" ||
                request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
                cacheName: "html-pages",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
            },
        },
    ],
};

// Enable PWA only in production builds
export default process.env.NODE_ENV === "production"
    ? withPWA(pwaConfig)(nextConfig)
    : nextConfig;
