/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.NODE_ENV === "production" ? "/chatgptree/" : "/",
  test: {
    projects: [
      {
        test: {
          include: ["tests/**/*.test.ts"],
          name: "unit",
          environment: "node",
          setupFiles: ["fake-indexeddb/auto"],
        },
      },
      {
        test: {
          include: ["tests/**/*.browser.test.{ts,tsx}"],
          name: "browser",
          browser: {
            provider: "playwright",
            enabled: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
