const colorVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colorVar("--color-primary"),
          active: colorVar("--color-primary-active")
        },
        action: colorVar("--color-action"),
        "on-action": colorVar("--color-on-action"),
        canvas: colorVar("--color-canvas"),
        body: colorVar("--color-body"),
        muted: colorVar("--color-muted"),
        "muted-soft": colorVar("--color-muted-soft"),
        "on-primary": colorVar("--color-on-primary"),
        "on-dark": colorVar("--color-on-dark"),
        "on-dark-soft": colorVar("--color-on-dark-soft"),
        "brand-accent": colorVar("--color-brand-accent"),
        "surface-soft": colorVar("--color-surface-soft"),
        "surface-card": colorVar("--color-surface-card"),
        "surface-strong": colorVar("--color-surface-strong"),
        "surface-dark": colorVar("--color-surface-dark"),
        "surface-dark-elevated": colorVar("--color-surface-dark-elevated"),
        hairline: colorVar("--color-hairline"),
        "hairline-soft": colorVar("--color-hairline-soft"),
        success: colorVar("--color-success"),
        warning: colorVar("--color-warning"),
        error: colorVar("--color-error"),
        badge: {
          orange: "#fb923c",
          pink: "#ec4899",
          violet: "#8b5cf6",
          emerald: "#34d399"
        },
        ink: {
          50: "#f8f9fa",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#242424",
          900: "#171717",
          950: "#111111"
        },
        signal: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857"
        },
        copper: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Roboto",
          "sans-serif"
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Roboto",
          "sans-serif"
        ],
        code: ["\"JetBrains Mono\"", "\"SFMono-Regular\"", "Consolas", "monospace"]
      },
      boxShadow: {
        panel: "0 1px 2px rgba(0, 0, 0, 0.05)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.08)"
      }
    }
  },
  plugins: []
};
