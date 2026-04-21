import { defineConfig } from "vitest/config";
import * as path from "node:path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: "src/setupTests.ts",
    reporters: ["dot"],
    testTimeout: 10000,
    coverage: {
      reporter: ["html"],
      include: ["**/src/**"],
      exclude: [
        "**/src/contexts/**",
        "**/src/**/contexts/**",
        "**/src/layouts/**",
        "**/src/**/layouts/**",
        "**/src/services/**",
        "**/src/**/services/**",
        "**/src/**/types/**",
        "**/src/utils/**",
        "**/src/main.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
