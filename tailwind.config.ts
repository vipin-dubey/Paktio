import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F9F9F8", // Paper White
                foreground: "#121212", // Charcoal Ink
                primary: {
                    DEFAULT: "#8DA399", // Paktio Sage
                    foreground: "#F9F9F8",
                },
                muted: {
                    DEFAULT: "#E5E5E3",
                    foreground: "#737373",
                },
            },
            borderRadius: {
                lg: "16px", // Squircle-like
                md: "12px",
                sm: "8px",
            },
        },
    },
    plugins: [],
};
export default config;
