import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/theme.css"],
  format: ["cjs", "esm"],
  dts: true,
  minify: true,
  clean: true,
  injectStyle: true,
  sourcemap: true,
  splitting: false, // Disabling splitting can sometimes help with CSS injection consistency in some versions
});
