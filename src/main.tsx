import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// In production the build prerenders App's markup into #root (see prerender.js),
// so hydrate it instead of discarding it. In dev the root is empty, so mount fresh.
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
