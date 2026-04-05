/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind watches for class="dark" on <html> — set by App.tsx useEffect
  darkMode: ["class"],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ── Typography ──────────────────────────────────────────────────────────
      // These must match the Google Fonts imports in index.html
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        syne: ["Syne",    "system-ui", "sans-serif"],
      },

      // ── CSS-variable-driven colour system ───────────────────────────────────
      // Values are bare HSL channels — Tailwind wraps them: hsl(var(--x))
      // This matches how index.css defines them (no hsl() wrapper in the var).
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ── Sidebar tokens ─────────────────────────────────────────────────
        sidebar: {
          DEFAULT:            "hsl(var(--sidebar))",
          foreground:         "hsl(var(--sidebar-foreground))",
          primary:            "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:             "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border:             "hsl(var(--sidebar-border))",
          ring:               "hsl(var(--sidebar-ring))",
        },
      },

      // ── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        xl:    "0.75rem",
        lg:    "var(--radius)",
        md:    "calc(var(--radius) - 2px)",
        sm:    "calc(var(--radius) - 4px)",
      },

      // ── Animations ───────────────────────────────────────────────────────────
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      // ── Max-width ────────────────────────────────────────────────────────────
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },

  plugins: [],
};