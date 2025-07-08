import QRCodeScanner from "@/components/scan/QRCodeScanner";

export const metadata = {
    title: "Snap & Scan | Snap Card",
};

export default function Scan() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 px-4 py-20 transition-colors duration-300">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-white mb-4">
                    Scan a SnapCard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-10">
                    Point your camera at a QR code to instantly view or save the
                    contact.
                </p>
            </div>

            <QRCodeScanner />
        </main>
    );
}
