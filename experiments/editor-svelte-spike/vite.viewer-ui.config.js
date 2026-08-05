import { fileURLToPath, URL } from "node:url";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

/*
 * Preview UI bundle for `viewer/index.html`.
 *
 * It builds directly into `viewer/assets/` with stable filenames, alongside
 * app.js and styles.css. Flat on purpose: the Pages artifact in the docs repo
 * copies `viewer/index.html` and `viewer/assets/`, and a subdirectory would
 * only survive if that copy happens to be recursive. A missing bundle is not a
 * degraded page — the host throws when no adapter is registered and the whole
 * report is replaced by a fatal message — so the deployment must not depend on
 * an assumption we cannot verify from this repository.
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
    outDir: fileURLToPath(new URL("../../viewer/assets", import.meta.url)),
    // Never true here: this directory holds hand-written sources.
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL("./src/viewer-ui.js", import.meta.url)),
      formats: ["es"],
      fileName: () => "viewer-ui.js",
    },
    rollupOptions: {
      // The host module must stay external. Bundling a copy of it would give
      // the bundle its own adapter registry, so registration would never reach
      // the `ui-host.js` instance that `app.js` imports.
      external: (id) => id.endsWith("ui-host.js"),
      output: {
        assetFileNames: "viewer-ui[extname]",
        paths: (id) => (id.endsWith("ui-host.js") ? "./ui-host.js" : id),
      },
    },
  },
});
