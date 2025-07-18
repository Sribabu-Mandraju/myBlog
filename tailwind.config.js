
// tailwind.config.js
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: ["@tailwindcss/typography"],
};
