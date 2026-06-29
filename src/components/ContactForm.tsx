import { useEffect, useRef, useState } from "react";
import { profile, resumeForm } from "../data/profile";
import {
  clearMemory,
  readMemory,
  submitRequest,
  track,
  writeMemory,
} from "../lib/resumeForm";
import "./ContactForm.css";

type Mode = "form" | "welcome" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const remembered = useRef(readMemory());
  const [mode, setMode] = useState<Mode>(remembered.current ? "welcome" : "form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [company, setCompany] = useState(""); // honeypot

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const startedAt = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Funnel: count the view once.
  useEffect(() => {
    track("Resume Form View");
  }, []);

  // Move focus to the confirmation when we reach the success state.
  useEffect(() => {
    if (mode === "success") successRef.current?.focus();
  }, [mode]);

  function toggleReason(value: string) {
    setReasons((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value],
    );
  }

  function validate() {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Please add your name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const next = validate();
    if (next.name || next.email) {
      (next.name ? nameRef.current : document.getElementById("rf-email"))?.focus();
      return;
    }

    setBusy(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const result = await submitRequest({
      name: cleanName,
      email: cleanEmail,
      message: message.trim() || undefined,
      reasons: reasons.length ? reasons : undefined,
      company,
      elapsedMs: Date.now() - startedAt.current,
    });
    setBusy(false);

    if (result.ok) {
      writeMemory(cleanName, cleanEmail);
      track("Resume Submit Success");
      track("Resume Delivered");
      setMode("success");
    } else {
      track("Resume Submit Error");
      setFormError(result.message || resumeForm.errorGeneric);
    }
  }

  async function handleResend() {
    const mem = remembered.current;
    if (!mem) return setMode("form");
    setBusy(true);
    setFormError(null);
    const result = await submitRequest({
      name: mem.name,
      email: mem.email,
      elapsedMs: Date.now() - startedAt.current,
      resend: true,
    });
    setBusy(false);

    if (result.ok) {
      writeMemory(mem.name, mem.email); // refresh the 7-day window
      track("Resume Submit Success", { resend: true });
      track("Resume Delivered", { resend: true });
      setMode("success");
    } else {
      track("Resume Submit Error", { resend: true });
      setFormError(result.message || resumeForm.errorGeneric);
    }
  }

  function switchEmail() {
    clearMemory();
    remembered.current = null;
    setFormError(null);
    setMode("form");
  }

  // --- Success ----------------------------------------------------------
  if (mode === "success") {
    return (
      <div
        className="rf rf--note"
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <span className="rf__note-mark" aria-hidden="true">
          ✓
        </span>
        <h3 className="rf__note-title">{resumeForm.successTitle}</h3>
        <p className="rf__note-body">{resumeForm.successBody}</p>
      </div>
    );
  }

  // --- Returning visitor ------------------------------------------------
  if (mode === "welcome" && remembered.current) {
    const firstName = remembered.current.name.split(" ")[0];
    return (
      <div className="rf rf--note">
        <h3 className="rf__note-title">
          {resumeForm.returnTitle}
          {firstName ? `, ${firstName}` : ""}.
        </h3>
        <p className="rf__note-body">{resumeForm.returnBody}</p>
        {formError && (
          <p className="rf__error" role="alert">
            {formError}
          </p>
        )}
        <div className="rf__note-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleResend}
            disabled={busy}
          >
            {busy ? resumeForm.returnResendBusyLabel : resumeForm.returnResendLabel}
          </button>
          <button type="button" className="btn btn--quiet" onClick={switchEmail}>
            {resumeForm.returnSwitchLabel}
          </button>
        </div>
      </div>
    );
  }

  // --- Form -------------------------------------------------------------
  return (
    <form className="rf" onSubmit={handleSubmit} noValidate>
      <div className="rf__row">
        <div className="rf__field">
          <label className="rf__label" htmlFor="rf-name">
            {resumeForm.nameLabel}
          </label>
          <input
            id="rf-name"
            ref={nameRef}
            className="rf__input"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "rf-name-err" : undefined}
          />
          {errors.name && (
            <span id="rf-name-err" className="rf__field-err" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="rf__field">
          <label className="rf__label" htmlFor="rf-email">
            {resumeForm.emailLabel}
          </label>
          <input
            id="rf-email"
            className="rf__input"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "rf-email-err" : undefined}
          />
          {errors.email && (
            <span id="rf-email-err" className="rf__field-err" role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="rf__field">
        <label className="rf__label" htmlFor="rf-message">
          {resumeForm.messageLabel}
        </label>
        <textarea
          id="rf-message"
          className="rf__input rf__textarea"
          name="message"
          rows={3}
          placeholder={resumeForm.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <fieldset className="rf__fieldset">
        <legend className="rf__legend">
          {resumeForm.reasonsLegend}
          <span className="rf__hint"> {resumeForm.reasonsHint}</span>
        </legend>
        <div className="rf__reasons">
          {resumeForm.reasons.map((r) => (
            <label key={r.value} className="rf__reason">
              <input
                type="checkbox"
                name="reasons"
                value={r.value}
                checked={reasons.includes(r.value)}
                onChange={() => toggleReason(r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot — hidden from humans and assistive tech; bots fill it. */}
      <div className="rf__hp" aria-hidden="true">
        <label htmlFor="rf-company">Company (leave blank)</label>
        <input
          id="rf-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {formError && (
        <p className="rf__error" role="alert">
          {formError}
        </p>
      )}

      <div className="rf__submit">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? resumeForm.submitBusyLabel : resumeForm.submitLabel}
        </button>
        <p className="rf__reassure">{resumeForm.reassurance}</p>
      </div>

      <p className="rf__alt">
        Prefer email?{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </form>
  );
}
