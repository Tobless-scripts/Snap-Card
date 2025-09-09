export const CARD_SIZES = {
    extraSmall: {
        width: 260,
        height: 320,
        avatar: 25,
        qrSize: 80,
        text: {
            name: "text-sm",
            meta: "text-xs",
            contact: "text-xs",
            label: "text-[7px]",
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

    small: {
        width: 358,
        height: 250,
        avatar: 70,
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
        width: 680,
        height: 300,
        avatar: 85,
        qrSize: 150,
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
        width: 650,
        height: 370,
        avatar: 94,
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
