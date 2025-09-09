"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Linkedin,
    Twitter,
    Instagram,
    Music2 as Music,
    Mail,
    Phone,
    Edit3,
    Briefcase,
} from "lucide-react";
import clsx from "clsx";
import { CARD_SIZES, CardSize } from "@/lib/cardSizes";
import { ProfileData } from "@/lib/generateVcard";

function extractUsername(link?: string) {
    if (!link) return "";
    try {
        const url = new URL(link.startsWith("http") ? link : "https://" + link);
        const name = url.pathname.split("/").filter(Boolean).pop() || "";
        if (name.startsWith("@")) return name;
        return "@" + name;
    } catch {
        return "@" + (link.split("/").filter(Boolean).pop() || "");
    }
}

export default function BusinessCardFront({
    profile,
    size: forceSize,
    theme = "light",
    showEdit = false,
}: {
    profile: ProfileData;
    size?: CardSize;
    theme?: "light" | "dark";
    showEdit?: boolean;
}) {
    const [size, setSize] = useState<CardSize>("small");

    useEffect(() => {
        if (forceSize) {
            setSize(forceSize);
            return;
        }

        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 359) {
                setSize("extraSmall");
            } else if (width < 640) {
                setSize("small");
            } else if (width < 768) {
                setSize("medium");
            } else {
                setSize("large");
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [forceSize]);

    const config = CARD_SIZES[size];

    return (
        <div
            className={clsx(
                "aspect-[1.6] rounded-xl shadow-md border transition-all font-sans flex flex-col overflow-hidden",
                theme === "dark"
                    ? "bg-gradient-to-br from-[#101624] to-[#192335] text-white border-[#232f49]"
                    : "bg-gradient-to-br from-[#f7faff] to-[#eaeef6] text-gray-900 border-[#e1e6ef]",
                "w-full max-w-full",
                "sm:max-w-[570px] md:max-w-[590px] lg:max-w-[610px]"
            )}
            style={{
                width: config.width,
                height: config.height,
                minWidth: 280,
            }}
        >
            {/* Header */}
            <div
                className={clsx(
                    "flex items-center w-full pt-2 pb-1",
                    config.padding.card
                )}
            >
                <div className="flex-shrink-0">
                    <Image
                        src={profile.photoURL || "/default-avatar.webp"}
                        alt="Profile"
                        width={config.avatar}
                        height={config.avatar}
                        className={clsx(
                            "rounded-xl object-cover object-top w-full border-4",
                            theme === "dark"
                                ? "border-[#232f49]"
                                : "border-[#e1e6ef]"
                        )}
                        style={{
                            minWidth: config.avatar,
                            minHeight: config.avatar,
                            maxWidth: config.avatar,
                            maxHeight: config.avatar,
                        }}
                    />
                </div>
                <div className="flex-1 ml-3 min-w-0 overflow-hidden">
                    <div
                        className={clsx(
                            "font-bold truncate text-sm md:text-base",
                            config.text.name
                        )}
                    >
                        {profile.displayName}
                    </div>
                    <div
                        className={clsx(
                            "flex items-center font-medium gap-1 truncate text-gray-400 dark:text-gray-400",
                            config.text.meta
                        )}
                    >
                        <Briefcase
                            size={config.icons.main - 4}
                            className="inline-block mr-1 flex-shrink-0"
                        />
                        <span className="truncate text-xs md:text-md">
                            {profile.role}
                        </span>
                        {profile.company && (
                            <span
                                className={clsx(
                                    theme === "dark"
                                        ? "text-blue-400"
                                        : "text-blue-600",
                                    "ml-1 truncate text-xs md:text-md"
                                )}
                            >
                                at {profile.company}
                            </span>
                        )}
                    </div>
                </div>
                {showEdit && (
                    <button
                        className="ml-auto rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center cursor-pointer hover:bg-black/20 dark:hover:bg-white/20"
                        style={{
                            width: config.avatar * 0.5,
                            height: config.avatar * 0.5,
                        }}
                        aria-label="Edit profile"
                    >
                        <Edit3 size={config.icons.main} />
                    </button>
                )}
            </div>

            {/* Contact Info */}
            <div
                className={clsx(
                    "flex-1 flex flex-col",
                    config.spacing.gap,
                    "px-4 mt-5"
                )}
            >
                {profile.email && (
                    <div
                        className={clsx(
                            "flex items-center rounded-xl",
                            theme === "dark" ? "bg-[#212d41]" : "bg-[#e4e8f0]",
                            config.padding.section
                        )}
                    >
                        <Mail
                            size={config.icons.main}
                            className={clsx(
                                theme === "dark"
                                    ? "text-blue-300"
                                    : "text-blue-700",
                                "mr-2 flex-shrink-0"
                            )}
                        />
                        <div className="flex flex-col min-w-0 truncate">
                            <span
                                className={clsx(
                                    config.text.label,
                                    "text-gray-400 mb-[-2px]"
                                )}
                            >
                                Email
                            </span>
                            <span
                                className={clsx(
                                    "font-semibold truncate",
                                    config.text.contact
                                )}
                            >
                                {profile.email}
                            </span>
                        </div>
                    </div>
                )}
                {profile.phone && (
                    <div
                        className={clsx(
                            "flex items-center rounded-xl",
                            theme === "dark" ? "bg-[#212d41]" : "bg-[#e4e8f0]",
                            config.padding.section
                        )}
                    >
                        <Phone
                            size={config.icons.main}
                            className={clsx(
                                theme === "dark"
                                    ? "text-green-300"
                                    : "text-green-700",
                                "mr-2 flex-shrink-0"
                            )}
                        />
                        <div className="flex flex-col min-w-0 truncate">
                            <span
                                className={clsx(
                                    config.text.label,
                                    "text-gray-400 mb-[-2px]"
                                )}
                            >
                                Phone
                            </span>
                            <span
                                className={clsx(
                                    "font-semibold truncate",
                                    config.text.contact
                                )}
                            >
                                {profile.phone}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Social Links */}
            {(profile.links?.linkedin ||
                profile.links?.twitter ||
                profile.links?.instagram ||
                profile.links?.tiktok) && (
                <div
                    className={clsx("px-4", size === "small" ? "pb-5" : "pb-2")}
                >
                    <div
                        className={clsx(
                            "font-bold mb-1",
                            config.text.label,
                            "text-gray-600 dark:text-white"
                        )}
                    >
                        Social Links
                    </div>
                    <div
                        className={clsx(
                            "flex flex-wrap",
                            config.spacing.socials
                        )}
                    >
                        {profile.links.linkedin && (
                            <a
                                href={
                                    profile.links.linkedin.startsWith("http")
                                        ? profile.links.linkedin
                                        : `https://${profile.links.linkedin}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    "flex items-center gap-1 font-medium transition-colors px-1.5 py-1 rounded-lg",
                                    theme === "dark"
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                    size === "small" ? "text-[7px]" : "text-xs"
                                )}
                            >
                                <Linkedin
                                    size={config.icons.social - 8}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="truncate">
                                    {extractUsername(profile.links.linkedin)}
                                </span>
                            </a>
                        )}
                        {profile.links.twitter && (
                            <a
                                href={
                                    profile.links.twitter.startsWith("http")
                                        ? profile.links.twitter
                                        : `https://${profile.links.twitter}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    "flex items-center gap-1 font-medium transition-colors px-1.5 py-1 rounded-lg",
                                    theme === "dark"
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                    size === "small" ? "text-[7px]" : "text-xs"
                                )}
                            >
                                <Twitter
                                    size={config.icons.social - 8}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="truncate">
                                    {extractUsername(profile.links.twitter)}
                                </span>
                            </a>
                        )}
                        {profile.links.instagram && (
                            <a
                                href={
                                    profile.links.instagram.startsWith("http")
                                        ? profile.links.instagram
                                        : `https://${profile.links.instagram}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    "flex items-center gap-1 font-medium transition-colors px-1.5 py-1 rounded-lg",
                                    theme === "dark"
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                    size === "small" ? "text-[7px]" : "text-xs"
                                )}
                            >
                                <Instagram
                                    size={config.icons.social - 8}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="truncate">
                                    {extractUsername(profile.links.instagram)}
                                </span>
                            </a>
                        )}
                        {profile.links.tiktok && (
                            <a
                                href={
                                    profile.links.tiktok.startsWith("http")
                                        ? profile.links.tiktok
                                        : `https://${profile.links.tiktok}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    "flex items-center gap-1 font-medium transition-colors px-1.5 py-1 rounded-lg",
                                    theme === "dark"
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                    size === "small" ? "text-[7px]" : "text-xs"
                                )}
                            >
                                <Music
                                    size={config.icons.social - 8}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span className="truncate">
                                    {extractUsername(profile.links.tiktok)}
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
