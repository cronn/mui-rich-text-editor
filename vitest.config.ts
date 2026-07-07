import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts", "src/__tests__/**/*.test.tsx"],
    exclude: configDefaults.exclude,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    reporters: ["default"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [...configDefaults.coverage?.exclude ?? [], "src/__tests__/**", "src/index.ts"],
    },
  },
});
