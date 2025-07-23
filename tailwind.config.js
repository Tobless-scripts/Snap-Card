module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                mdx: "768px",
            },
        },
        // Force legacy color format: only use hex/rgb/hsl colors (not oklch)
        colors: {
            white: "#fff",
            black: "#000",
            // Add more colors as needed, use hex/rgb/hsl, NOT oklch
            // You may add your brand colors here as well
        },
    },
    safelist: [],
    corePlugins: {},
    experimental: {
        disableColorPalette: false,
        cssVariables: false,
    },
    plugins: [],
};
