/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" turns the resume form OFF site-wide (CTAs fall back to mailto). */
  readonly VITE_RESUME_FORM_ENABLED?: string;
  /** Origin of the form API, e.g. https://api.codebrewconsulting.com */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
}
