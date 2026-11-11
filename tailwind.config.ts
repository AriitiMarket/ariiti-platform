import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          "primary-hover": "var(--brand-primary-hover)",
          secondary: "var(--brand-secondary)",
          surface: "var(--brand-surface)",
          "surface-subtle": "var(--brand-surface-subtle)",
          border: "var(--brand-border)",
          "text-primary": "var(--brand-text-primary)",
          "text-body": "var(--brand-text-body)",
          "text-muted": "var(--brand-text-muted)",
        },
        ariiti: {
          navy: "#093053",
          dark: "#093053",
          light: "#FFFFFF",
          accent: "#093053",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
