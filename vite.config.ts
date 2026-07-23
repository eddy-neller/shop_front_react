import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["i18next-resources-to-backend", "lucide-react"],
  },
  server: {
    port: 4100,
    proxy: {
      "/api": {
        target: "http://localhost:20900",
        changeOrigin: true,
      },
    },
  },
});
