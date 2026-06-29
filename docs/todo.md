# To-do — deferred items

Items parked for later (revisit before / at launch).

## ~~Verify resume PDF serves correctly~~ — RESOLVED by the resume-request form
- The resume is **no longer a public file.** It was moved out of `public/` to a private
  S3 bucket and is delivered only through the form (see
  `docs/prompts/feature-resume-request-form.md` + the form section in
  `infrastructure.md`). The old SPA-catch-all risk is moot — there's no public PDF path.

## Follow-ups (move off the gmail stopgap)
- **Domain (DKIM) verification — the real fix.** Sending *from* `gmail.com` via SES
  fails DMARC alignment → weaker deliverability / spam risk / "via amazonses.com".
  Verify the `codebrewconsulting.com` domain with DKIM in SES (Route 53 records),
  then switch `senderEmail` back to `Mattie Phillips <hello@codebrewconsulting.com>`
  (TODO left in `infra/bin/code-brew-site.ts`).
- **`cdk deploy`** at some point to reconcile the manually-patched live Lambda env
  with the CDK source.
