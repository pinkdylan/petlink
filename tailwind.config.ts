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
      fontFamily: {
        sans: ['"Noto Sans SC"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        oat: "#f5f0e8",
        "health-green": "#4CAF50",
        "oatmeal-light": "#F9F7F2",
        "oatmeal-base": "#F2EFE9",
        mGreen: "#A3B18A",
        mRed: "#E07A5F",
        mBlue: "#81B29A",
        mYellow: "#F2CC8F",
        dark: "#3D405B",
        primary: "#4A5D4E",
        accent: "#8C9B8E",
        "bg-main": "#F5F5F3",
        panel: "#FFFFFF",
        "morandi-gray": "#D1D1CB",
        "morandi-dark": "#3C3C3B",
        "morandi-green": "#9BB0A5",
        "morandi-gray-light": "#F2F2F7",
        "morandi-text": "#4A4A4A",
        "bauhaus-red": "#E63946",
        "bauhaus-blue": "#457B9D",
        "apple-bg": "#FFFFFF",
        "morandi-sage": "#D4DBD1",
        "morandi-cream": "#F9F8F6",
        "morandi-sand": "#E8E3DE",
        "primary-dark": "#3A4D3F",
        "morandi-bg": "#F5F7FA",
        "morandi-accent": "#8E9775",
        "morandi-text-main": "#333333",
        "morandi-text-sub": "#7A7A7A",
        "morandi-blue": "#9BA4B5",
        "morandi-earth": "#D1D1D1",
      },
      backgroundColor: {
        app: "#f5f0e8",
      },
    },
  },
  plugins: [],
};
export default config;
