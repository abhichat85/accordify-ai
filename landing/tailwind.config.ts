import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import scrollbar from "tailwind-scrollbar";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx,md}",
    "./public/**/*.svg",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        accord: {
          blue: "#1A2B3C",
          teal: "#00A896",
          orange: "#FF6F61",
          lightGray: "#F7F9FC",
          mediumGray: "#E1E4E8",
          darkGray: "#4A5568",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0' },
        },
        "glowPulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "blobFloat": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "slide-out-down": "slide-out-down 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "blob-float": "blobFloat 15s ease-in-out infinite",
      },
      // Scrollbar styling
      scrollbar: {
        'rounded': 'rounded-full',
        'track-radius': 'rounded-full',
        'thumb-radius': 'rounded-full',
      },
      // Typography extensions
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      // Spacing extensions
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
      },
      // Shadow extensions
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'subtle-md': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'subtle-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(var(--primary-rgb), 0.35)',
        'glow-lg': '0 0 30px rgba(var(--primary-rgb), 0.35)',
        'glow-sm': '0 0 10px rgba(var(--primary-rgb), 0.25)',
        'glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3)',
        'glass-lg': 'inset 0 2px 2px 0 rgba(255, 255, 255, 0.15), 0 60px 120px -25px rgba(50, 50, 93, 0.3), 0 40px 70px -35px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        jost: ["Jost", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate, typography, scrollbar({ nocompatible: true }), lineClamp],
} satisfies Config;
