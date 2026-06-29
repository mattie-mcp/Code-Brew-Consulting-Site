# Infrastructure, Deployment & CI/CD

> Owner: Cloud / DevOps Engineer. See [`../PROJECT.md`](../PROJECT.md).

## Target architecture

```
Route 53 (hosted zone)
  └─ A/AAAA alias → CloudFront distribution
                      ├─ ACM certificate (us-east-1, DNS-validated)
                      ├─ Origin Access Control (OAC)
                      └─ Origin → S3 bucket (private, static build artifacts)
```

- **S3**: private bucket holding the Vite `dist/` output. No public access; served
  only via CloudFront + OAC.
- **CloudFront**: HTTPS, HTTP→HTTPS redirect, compression, long-cache hashed assets,
  short/no-cache `index.html`. SPA fallback: 403/404 → `/index.html` (200).
- **ACM**: certificate **must be in us-east-1** for CloudFront. DNS-validated via Route 53.
- **Route 53**: alias records for apex + `www` (redirect `www` → apex, or vice versa).

## IaC

Default recommendation: **AWS CDK (TypeScript)** — same language as the app, and the
infra itself becomes an engineering work sample. Terraform is an equally good alternative
if preferred. Decide before the infra step (see open items in `PROJECT.md`).

Stack should provision: S3 bucket, CloudFront dist + OAC, ACM cert, Route 53 records,
cache policies, and the SPA error-response routing.

## Deploy flow

1. `npm run build` → `dist/`.
2. `aws s3 sync dist/ s3://<bucket> --delete` (hashed assets immutable, `index.html` no-cache).
3. CloudFront invalidation for `/index.html` (and `/` ).

## CI/CD

- **GitHub Actions** on push to `main`: install → typecheck → build → deploy → invalidate.
- Auth via **OIDC role assumption** (no long-lived AWS keys in the repo).
- Optional: PR preview builds.

## Résumé-request & contact form backend

The site no longer serves the résumé as a public file. The PDF lives in a **private**
S3 bucket and is handed out only through a form that captures the lead. See the feature
spec in [`prompts/feature-resume-request-form.md`](prompts/feature-resume-request-form.md).

```
api.codebrewconsulting.com (ACM us-east-1 + Route 53 alias)
  └─ API Gateway (HTTP API, CORS locked to the site origin, stage throttled)
       └─ Lambda (Node 20)
            ├─ S3  GetObject   → private résumé bucket  (codebrew-resume-<acct>)
            ├─ SES SendEmail   → délivery (PDF attached) + owner notification
            └─ DynamoDB        → per-IP rate-limit counter (TTL-expiring)
```

- **Code:** Lambda handler `infra/lambda/resume-request/index.mjs` (no bundling — it
  uses the AWS SDK v3 that ships in the Node 20 runtime). Résumé asset lives in
  `infra/assets/resume/` and is deployed to the private bucket via `BucketDeployment`.
- **Endpoint:** `POST https://api.codebrewconsulting.com/resume-request`.
- **Spam protection (defense in depth):** hidden honeypot field + minimum
  time-on-form check (in the Lambda), API Gateway **stage throttling** (hard cost cap:
  10 rps / burst 5), and **per-IP rate limiting** via a DynamoDB counter (5 / hour,
  TTL-expiring). No CAPTCHA. CORS is locked to `https://codebrewconsulting.com` + `www`.
- **CSP:** CloudFront response-headers policy was widened so the SPA can reach the API
  and Plausible: `connect-src 'self' https://api.codebrewconsulting.com https://plausible.io`
  and `script-src 'self' https://plausible.io`.

### SES — deploy prerequisite (do this before going live)

The Lambda sends from `hello@codebrewconsulting.com` (env `FROM_EMAIL`). Before the
form can deliver:

1. **Verify the sending identity** in SES (us-east-1) — verify the
   `codebrewconsulting.com` domain (recommended; lets you send from any address on it)
   or the single `hello@` address. Add the DKIM/SPF records to Route 53.
2. **Leave the SES sandbox.** In the sandbox, SES will only send to *verified*
   recipients — so arbitrary requester emails will bounce. Request production access
   for the account (region us-east-1).

Until both are done the rest of the stack deploys fine; only delivery is gated.

### Feature flag (cost / abuse kill-switch)

One logical switch, enforced on **both** ends; OFF only when explicitly `false`.

| End | Where | Effect when OFF |
|---|---|---|
| Backend | Lambda env `FEATURE_ENABLED` (set from CDK context `formEnabled`) | Lambda returns `503 {error:"disabled"}` **before** any S3/SES/DynamoDB call |
| Frontend | Vite env `VITE_RESUME_FORM_ENABLED` | Form hidden; all CTAs fall back to `mailto:` (no dead buttons) |

- **Turn the whole feature off (no teardown):**
  - Instant, no redeploy: set the Lambda's `FEATURE_ENABLED` env var to `false` in the
    console (or `aws lambda update-function-configuration`). This alone stops all cost.
  - Full/clean: `cd infra && npx cdk deploy -c formEnabled=false`, and rebuild the
    frontend with `VITE_RESUME_FORM_ENABLED=false` so the UI reverts to `mailto:`.
- **Check current state at a glance:**
  - Deploy-time value is in the stack output **`FormFeatureEnabled`**.
  - Live value: `aws lambda get-function-configuration --function-name <ResumeRequestFn> --query 'Environment.Variables.FEATURE_ENABLED'`.

### Stack outputs

`FormApiUrl` (the endpoint), `FormFeatureEnabled` (flag state), alongside the existing
`SiteUrl` / `DistributionDomainName`.

## Cost

Effectively pennies/month at portfolio traffic: S3 storage + CloudFront egress within
or near free-tier. ACM and Route 53 hosted zone are the only near-fixed costs (~$0.50/mo zone).
The form backend is pay-per-use and effectively free at this volume: API Gateway HTTP API,
Lambda, SES (62k emails/mo free from Lambda historically; pennies/1k after), and an
on-demand DynamoDB table that holds only short-lived rate-limit counters.

## SEO & analytics (coordinate with Content)

- `robots.txt`, `sitemap.xml`, canonical URL.
- OpenGraph + Twitter card meta; JSON-LD `Person` schema.

### Analytics — native AWS, basic (decided)

Goal: simplest possible, maximally AWS-native, no third-party trackers, no client JS.

- **CloudFront standard access logs → S3.** Every request logged to a dedicated
  `logs` bucket. Zero client-side code, privacy-friendly by default.
- **Athena** over the log bucket for ad-hoc queries (top pages, referrers, geo, UA).
  Provision the table/partition projection in IaC so "analytics" is one query away.
- **CloudWatch metrics dashboard** — CloudFront already emits Requests, BytesDownloaded,
  error rates for free; wire a small dashboard for an at-a-glance view.
- *Optional upgrade later:* **CloudWatch RUM** for real-user metrics (sessions, web
  vitals) if page-level logs aren't enough. Adds a small JS snippet + Cognito identity
  pool — deferred to keep the baseline "basic."

## Security / ops

- Bucket private; OAC only. TLS 1.2+; modern CloudFront security policy.
- Security headers via CloudFront response-headers policy (HSTS, CSP, X-Content-Type-Options).
- Tag all resources `project=codebrew-site` for cost tracking.

## Known facts

- **Domain:** `codebrewconsulting.com`
- **AWS account:** resolved from the active SSO `default` profile (ID not stored in repo)
- **GitHub owner:** `mattie-mcp` (repo for Actions OIDC trust TBD)

## Still needed from owner

- [x] ~~Route 53?~~ → **Yes, hosted zone already exists** for `codebrewconsulting.com`.
      CDK will look up the existing zone and add alias records.
- [x] ~~Analytics?~~ → **CloudFront access logs + Athena** (native, basic). See above.
- [ ] Target region (suggest `us-east-1` — required for the CloudFront ACM cert anyway).
- [x] ~~CLI profile/role~~ → SSO `default` profile (account ID kept out of repo).
- [ ] IaC tool: CDK (default) vs Terraform.
- [ ] `www` → apex redirect, or apex → `www`? (Suggest serve at apex, redirect `www`.)
