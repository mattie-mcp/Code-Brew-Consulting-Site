#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodebrewSiteStack } from '../lib/codebrew-site-stack';

const app = new cdk.App();

new CodebrewSiteStack(app, 'CodebrewSiteStack', {
  // CloudFront + its ACM certificate must live in us-east-1.
  // HostedZone.fromLookup also requires an explicit (non-env-agnostic) account/region.
  // Account comes from the active credentials (the `default` SSO profile) via
  // CDK_DEFAULT_ACCOUNT, so it's never hardcoded in this (public) repo.
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  domainName: 'codebrewconsulting.com',
  description: 'Static hosting for codebrewconsulting.com (S3 + CloudFront + ACM + Route 53).',
  tags: {
    project: 'codebrew-site',
  },
});

app.synth();
