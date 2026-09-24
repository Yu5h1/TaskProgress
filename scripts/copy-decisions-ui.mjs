// Keeps Desktop assets byte-identical to the Browser build.
import { mkdir, copyFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
await mkdir(new URL("src/TaskProgress.Cli/decisions-ui/",root),{recursive:true});
for (const name of ["index.html","decisions-ui.js","decisions-ui.css"])
  await copyFile(new URL(`viewer/decisions/${name}`,root),new URL(`src/TaskProgress.Cli/decisions-ui/${name}`,root));
