# Feature Prompt — Resume-Request & Contact Form

> **How to use this file:** Drop it into a fresh session (with the agent team) to
> generate this feature. It states intent and hard constraints, recommends an
> approach consistent with the project's locked decisions, and lists the open
> calls I still need to make. Prefer persisting design/infra decisions back into
> `docs/` as you go. Source of truth for the project is `PROJECT.md`.

---

## The ask, in one line

Remove the **direct** resume download from the site and put a single, low-friction
**contact + resume-request form** in its place — so every resume that goes out also
tells me *who asked for it*, without making the asker work for it.

## Why

Right now the resume is a public file (`public/Mattie-Phillips-Resume.pdf`) linked
straight from the hero, contact section, and footer. Anyone can grab it and I learn
nothing. For a job search, the people downloading my resume — recruiters, hiring
managers — are exactly the leads I want to **capture and follow up with**. A form
turns an anonymous download into a warm lead.

## The guiding principle: least barrier

This is **not** a gate that makes people wait or jump through hoops. The form is a
lightweight trade — a name and an email — and in return they get the resume
**immediately**. If gating it costs me conversions with an impatient recruiter, the
feature has failed. Optimize relentlessly for low friction:

- **Few fields.** Name + email required; a short message and a "why are you reaching
  out?" multi-select are both optional. Nothing else.
- **Instant, automated delivery.** On submit, an email goes out *immediately* (no
  human in the loop) with the resume **attached as a PDF** and a short personal note
  from me. The success state confirms it's on its way to their inbox.
- **No heavy CAPTCHA.** Use invisible/low-friction spam protection (honeypot,
  timing, optional rate limit). Don't make a human prove they're a human.
- **One form, two jobs.** The same form handles "just say hi" and "send me your
  resume." Simplest version: every submission can opt into the resume (default on),
  and the message field is optional so a pure resume request is just name + email.

## What changes

1. **Remove all direct resume links.** Today `profile.resumeUrl` is linked from
   `Hero.tsx`, `Contact.tsx`, and `Footer.tsx`. The resume PDF must no longer be a
   publicly fetchable URL — move it **out of `public/`** so CloudFront never serves
   it directly. It lives privately and is only handed out through the form flow.
2. **Add the form.** A clean form (its own component, likely folded into / replacing
   the current Contact section) that collects the lead, delivers the resume, and
   notifies me.
3. **Repoint the CTAs.** The hero's "Resume ↓" and the footer/contact resume links
   become "Request resume" / "Get in touch" actions that lead to the form (scroll-to
   or reveal), preserving the current CTA hierarchy in the Studio design.

## Functional requirements

- **Form fields:** name (required), email (required), short message (optional), and
  an optional **multi-select — "Why are you reaching out?"** (pick any). Starter
  options, Content to refine: *Hiring for a role · Recruiting / sourcing · Networking
  / staying in touch · Consulting or contract inquiry · Just saying hello · Other*.
- Submitting with a valid name + email:
  - **delivers the resume to the requester** via an automated email with the **PDF
    attached** and a short personal blurb from me — sent immediately, no human in the
    loop. (Optional nice-to-have: also surface a download link in the success state as
    a backup if the email is slow/filtered — via a short-TTL S3 pre-signed URL, never
    a public path.)
  - **notifies me** (mphillips1695@gmail.com) of the lead: name, email, the optional
    message, the selected reason(s), and any easy context (timestamp; referrer/UTM).
  - shows a clear success state; handles and surfaces errors without losing input.
- Pure "say hi" submissions (no resume requested) still notify me.
- Accessible: real labels, keyboard-operable, visible focus, screen-reader-friendly
  validation, honors reduced-motion. Must clear WCAG AA in the Studio palette.
- Mobile-first: works cleanly at 390px, no horizontal scroll, comfortable tap targets.

## Returning visitors (browser memory)

Once someone has requested the resume, **remember it in their browser** so they
never have to fill the form twice. On a return visit, recognize the prior request
and drop straight to frictionless access — re-reveal the download / show a "Welcome
back — here's the resume again" path instead of the form. This is the "least
barrier" principle extended across visits.

- Persist a first-party flag on successful request — recommend **`localStorage`**
  storing a **timestamp** (+ optionally their name to personalize). Treat it as
  **expiring after 7 days**: on load, if the stored timestamp is older than a week,
  ignore it and show the form again. (localStorage has no native TTL, so this is just
  a stored-timestamp check — straightforward. A cookie with a 7-day `Max-Age` is an
  equally fine alternative.)
- It's a **convenience signal, not a security gate.** A new browser / incognito /
  cleared storage just sees the form again — that's fine; the form is for lead
  capture, not DRM. Don't store anything sensitive.
- First-party and non-tracking, so **no cookie-consent banner needed.**
- Use it to tailor the returning-visitor CTA ("Download resume again") and to avoid
  re-counting a known requester as a brand-new lead.

## Technical approach — CONFIRMED: AWS-native

> **Decision (2026-06-29):** go AWS-native (API Gateway + Lambda + SES), as below.
> The third-party form-service alternative is noted only as a fallback.

The site is a **static SPA on S3 (private) + CloudFront**, infra is **AWS CDK** in
`infra/` on the owner's AWS account, region us-east-1. A form needs a serverless
backend; the approach that stays faithful to those locked decisions (and doubles as
an engineering work sample) is:

- **API Gateway (HTTP API) → Lambda → SES.** The Lambda validates input, sends me
  the lead notification, and delivers the resume to the requester via SES as an
  **email with the PDF attached + my personal blurb**. All defined in the existing
  CDK app. (If also offering the optional success-state backup link, the Lambda
  returns a short-TTL S3 pre-signed URL.)
- **Resume stored privately** as an S3 object the Lambda can read/presign — never a
  public CloudFront path.
- **Spam protection** in the Lambda: honeypot field + submit-timing check + basic
  per-IP rate limiting. CORS locked to the site origin.
- **SES note:** prod SES needs the sending domain/identity verified and a move out of
  the sandbox — flag this as a deploy prerequisite.

*Alternative if I'd rather not run infra:* a third-party form/email service
(Formspree / Web3Forms / Basin). Lower effort, but adds a dependency, may not
auto-deliver the file, and is a weaker work-sample story. **Recommend the AWS-native
path** unless I say otherwise.

## Feature flag & cost control

The whole feature must sit behind **one easy on/off flag** so I can kill it instantly
to control cost or stop abuse — and easily see whether it's currently enabled. The
backend is pay-per-use (API Gateway + Lambda + SES are effectively free at this
volume), but I want a hard switch, not a teardown, to turn it off.

- **Single source of truth** for the flag, controlling both ends:
  - **Frontend:** a config/env flag (e.g. `VITE_RESUME_FORM_ENABLED`). When **off**,
    hide the form and gracefully fall back so the site still works — the CTA reverts
    to a simple `mailto:` to me. No dead buttons.
  - **Backend:** a Lambda env var (e.g. `FEATURE_ENABLED`). When **off**, the Lambda
    short-circuits and returns a clear "disabled" response **before** calling SES — so
    a stray request can't run up cost.
- **Flippable without a full redeploy** where possible (env-var change / CDK context),
  and **documented** in `docs/infrastructure.md`: where the flag lives, how to flip
  it, and how to check the current state at a glance.

## Content & copy

- Reframe the CTA from "Resume ↓" (a download) to a **request** that still reads as
  low-effort and confident — e.g. "Request my resume" / "Send me your resume."
- Microcopy should reassure: instant delivery, no spam, just so I know who I'm
  talking to. Form labels, the success message, the **"why are you reaching out?"
  option labels**, and the **delivery email — including the short personal blurb from
  me that accompanies the attached resume** — are the Content & Copy Writer's call;
  keep them in my voice and honest.
- Do **not** invent claims; the words elsewhere on the site stay as-is.

## Positioning gut-check (don't skip)

Have the Recruiter (evaluator) and Brand/Positioning roles pressure-test this: a
recruiter on a deadline who hits a wall instead of a PDF may bounce. Confirm the
"least barrier" execution actually feels frictionless from the *other* side of the
screen, and that "request my resume" doesn't read as precious. If it does, soften it.

## Design

Style the form natively in the **Studio** design system (`docs/design-system.md`):
warm cream surfaces, terracotta accent, Newsreader display / Inter body, rounded
geometry, the existing button hierarchy. The success state should feel warm and
human, not like a generic "thanks, submitted."

## Analytics

Plausible is already wired. Add custom events: form view, submit success, submit
error, and resume delivered — so I can see the funnel from CTA → lead → resume.

## Agent team & ownership

- **Frontend Engineer** — form component (incl. the optional reason multi-select),
  validation, states, API wiring, the 7-day browser-memory, and the feature-flag
  fallback to `mailto:`; strip the direct resume links; repoint CTAs.
- **Cloud / DevOps** — API Gateway + Lambda + SES + private resume storage in CDK;
  spam protection; CORS; the on/off **feature flag** (front + back) and cost guards;
  SES verification notes; update `docs/infrastructure.md`.
- **Content & Copy Writer** — form labels, microcopy, success + email copy.
- **Visual Designer** — form + success-state styling in Studio.
- **Recruiter (evaluator) + Brand/Positioning** — friction / conversion gut-check.
- **SEO & Analytics** — Plausible events.

## Acceptance criteria

- [ ] No public URL serves the resume; the PDF is gone from `public/` and stored privately.
- [ ] Hero, Contact, and Footer no longer link a downloadable PDF; they route to the form.
- [ ] A valid submit (a) emails the requester the resume as a **PDF attachment + my
      blurb**, and (b) notifies me with name, email, message, and selected reason(s).
- [ ] Fields: name + email required; message + "why reaching out?" multi-select
      optional. Low-friction spam protection (honeypot/timing), no heavy CAPTCHA.
- [ ] A prior requester is remembered in-browser for **7 days** and skips the form on
      return; after 7 days (or cleared storage) the form shows again.
- [ ] **Feature flag** turns the whole thing on/off easily (front falls back to
      `mailto:`, back short-circuits before SES); current state is easy to check.
- [ ] WCAG AA, keyboard-accessible, clean at 390px, on the Studio system.
- [ ] `npm run build` passes; infra (incl. the flag) is in CDK, not click-ops.
- [ ] Decisions persisted to `docs/` (infrastructure + design-system as needed).

## Out of scope (for now)

- A full CRM / lead dashboard (email notification is enough to start).
- Scheduling/calendar booking (still email-only by preference).
- Newsletter / mailing-list signup.

## Decisions (answered 2026-06-29)

1. **Delivery:** ✅ Email with the **PDF attached** + a short personal blurb from me.
   (Optional success-state download link as a backup, via short-TTL pre-signed URL.)
2. **Fields:** ✅ Name + email required; optional short message; optional multi-select
   "why are you reaching out?".
3. **Backend:** ✅ AWS-native (API Gateway + Lambda + SES) in the existing CDK app.
4. **Notification inbox:** ✅ mphillips1695@gmail.com.
5. **Feature flag:** ✅ Required — one easy on/off switch (front + back) for cost
   control, with the current state easy to check. See *Feature flag & cost control*.
6. **Resume:** ✅ A **new resume PDF** will be provided to use as the gated file;
   on-site content (the copy synthesized from the resume) stays **unchanged for now**.
7. **Browser memory:** ✅ Remember for **7 days** (stored-timestamp expiry).

> **Still to provide at build time:** the new resume PDF file (drop it in when ready;
> the build can use a placeholder until then).
