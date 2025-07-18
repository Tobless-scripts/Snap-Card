// tailwind.config.js
export const darkMode = "class";
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        screens: {
            mdx: "768px",
        },
    },
};
export const plugins = [];
