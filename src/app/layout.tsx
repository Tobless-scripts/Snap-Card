// app/layout.tsx
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Snap Card",
    description: "Digital business cards",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </body>
        </html>
    );
}
