"use client";

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    Camera,
    CameraOff,
    Loader2,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { saveScannedContact } from "@/lib/saveContact";
import Link from "next/link";

interface CameraDevice {
    id: string;
    label: string;
}

export default function QRCodeScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const qrRegionId = "qr-reader";
    const scannerContainerRef = useRef<HTMLDivElement>(null);

    // Check auth state on component mount
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const config = useMemo<Html5QrcodeCameraScanConfig>(
        () => ({
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false,
            videoConstraints: {
                facingMode: "environment",
            },
        }),
        []
    );

    const initializeCameras = useCallback(async () => {
        try {
            setIsLoading(true);
            const devices = await Html5Qrcode.getCameras();
            const formatted: CameraDevice[] = devices.map((device) => ({
                id: device.id,
                label: device.label,
            }));
            setCameras(formatted);

            if (formatted.length > 0) {
                const backCamera = formatted.find((device) =>
                    device.label.toLowerCase().includes("back")
                );
                setSelectedCameraId(
                    backCamera ? backCamera.id : formatted[0].id
                );
            }
        } catch (err) {
            setError(
                "Failed to access cameras. Please ensure camera permissions are granted."
            );
            console.error("Camera initialization error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const stopScanning = useCallback(async () => {
        if (html5QrCodeRef.current && isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                await html5QrCodeRef.current.clear();
                setIsScanning(false);
                setScannedData(null);
                setError(null);
            } catch (err) {
                console.error("Stop scanning error:", err);
                setError("Failed to stop scanning properly.");
            }
        }
    }, [isScanning]);

    const handleScannedData = useCallback(async (data: string) => {
        const isVCard =
            data.startsWith("BEGIN:VCARD") && data.includes("END:VCARD");

        if (isVCard) {
            // Create a Blob and Object URL for the vCard file
            const blob = new Blob([data], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);

            // Attempt to share the file (for mobile devices)
            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [
                        new File([blob], "contact.vcf", { type: "text/vcard" }),
                    ],
                })
            ) {
                try {
                    await navigator.share({
                        files: [
                            new File([blob], "contact.vcf", {
                                type: "text/vcard",
                            }),
                        ],
                        title: "Contact Card",
                        text: "Add this contact to your phone",
                    });
                    console.log("✅ Shared via navigator.share");
                } catch (error) {
                    console.warn(
                        "Sharing failed, falling back to download:",
                        error
                    );
                    // fallback to download
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "contact.vcf";
                    link.click();
                }
            } else {
                // fallback to download if Web Share API not available
                const link = document.createElement("a");
                link.href = url;
                link.download = "contact.vcf";
                link.click();
            }

            URL.revokeObjectURL(url);

            // Optionally save to Firestore if user is logged in
            const auth = getAuth();
            if (auth.currentUser) {
                const nameMatch = data.match(/FN:(.*)/);
                const emailMatch = data.match(/EMAIL:(.*)/);
                const phoneMatch = data.match(/TEL.*:(.*)/);

                await saveScannedContact(auth.currentUser.uid, {
                    name: nameMatch?.[1] || "Unknown",
                    email: emailMatch?.[1] || "",
                    phone: phoneMatch?.[1] || "",
                    rawVCard: data,
                });
            }
        } else {
            setError("Invalid QR code. Expected a vCard format.");
            setScannedData(null);
            setIsScanning(false);
        }
    }, []);

    const startScanning = useCallback(async () => {
        if (!selectedCameraId) return;

        try {
            setIsLoading(true);
            setError(null);

            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
            }

            await html5QrCodeRef.current.start(
                { deviceId: { exact: selectedCameraId } },
                config,
                async (decodedText: string) => {
                    console.log("✅ QR Code Scanned:", decodedText);
                    await stopScanning();
                    handleScannedData(decodedText);
                },
                (scanError: string) => {
                    if (!scanError.includes("No MultiFormat Readers")) {
                        console.warn("QR scan error:", scanError);
                    }
                }
            );

            setIsScanning(true);
        } catch (err) {
            setError(
                "Failed to start camera. Please check permissions and try again."
            );
            console.error("Start scanning error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCameraId, stopScanning, config, handleScannedData]);

    const resetScanner = useCallback(() => {
        setScannedData(null);
        setError(null);
        setIsScanning(false);
    }, []);

    useEffect(() => {
        const updateVideoStyle = () => {
            if (isScanning && scannerContainerRef.current) {
                const videoElement =
                    scannerContainerRef.current.querySelector("video");
                if (videoElement) {
                    videoElement.style.objectFit = "cover";
                }
            }
        };

        updateVideoStyle();
        window.addEventListener("resize", updateVideoStyle);

        return () => {
            window.removeEventListener("resize", updateVideoStyle);
        };
    }, [isScanning]);

    useEffect(() => {
        if (!authLoading) {
            initializeCameras();
        }
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current
                    .stop()
                    .then(() => html5QrCodeRef.current?.clear())
                    .catch(console.error);
            }
        };
    }, [authLoading, initializeCameras]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
                {!user && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <p className="text-yellow-700 dark:text-yellow-300 text-center">
                            For full functionality, please{" "}
                            <Link
                                href="/login"
                                className="font-semibold underline"
                            >
                                log in
                            </Link>{" "}
                            or{" "}
                            <Link
                                href="/register"
                                className="font-semibold underline"
                            >
                                create an account
                            </Link>{" "}
                            to save your scanned contacts.
                        </p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10">
                    <div
                        ref={scannerContainerRef}
                        className="relative mb-6 aspect-square max-w-full mx-auto"
                        style={{ width: "min(100%, 500px)" }}
                    >
                        <div
                            id={qrRegionId}
                            className={`w-full h-full rounded-xl shadow-lg border-2 ${
                                isScanning
                                    ? "border-blue-500 dark:border-blue-400"
                                    : "border-gray-300 dark:border-gray-600"
                            } bg-white dark:bg-gray-800`}
                        />
                        {!isScanning && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-90 rounded-xl">
                                <div className="text-center p-4">
                                    <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                        {cameras.length === 0
                                            ? "No cameras available"
                                            : "Ready to scan QR codes"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
                        {!isScanning ? (
                            <button
                                onClick={startScanning}
                                disabled={isLoading || cameras.length === 0}
                                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium cursor-pointer text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                                <span>
                                    {isLoading
                                        ? "Starting..."
                                        : "Start Scanning"}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={stopScanning}
                                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium cursor-pointer text-sm sm:text-base"
                            >
                                <CameraOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Stop Scanning</span>
                            </button>
                        )}

                        {(error || scannedData) && (
                            <button
                                onClick={resetScanner}
                                className="px-4 sm:px-5 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-sm sm:text-base"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                            <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                                <p className="text-red-700 dark:text-red-300 font-medium text-sm sm:text-base">
                                    Error
                                </p>
                            </div>
                            <p className="text-red-600 dark:text-red-400 mt-1 text-sm sm:text-base">
                                {error}
                            </p>
                        </div>
                    )}

                    {scannedData && (
                        <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center mb-2">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
                                <p className="text-green-700 dark:text-green-300 font-medium text-sm sm:text-base">
                                    QR Code Detected
                                </p>
                            </div>
                            <p className="text-green-600 dark:text-green-400 break-all mb-1 text-xs sm:text-sm">
                                vCard scanned successfully. Check your
                                phone&apos;s contact app.
                            </p>
                            {user && (
                                <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm mt-2">
                                    Contact has been saved to your account.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-sm sm:text-base">
                            Instructions:
                        </h3>
                        <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-400 space-y-1">
                            <li>
                                • Position the QR code within the scanning area
                            </li>
                            <li>• Ensure good lighting for best results</li>
                            <li>• Hold steady until the code is detected</li>
                            <li>• Only vCard QR codes are supported</li>
                            {!user && (
                                <li className="font-semibold">
                                    • Login to save scanned contacts to your
                                    account
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
