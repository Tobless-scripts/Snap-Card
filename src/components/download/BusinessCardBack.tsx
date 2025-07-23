"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CARD_SIZES, CardSize } from "@/lib/cardSizes";
import { ProfileData } from "@/lib/generateVcard";

export default function CardBack({
    qrImage,
    profile,
    theme = "light",
    size: propSize,
}: {
    qrImage: string;
    profile: ProfileData;
    theme?: "light" | "dark";
    size?: CardSize;
}) {
    const [size, setSize] = useState<CardSize>("small");

    useEffect(() => {
        if (propSize) {
            setSize(propSize);
            return;
        }

        const updateSize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setSize("small");
            } else if (width < 1024) {
                setSize("medium");
            } else {
                setSize("large");
            }
        };

        updateSize(); // initial call
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [propSize]);

    const config = CARD_SIZES[size];

    return (
        <div
            className={clsx(
                "aspect-[1.6] rounded-xl shadow-md border transition-all font-sans flex flex-col items-center justify-center",
                theme === "dark"
                    ? "bg-gray-900 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200",
                "w-full max-w-full",
                "sm:max-w-[300px] md:max-w-[450px] lg:max-w-[600px]"
            )}
            style={{
                width: config.width,
                height: config.height,
                minWidth: 280,
            }}
        >
            <p className={clsx("mb-2 text-center", config.text.label)}>
                Scan to connect
            </p>
            {qrImage ? (
                <Image
                    src={qrImage}
                    alt="QR Code"
                    width={config.qrSize}
                    height={config.qrSize}
                    className="object-contain"
                    style={{
                        minWidth: config.qrSize,
                        minHeight: config.qrSize,
                    }}
                />
            ) : (
                <div
                    className="bg-gray-200 rounded"
                    style={{
                        width: config.qrSize,
                        height: config.qrSize,
                    }}
                />
            )}
            <p
                className={clsx(
                    "mt-2 text-center font-medium",
                    config.text.name,
                    theme === "dark" ? "text-white" : "text-black"
                )}
            >
                {profile.displayName}
            </p>
            <p
                className={clsx(
                    "text-center",
                    config.text.meta,
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                )}
            >
                {profile.company}
            </p>
        </div>
    );
}
