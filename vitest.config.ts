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
        "**/src/lib/api/**",
        "**/src/**/lib/api/**",
        "**/src/**/types/**",
        "**/src/lib/utils/**",
        "**/src/main.tsx",
        "**/src/i18n.ts",
        "**/src/features/Auth/utils/authEventListener.ts",
        "**/src/components/ui/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
