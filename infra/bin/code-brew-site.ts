#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {
  CodeBrewSiteStack,
  CodeBrewSiteStackProps,
  EnvironmentName,
} from '../lib/code-brew-site-stack';

const app = new cdk.App();

// Select the environment with `-c env=staging` / `-c env=production`.
// Defaults to production so the bare `cdk deploy` keeps targeting the live site.
const envName = (app.node.tryGetContext('env') ?? 'production') as string;
if (envName !== 'staging' && envName !== 'production') {
  throw new Error(
    `Unknown env "${envName}". Use -c env=staging or -c env=production.`,
  );
}

// CloudFront + its ACM certificate must live in us-east-1.
// HostedZone.fromLookup also requires an explicit (non-env-agnostic) account/region.
// Account comes from the active credentials (the `default` SSO profile) via
// CDK_DEFAULT_ACCOUNT, so it's never hardcoded in this (public) repo.
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
};

// Per-environment configuration. Both run in the same account/region and share the
// existing Route 53 hosted zone; staging simply forgoes a custom domain.
const configs: Record<
  EnvironmentName,
  { stackId: string } & Omit<CodeBrewSiteStackProps, 'env' | 'envName'>
> = {
  production: {
    stackId: 'CodeBrewSiteStack',
    domainName: 'codebrewconsulting.com',
    // TODO: switch back to hello@codebrewconsulting.com once the domain is
    // verified in SES (DKIM). Using a verified gmail sender for now.
    senderEmail: 'Mattie Phillips <mphillips1695@gmail.com>',
    notifyEmail: 'mphillips1695@gmail.com',
    replyToEmail: 'mphillips1695@gmail.com',
    description:
      'Static hosting for codebrewconsulting.com (S3 + CloudFront + ACM + Route 53).',
  },
  staging: {
    stackId: 'CodeBrewSiteStack-staging',
    // No custom domain: served via the default *.cloudfront.net URL (no ACM/Route 53).
    domainName: undefined,
    senderEmail: 'Mattie Phillips <mphillips1695@gmail.com>',
    notifyEmail: 'mphillips1695@gmail.com',
    replyToEmail: 'mphillips1695@gmail.com',
    description:
      'Staging environment for the Code Brew site (S3 + CloudFront, default domain).',
  },
};

const config = configs[envName as EnvironmentName];

new CodeBrewSiteStack(app, config.stackId, {
  env,
  envName: envName as EnvironmentName,
  domainName: config.domainName,
  senderEmail: config.senderEmail,
  notifyEmail: config.notifyEmail,
  replyToEmail: config.replyToEmail,
  description: config.description,
  tags: {
    project: 'code-brew-site',
  },
});

app.synth();
