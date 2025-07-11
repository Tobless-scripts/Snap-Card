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
    disable: false,
    dynamicStartUrl: true,
    cacheOnFrontEndNav: true,
    reloadOnOnline: true,
    additionalManifestEntries: [
        { url: "/offline", revision: Date.now().toString() },
        { url: "/", revision: Date.now().toString() },
    ],
    exclude: [
        /middleware-manifest\.json$/,
        /_buildManifest\.js$/,
        /_ssgManifest\.js$/,
        /^.*\/_next\/static\/.*\.map$/,
    ],
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
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
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
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
                    maxAgeSeconds: 60 * 60 * 24, // 1 day
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

if (process.env.NODE_ENV === "development") {
    pwaConfig.dynamicStartUrl = false;
    if (!globalThis.__pwa_init) {
        console.log("PWA is running in development mode");
        globalThis.__pwa_init = true;
    }
}

export default withPWA(pwaConfig)(nextConfig);
