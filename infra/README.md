# Codebrew Site — Infrastructure (AWS CDK, TypeScript)

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

## Prerequisites

- **AWS CLI v2** (installed) authenticated to the target account via IAM Identity
  Center (SSO) — no long-lived keys on disk. One-time setup: `aws configure sso`
  (use the `default` profile and region `us-east-1`). Then, per working session:

  ```sh
  aws sso login                 # refresh short-lived credentials
  aws sts get-caller-identity   # confirm you're on the intended account
  ```
- **Node.js 18+** and npm.
- An **existing Route 53 hosted zone** for `codebrewconsulting.com` (already created;
  the stack looks it up and only adds alias records).
- A built site at `../dist` (run the app's `npm run build`) before `cdk deploy`, since
  the `BucketDeployment` uploads that directory.

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
npm run diff             # review the change set
npm run deploy           # cdk deploy
```

Outputs include the CloudFront distribution domain name and the public site URL.

## Useful scripts

| Script           | Action                          |
|------------------|---------------------------------|
| `npm run build`  | `tsc` typecheck/compile         |
| `npm run synth`  | `cdk synth` (emit CloudFormation)|
| `npm run diff`   | `cdk diff`                      |
| `npm run deploy` | `cdk deploy`                    |

## Notes

- **Logs bucket / analytics:** CloudFront standard access logs land in a dedicated
  private bucket and are **queryable via Amazon Athena** (per `docs/infrastructure.md`).
  No extra resources are provisioned here — create an Athena table / partition
  projection over the bucket when you want to run reports.
- **Removal policy:** both the site and logs buckets are `RETAIN` — they are not deleted
  if the stack is destroyed, to protect production content and historical logs.
- All resources are tagged `project=codebrew-site` for cost tracking.
