/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: "#FF6B35",
          dark: "#E85A2A",
          light: "#FFF3E6",
        },
        secondary: {
          DEFAULT: "#F7931E",
          dark: "#D97D0D",
          light: "#FEF5E7",
        },
        // Dark Theme
        dark: {
          DEFAULT: "#1A1A1A",
          lighter: "#2D2D2D",
          muted: "#404040",
        },
        // Semantic Colors
        coral: {
          DEFAULT: "#F26B5B",
          light: "#FFEAEA",
        },
        success: {
          DEFAULT: "#4CAF50",
          light: "#E8F5E9",
        },
        info: {
          DEFAULT: "#2196F3",
          light: "#E3F2FD",
        },
        warning: {
          DEFAULT: "#FFC107",
          light: "#FFF8E1",
        },
        // Text Colors
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        // Backgrounds
        background: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
          tertiary: "#FFF3E6",
          dark: "#1A1A1A",
        },
        // Borders
        border: {
          light: "#E5E7EB",
          medium: "#D1D5DB",
          dark: "#374151",
        },
        // Special
        favorite: "#FF6B6B",
        rating: "#FFD700",
        badge: "#1E3A5F",
        discount: "#F44336",
      },
      fontFamily: {
        sans: ["Montserrat-Regular"],
        montserrat: ["Montserrat-Regular"],
        "montserrat-light": ["Montserrat-Light"],
        "montserrat-regular": ["Montserrat-Regular"],
        "montserrat-medium": ["Montserrat-Medium"],
        "montserrat-semibold": ["Montserrat-SemiBold"],
        "montserrat-bold": ["Montserrat-Bold"],
      },
      fontSize: {
        xs: ["10px", { lineHeight: "14px" }],
        sm: ["12px", { lineHeight: "16px" }],
        base: ["14px", { lineHeight: "20px" }],
        md: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
        "4xl": ["32px", { lineHeight: "40px" }],
      },
      spacing: {
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        2.5: "10px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        xl: "0 20px 25px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
