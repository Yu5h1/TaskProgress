// Builds the shared decisions surface; the build script distributes it to both hosts.
import { fileURLToPath, URL } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)), base:"./", plugins:[svelte()],
  resolve:{alias:{"@editor":fileURLToPath(new URL("../../viewer/assets",import.meta.url))}},
  build:{outDir:fileURLToPath(new URL("../../viewer/decisions",import.meta.url)),emptyOutDir:false,
    lib:{entry:fileURLToPath(new URL("./src/decisions-main.js",import.meta.url)),formats:["es"],fileName:()=>"decisions-ui.js"},
    rollupOptions:{output:{assetFileNames:"decisions-ui[extname]"}}}
});
