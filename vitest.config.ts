import { defineConfig } from "vitest/config";
import path from "path";
import fs from "fs";

const contentlayerGeneratedDir = path.resolve(
  __dirname,
  "./.contentlayer/generated",
);
const contentlayerMockFile = path.resolve(
  __dirname,
  "./test/mocks/contentlayer-generated",
);

const contentlayerAlias = fs.existsSync(contentlayerGeneratedDir)
  ? contentlayerGeneratedDir
  : contentlayerMockFile;

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    exclude: ["node_modules", "dist", ".next", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".next/",
        ".contentlayer/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.tsx",
        "**/*.spec.tsx",
        "scripts/postbuild.mjs",
        "scripts/generateAppInfo.mjs",
        "next.config.js",
        "tailwind.config.js",
        "contentlayer.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "contentlayer/generated": contentlayerAlias,
    },
  },
});
