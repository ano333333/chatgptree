/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    projects: [
      {
        test: {
          include: ["tests/**/*.test.ts"],
          name: "unit",
          environment: "node",
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
