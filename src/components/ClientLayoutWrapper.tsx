"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavFooterSection/Navbar";
import Footer from "@/components/NavFooterSection/Footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(
        pathname
    );

    return (
        <>
            {!isAuthRoute && <Navbar />}
            {children}
            {!isAuthRoute && <Footer />}
        </>
    );
}
