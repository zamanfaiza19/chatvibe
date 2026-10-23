import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark background and border scales derived from deep forest sage
        umber: {
          50: "#f4f7f2",
          100: "#e5ece1",
          200: "#cddcc6",
          300: "#abc5a1",
          400: "#819e71", // Swatch 1 primary deep sage (#819e71)
          500: "#658256",
          600: "#4d673f",
          700: "#384d2d",
          800: "#22321c",
          900: "#142010",
          950: "#0b1409",
        },
        // Accent scales derived from soft pistachio swatch (#c4dfb9)
        bronze: {
          50: "#f6faf3",
          100: "#e9f4e3",
          200: "#d6eccb",
          300: "#c4dfb9", // Swatch 2 pistachio green (#c4dfb9)
          400: "#a9ce9a",
          500: "#8cb87c",
          600: "#6d9a5e",
          700: "#547947",
          800: "#425f38",
          900: "#33492c",
          950: "#182614",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
        display: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "bounce-subtle": "bounceSubtle 2s infinite ease-in-out",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
