import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Build-time entry. `npm run build` compiles this with `vite build --ssr`,
 * then `prerender.js` calls render() and bakes the result into the static
 * dist/index.html so crawlers and link unfurlers receive real markup instead
 * of an empty <div id="root">. The browser still hydrates the same tree.
 *
 * Safe to run in Node: nothing in App touches window/document during the
 * synchronous render — browser work lives in effects (skipped on the server),
 * matchMedia is `typeof window` guarded, and readMemory() swallows the missing
 * localStorage in a try/catch.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
