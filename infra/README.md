# Code Brew Site — Infrastructure (AWS CDK, TypeScript)

Provisions static hosting for **codebrewconsulting.com**:

```
Route 53 (A/AAAA alias, apex + www)
  └─ CloudFront distribution
       ├─ ACM certificate (us-east-1, DNS-validated)
       ├─ Origin Access Control (OAC)
       ├─ Response headers policy (HSTS, CSP, X-Content-Type-Options)
       ├─ SPA error routing (403/404 -> /index.html, 200)
       └─ Origin -> private S3 bucket (site artifacts)
  └─ Standard access logs -> private S3 logs bucket (Athena-queryable)
```

The certificate, distribution, and stack all run in **us-east-1** (required for the
CloudFront ACM cert and for `HostedZone.fromLookup`).

## Environments

The same CDK app deploys two environments, selected with the `env` context flag.
Both run in the **same AWS account / region** and (for production) the same hosted zone.

| Env | Select with | Stack name | Custom domain | Buckets on destroy |
|-----|-------------|-----------|---------------|--------------------|
| **production** (default) | `-c env=production` | `CodeBrewSiteStack` | apex + `www`, ACM cert, Route 53, `api.` subdomain | `RETAIN` |
| **staging** | `-c env=staging` | `CodeBrewSiteStack-staging` | none — served on the default `*.cloudfront.net` URL; API on its default `execute-api` endpoint | `DESTROY` (auto-emptied) |

Notes:

- **Production is unchanged** by this split: same stack name and identical physical
  resource names (`code-brew-site-<acct>`, etc.), so an already-deployed stack is never
  forced to recreate live infra. The bare `cdk deploy` still targets production.
- **Staging has no DNS or TLS-on-domain** — no Route 53 records and no ACM certificate
  (it uses CloudFront's default certificate). Find its URL in the `SiteUrl` output after
  deploy. Its resources are suffixed `-staging` and its CORS is opened to `*` (it is
  non-public), with the CSP `connect-src` widened to the regional `execute-api` wildcard.
- Both environments share the same verified SES sender identity
  (`hello@codebrewconsulting.com`), so staging can exercise the form end-to-end.

## Prerequisites

- **AWS CLI v2** (installed) authenticated to the target account via IAM Identity
  Center (SSO) — no long-lived keys on disk. Auth is the `default` profile in
  `us-east-1`. Per working session:

  ```sh
  aws login                     # browser SSO sign-in; refreshes short-lived credentials
  aws sts get-caller-identity   # confirm you're on the intended account
  ```
- **Node.js 18+** and npm.
- An **existing Route 53 hosted zone** for `codebrewconsulting.com` (already created;
  the stack looks it up and only adds alias records).
- A built site at `../dist` (run the app's `npm run build`) before `cdk deploy`, since
  the `BucketDeployment` uploads that directory.
- **The résumé PDF must be present locally** at `infra/assets/resume/` (e.g.
  `Mattie-Phillips-Resume.pdf`). It is **gitignored** — it carries PII and the gated
  copy must never be public — so a fresh clone will NOT have it. `BucketDeployment`
  uploads this file to the private résumé bucket at deploy time; if it's missing the
  gated-résumé deploy fails. Obtain the PDF out of band and drop it in that folder
  before deploying (or turn the form feature off with `-c formEnabled=false`).

## Install

```sh
npm install
```

## Bootstrap (one-time per account/region)

CDK needs a bootstrap stack in `us-east-1`:

```sh
npx cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/us-east-1
```

## Deploy

```sh
# from repo root: build the SPA first so ../dist exists
npm run build            # in the app project (produces dist/)

# then, in this infra/ directory:
npm run build            # tsc typecheck

# Production (default):
npm run diff             # cdk diff   (== diff:prod)
npm run deploy           # cdk deploy (== deploy:prod)

# Staging:
npm run diff:staging     # cdk diff   -c env=staging
npm run deploy:staging   # cdk deploy -c env=staging
npm run destroy:staging  # cdk destroy -c env=staging  (tears down cleanly)
```

Outputs include the CloudFront distribution domain name and the public site URL
(for staging, that `SiteUrl` is the only way to reach it — there is no custom domain).

## Useful scripts

| Script                   | Action                                   |
|--------------------------|------------------------------------------|
| `npm run build`          | `tsc` typecheck/compile                  |
| `npm run synth`          | `cdk synth` (production)                 |
| `npm run diff`           | `cdk diff` (production)                  |
| `npm run deploy`         | `cdk deploy` (production)                |
| `npm run synth:staging`  | `cdk synth -c env=staging`               |
| `npm run diff:staging`   | `cdk diff -c env=staging`                |
| `npm run deploy:staging` | `cdk deploy -c env=staging`              |
| `npm run destroy:staging`| `cdk destroy -c env=staging`             |

The `:prod` variants (`deploy:prod`, `diff:prod`, `synth:prod`) are explicit aliases of
the unsuffixed commands.

## Notes

- **Logs bucket / analytics:** CloudFront standard access logs land in a dedicated
  private bucket and are **queryable via Amazon Athena** (per `docs/infrastructure.md`).
  No extra resources are provisioned here — create an Athena table / partition
  projection over the bucket when you want to run reports.
- **Removal policy:** both the site and logs buckets are `RETAIN` — they are not deleted
  if the stack is destroyed, to protect production content and historical logs.
- All resources are tagged `project=code-brew-site` for cost tracking.
