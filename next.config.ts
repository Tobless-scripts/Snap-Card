import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    turbopack: {
        resolveAlias: {},
    },
};

const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    dynamicStartUrl: process.env.NODE_ENV !== "development",
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,
    additionalManifestEntries: [{ url: "/offline", revision: null }],
    exclude: [
        /middleware-manifest\.json$/,
        /_buildManifest\.js$/,
        /_ssgManifest\.js$/,
        /^.*\/_next\/static\/.*\.map$/,
        /^.*\/_next\/server\/.*/, // avoid broken internal routes
    ],
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
