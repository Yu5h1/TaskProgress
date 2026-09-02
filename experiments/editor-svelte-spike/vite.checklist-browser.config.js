import { fileURLToPath, URL } from "node:url";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// The Browser twin of vite.checklist-ui.config.js: same source screen, same
// shared styles, a different entry (checklist-browser-main.js reads
// ?scope=&task= and builds an HTTP transport instead of reaching for
// chrome.webview) and a different output — viewer/checklist/, alongside the
// Viewer's own viewer/assets/, so LocalWebService serves it the same way.
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
    outDir: fileURLToPath(new URL("../../viewer/checklist", import.meta.url)),
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL("./src/checklist-browser-main.js", import.meta.url)),
      formats: ["es"],
      fileName: () => "checklist-ui.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "checklist-ui[extname]",
      },
    },
  },
});
