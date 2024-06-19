import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/FormulaCalculator.ts"),
      name: "FormulaCalculator",
      fileName: "formula-calculator",
      formats: ["es"],
    },
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: "default",
        compact: true,
        preserveModules: true,
        format: "es",
      },
    },
    minify: "esbuild",
    esbuild: {
      minify: true,
      keepNames: true,
    },
  },
});
