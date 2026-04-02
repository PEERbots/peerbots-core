import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    minify: true,
    clean: true,
    injectStyle: true,
    sourcemap: true,
    splitting: false,
  },
  {
    entry: {
      "styles/theme": "src/styles/theme.css",
    },
    format: ["esm"],
    minify: true,
    clean: false,
    injectStyle: false, // Ensures a standalone CSS file is generated
  },
]);
