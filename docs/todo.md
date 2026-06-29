# To-do — deferred items

Items parked for later (revisit before / at launch).

## ~~Verify resume PDF serves correctly~~ — RESOLVED by the résumé-request form
- The résumé is **no longer a public file.** It was moved out of `public/` to a private
  S3 bucket and is delivered only through the form (see
  `docs/prompts/feature-resume-request-form.md` + the form section in
  `infrastructure.md`). The old SPA-catch-all risk is moot — there's no public PDF path.

## SES — leave the sandbox & verify the sender (form deploy prerequisite)
- **What:** The form's delivery email won't reach arbitrary requesters until the SES
  sending identity is verified and the account is out of the SES sandbox (us-east-1).
- **Do:** Verify the `codebrewconsulting.com` domain (DKIM/SPF in Route 53) and request
  SES production access. See "SES — deploy prerequisite" in `infrastructure.md`.
- **Why deferred:** Tied to deploy / going live.

## Provide the real résumé PDF
- **What:** The build currently ships the existing PDF (`infra/assets/resume/Mattie-Phillips-Resume.pdf`)
  as a placeholder. Drop the new résumé in at that path (same filename) and redeploy the
  stack — no code change needed.

## Activate Plausible analytics
- **What:** The Plausible snippet is in `index.html` (cookieless). The form now also
  emits custom events: `Resume Form View`, `Resume Submit Success`, `Resume Submit Error`,
  `Resume Delivered` — so the CTA → lead → résumé funnel is visible.
- **Do:** Create a Plausible account, add `codebrewconsulting.com`, and (optional) add the
  four custom events as goals to chart the funnel.
- **Why deferred:** Tied to deploy / going live.
- **Note:** the CloudFront CSP already allows `plausible.io` for script + connect.
