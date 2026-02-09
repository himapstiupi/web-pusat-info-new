import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "primary-dark": "#0f4bc4",
        "background-light": "#f8f9fc",
        "background-dark": "#101622",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2230",
        "border-light": "#e7ebf3",
        "border-dark": "#2a3447",
        "text-main": "#0d121b",
        "text-sub": "#4c669a",
        "success": "#10b981",
        "warning": "#f59e0b",
        "danger": "#ef4444",
        "primary-purple": "#660fbd",
        "primary-purple-dark": "#500a96", // Darker shade for hover states
        "bg-super-light": "#f7f6f8",
        "bg-super-dark": "#191022",
        "surface-super-dark": "#231630",
        "border-super-dark": "#362348",
      },
      fontFamily: {
        "sans": ["var(--font-jakarta)", "system-ui", "sans-serif"],
        "display": ["var(--font-jakarta)", "system-ui", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
export default config;
