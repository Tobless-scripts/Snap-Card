import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";
import ServiceWorkerRegister from "./sw-register";
import type { Metadata, Viewport } from "next";
import AppInstallPrompt from "@/components/Install/AppInstallationPrompt";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NODE_ENV === "production"
            ? "https://snap-card-one.vercel.app"
            : "http://localhost:3000"
    ),
    title: "SnapCard – Smart Digital Contact Hub",
    description:
        "Create, share, and manage your digital business card with SnapCard.",
    keywords: [
        "SnapCard",
        "Digital Business Card",
        "Contact Hub",
        "vCard",
        "PWA",
    ],
    authors: [
        { name: "Obayomi Taofeek", url: "https://snap-card-one.vercel.app/" },
    ],
    openGraph: {
        title: "SnapCard – Smart Digital Contact Hub",
        description:
            "Create, share, and manage your digital business card with SnapCard.",
        url: "https://snap-card-one.vercel.app/",
        siteName: "SnapCard",
        images: [
            {
                url: "/ogImage.webp",
                width: 1200,
                height: 630,
                alt: "SnapCard – Smart Digital Contact Hub",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SnapCard – Smart Digital Contact Hub",
        description:
            "Create, share, and manage your digital business card with SnapCard.",
        images: ["/ogImage.webp"],
        creator: "@ObayomiTaofeek",
    },
    icons: {
        icon: "/mobile.webp",
        apple: "/mobile.webp",
    },
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#ffffff",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* PWA + SEO essentials */}
                <meta charSet="UTF-8" />
                {/* Next.js will inject viewport and theme-color meta tags */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content="SnapCard" />

                {/* Favicon / Icons */}
                <link rel="icon" href="/mobile.webp" />
                <link rel="apple-touch-icon" href="/mobile.webp" />

                {/* Manifest */}
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <ClerkProvider>
                    <AppInstallPrompt />
                    <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
                    <Analytics />
                    <ServiceWorkerRegister />
                </ClerkProvider>
            </body>
        </html>
    );
}
