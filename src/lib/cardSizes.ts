export const CARD_SIZES = {
    small: {
        width: 300,
        height: 187,
        avatar: 40,
        qrSize: 100,
        text: {
            name: "text-sm",
            meta: "text-xs",
            contact: "text-xs",
            label: "text-[10px]",
        },
        padding: {
            card: "p-3",
            section: "px-3 py-1",
        },
        spacing: {
            gap: "gap-1",
            socials: "gap-1 mt-1",
        },
        icons: {
            main: 12,
            social: 14,
            socialPadding: "p-1",
        },
    },
    medium: {
        width: 450,
        height: 280,
        avatar: 56,
        qrSize: 140,
        text: {
            name: "text-base",
            meta: "text-sm",
            contact: "text-sm",
            label: "text-xs",
        },
        padding: {
            card: "p-4",
            section: "px-4 py-2",
        },
        spacing: {
            gap: "gap-2",
            socials: "gap-2 mt-1",
        },
        icons: {
            main: 16,
            social: 20,
            socialPadding: "p-2",
        },
    },
    large: {
        width: 600,
        height: 375,
        avatar: 72,
        qrSize: 180,
        text: {
            name: "text-lg",
            meta: "text-base",
            contact: "text-base",
            label: "text-sm",
        },
        padding: {
            card: "p-6",
            section: "px-6 py-3",
        },
        spacing: {
            gap: "gap-3",
            socials: "gap-3 mt-2",
        },
        icons: {
            main: 20,
            social: 24,
            socialPadding: "p-3",
        },
    },
};

export type CardSize = keyof typeof CARD_SIZES;
