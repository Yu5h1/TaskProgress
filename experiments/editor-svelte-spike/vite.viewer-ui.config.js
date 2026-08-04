import { fileURLToPath, URL } from "node:url";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

/*
 * Preview UI bundle for `viewer/index.html`.
 *
 * It builds into `viewer/assets/ui/` with stable filenames so the existing
 * Pages artifact — which copies `viewer/index.html` and `viewer/assets/` —
 * keeps working without touching the docs workflow, and so index.html can
 * reference the file directly instead of a content hash.
 */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [svelte()],
  resolve: {
    alias: {
      "@editor": fileURLToPath(new URL("../../viewer/assets", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("../../viewer/assets/ui", import.meta.url)),
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL("./src/viewer-ui.js", import.meta.url)),
      formats: ["es"],
      fileName: () => "viewer-ui.js",
    },
    rollupOptions: {
      output: { assetFileNames: "viewer-ui[extname]" },
    },
  },
});
