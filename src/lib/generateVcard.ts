export interface ProfileData {
    displayName: string;
    email: string;
    phone?: string;
    avatar: string;
    name: string;
    title: string;
    company: string;
    role: string;
    photoURL: string;
    links?: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        tiktok?: string;
    };
}

export function generateVCard(profile: ProfileData): string {
    // Helper function to format URLs properly
    const formatUrl = (url: string | undefined, type: string): string => {
        if (!url) return "";

        // Add https:// if missing
        let formattedUrl = url;
        if (
            !formattedUrl.startsWith("http://") &&
            !formattedUrl.startsWith("https://")
        ) {
            formattedUrl = `https://${formattedUrl}`;
        }

        return `URL;TYPE=${type}:${formattedUrl}`;
    };

    // Build social media links section
    const socialLinks = [
        profile.links?.linkedin
            ? formatUrl(profile.links.linkedin, "LinkedIn")
            : "",
        profile.links?.twitter
            ? formatUrl(profile.links.twitter, "Twitter")
            : "",
        profile.links?.instagram
            ? formatUrl(profile.links.instagram, "Instagram")
            : "",
        profile.links?.tiktok ? formatUrl(profile.links.tiktok, "TikTok") : "",
    ]
        .filter(Boolean)
        .join("\n");

    // Build the vCard
    return `
BEGIN:VCARD
VERSION:3.0
FN:${profile.displayName}
N:${profile.name || profile.displayName.split(" ").reverse().join(";")}
ORG:${profile.company || ""}
TITLE:${profile.role || ""}
TEL;TYPE=CELL,VOICE:${profile.phone || ""}
EMAIL;TYPE=WORK,INTERNET:${profile.email}
${socialLinks}
REV:${new Date().toISOString()}
END:VCARD
`.trim();
}
