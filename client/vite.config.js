import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

// Load environment variables from .env file
config();
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    "process.env": process.env,
  },
});
