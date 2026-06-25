import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,astro}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        bone: "#E5E5E5",
        violet: {
          DEFAULT: "#7C3AED",
          glow: "#8B5CF6",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          glow: "#67E8F9",
        },
      },
      fontFamily: {
        sans: [
          "Space Grotesk",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.06em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinslow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 28s linear infinite",
        spinslow: "spinslow 40s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
