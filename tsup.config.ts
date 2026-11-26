import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "templates/index": "src/templates/index.ts",
      "flow/index": "src/flow/index.ts",
      "charts/index": "src/charts/index.ts",
    },
    format: ["esm"],
    dts: false,
    minify: true,
    clean: true,
    loader: {
      ".png": "dataurl",
    },
    external: [
      "@peerbots/core/flow",
      "@peerbots/core/charts",
      "@xyflow/react",
      "@xyflow/react/dist/style.css",
      "@dagrejs/dagre",
      "victory",
    ],
    injectStyle: (css) =>
      `import styleInject from '#style-inject';styleInject(${css}, { insertAt: 'top' })`,
    sourcemap: true,
    splitting: true,
  },
  {
    entry: {
      index: "src/index.ts",
      "templates/index": "src/templates/index.ts",
      "flow/index": "src/flow/index.ts",
      "charts/index": "src/charts/index.ts",
    },
    format: ["cjs"],
    dts: true,
    minify: true,
    clean: false,
    loader: {
      ".png": "dataurl",
    },
    external: [
      "@peerbots/core/flow",
      "@peerbots/core/charts",
      "@xyflow/react",
      "@xyflow/react/dist/style.css",
      "@dagrejs/dagre",
      "victory",
    ],
    injectStyle: (css) =>
      `import styleInject from '#style-inject';styleInject(${css}, { insertAt: 'top' })`,
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
