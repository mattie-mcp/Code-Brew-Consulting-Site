/**
 * Client logic for the resume-request form: the on/off feature flag, the API
 * call, the 7-day browser memory, and Plausible analytics events.
 */

import { profile } from "../data/profile";

// --- Feature flag (mirrors the backend: OFF only when explicitly "false") ---
export const formEnabled = import.meta.env.VITE_RESUME_FORM_ENABLED !== "false";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api.codebrewconsulting.com";
const ENDPOINT = `${API_BASE.replace(/\/$/, "")}/resume-request`;

/** Where CTAs point when the form is turned off — a plain mailto, never a dead button. */
export const mailtoFallback =
  `mailto:${profile.email}` +
  `?subject=${encodeURIComponent("Resume request")}` +
  `&body=${encodeURIComponent("Hi Mattie — could you send over your resume? Thanks!")}`;

// --- 7-day browser memory ---------------------------------------------------
const MEMORY_KEY = "code-brew.resume.v1";
const MEMORY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface ResumeMemory {
  ts: number;
  name: string;
  email: string;
}

export function readMemory(): ResumeMemory | null {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ResumeMemory>;
    if (!parsed || typeof parsed.ts !== "number" || !parsed.email || !parsed.name) {
      return null;
    }
    if (Date.now() - parsed.ts > MEMORY_TTL_MS) {
      localStorage.removeItem(MEMORY_KEY);
      return null;
    }
    return { ts: parsed.ts, name: parsed.name, email: parsed.email };
  } catch {
    return null; // storage disabled / blocked — just show the form.
  }
}

export function writeMemory(name: string, email: string): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify({ ts: Date.now(), name, email }));
  } catch {
    /* non-fatal: memory is a convenience, not a requirement */
  }
}

export function clearMemory(): void {
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch {
    /* ignore */
  }
}

// --- Analytics (Plausible custom events; no-op if the script is blocked) -----
export function track(event: string, props?: Record<string, string | number | boolean>): void {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* ignore */
  }
}

// --- Submit -----------------------------------------------------------------
export interface SubmitInput {
  name: string;
  email: string;
  message?: string;
  reasons?: string[];
  company?: string; // honeypot — must stay empty
  elapsedMs: number;
  resend?: boolean;
}

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

export async function submitRequest(input: SubmitInput): Promise<SubmitResult> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  let data: { ok?: boolean; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* tolerate an empty/non-JSON body */
  }

  if (res.ok && data.ok) {
    return { ok: true, message: data.message };
  }
  return { ok: false, message: data.message };
}
