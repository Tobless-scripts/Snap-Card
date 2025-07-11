import type { NextConfig } from "next";
import withPWA from "next-pwa";

/**
 * Base Next.js config
 */
const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: { resolveAlias: {} },
};

/**
 * PWA config
 */
const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,

    // Offline support
    additionalManifestEntries: [{ url: "/offline", revision: null }],
    fallbacks: {
        document: "/offline",
    },

    disable: process.env.NODE_ENV === "development",
    dynamicStartUrl: false,

    buildExcludes: [/middleware-manifest\.json$/],
    exclude: [/^.*\/_next\/static\/.*\.map$/, /^.*\/_next\/server\/.*/],

    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                },
            },
        },
        {
            urlPattern: /^\/_next\/static\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "static-resources",
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30,
                },
            },
        },
        {
            urlPattern: /^\/$/i,
            handler: "NetworkFirst",
            options: {
                cacheName: "start-url",
                expiration: {
                    maxEntries: 1,
                    maxAgeSeconds: 60 * 60 * 24,
                },
            },
        },
        {
            urlPattern: /^\/offline$/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "offline-page",
            },
        },
    ],
};

export default withPWA(pwaConfig)(nextConfig);
