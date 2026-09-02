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
        target: "http://localhost:20800",
        changeOrigin: true,
      },
      // Temporaire : disparait le jour ou les assets passent sur S3.
      "/uploads": {
        target: "http://localhost:20800",
        changeOrigin: true,
      },
    },
  },
});
