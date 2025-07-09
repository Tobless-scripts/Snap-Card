interface VCardProps {
    displayName: string;
    email: string;
    phone?: string;
    company?: string;
    role?: string;
    links?: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        tiktok?: string;
    };
}

export async function shareVCard(data: VCardProps) {
    const vcardData = `
BEGIN:VCARD
VERSION:3.0
FN:${data.displayName}
ORG:${data.company || ""}
TITLE:${data.role || ""}
TEL;TYPE=CELL:${data.phone || ""}
EMAIL:${data.email}
${data.links?.linkedin ? `URL;TYPE=LinkedIn:${data.links.linkedin}` : ""}
${data.links?.twitter ? `URL;TYPE=Twitter:${data.links.twitter}` : ""}
${data.links?.instagram ? `URL;TYPE=Instagram:${data.links.instagram}` : ""}
${data.links?.tiktok ? `URL;TYPE=TikTok:${data.links.tiktok}` : ""}
END:VCARD
`.trim();

    const blob = new Blob([vcardData], { type: "text/vcard" });
    const file = new File([blob], "contact.vcf", { type: "text/vcard" });

    if (navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({
                title: `${data.displayName} - Snap Card Contact`,
                text: "Here’s a contact card.",
                files: [file],
            });
        } catch (error) {
            console.error("Error sharing vCard:", error);
            throw error;
        }
    } else {
        throw new Error("Sharing is not supported on this device.");
    }
}
