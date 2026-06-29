// Post-build prerender: bake App's HTML into the static dist/index.html.
//
// Runs after both Vite builds in `npm run build`:
//   1. `vite build`                  -> dist/         (client + index.html template)
//   2. `vite build --ssr ...`        -> dist-server/  (Node-renderable entry)
//   3. `node prerender.js`           -> rewrites dist/index.html's empty
//                                       <div id="root"> with rendered markup,
//                                       then deletes the throwaway dist-server/.
//
// Result: crawlers and link unfurlers get real content; the browser hydrates it.

import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(root, "dist", "index.html");
const serverEntry = path.join(root, "dist-server", "entry-server.js");
const ROOT_MARKER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

const template = await readFile(indexPath, "utf8");
if (!template.includes(ROOT_MARKER)) {
  throw new Error(`prerender: '${ROOT_MARKER}' not found in dist/index.html`);
}

await writeFile(
  indexPath,
  template.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`),
  "utf8",
);
await rm(path.join(root, "dist-server"), { recursive: true, force: true });

console.log(`prerender: baked ${appHtml.length} chars into dist/index.html`);
