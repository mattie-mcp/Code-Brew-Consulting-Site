import * as path from 'path';
import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  CfnOutput,
  Tags,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export interface CodebrewSiteStackProps extends StackProps {
  /** Apex domain, e.g. 'codebrewconsulting.com'. The 'www' subdomain is derived. */
  readonly domainName: string;
}

/**
 * Provisions static hosting for codebrewconsulting.com:
 *   Route 53 (A/AAAA alias) -> CloudFront (ACM cert, OAC) -> private S3 bucket.
 *
 * The certificate lives in us-east-1 (required for CloudFront) and is DNS-validated
 * against the EXISTING Route 53 hosted zone for the domain.
 */
export class CodebrewSiteStack extends Stack {
  constructor(scope: Construct, id: string, props: CodebrewSiteStackProps) {
    super(scope, id, props);

    const apexDomain = props.domainName;
    const wwwDomain = `www.${apexDomain}`;
    const formApiDomain = `api.${apexDomain}`;

    // Cost-tracking tag applied to every taggable resource in this stack.
    Tags.of(this).add('project', 'codebrew-site');

    // ---------------------------------------------------------------------
    // Existing Route 53 hosted zone (created out of band; we only add records).
    // fromLookup requires concrete account/region in the stack env (see bin/).
    // ---------------------------------------------------------------------
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: apexDomain,
    });

    // ---------------------------------------------------------------------
    // ACM certificate in us-east-1, DNS-validated via the hosted zone.
    // Covers the apex + www. CloudFront only accepts certs from us-east-1.
    // ---------------------------------------------------------------------
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: apexDomain,
      subjectAlternativeNames: [wwwDomain],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // ---------------------------------------------------------------------
    // Private S3 bucket for the site artifacts (Vite `dist/` output).
    // No public access; served only via CloudFront + Origin Access Control.
    // ---------------------------------------------------------------------
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `codebrew-site-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      // RETAIN: never auto-delete production site content on stack removal.
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // ---------------------------------------------------------------------
    // Separate private bucket for CloudFront standard access logs.
    //
    // Analytics (per docs/infrastructure.md): these logs are queryable via
    // Amazon Athena for ad-hoc reporting (top pages, referrers, geo, UA).
    // No extra resources are required here — point an Athena table /
    // partition projection at this bucket when analytics is wanted.
    //
    // ACL ownership is required so CloudFront can write the log objects.
    // ---------------------------------------------------------------------
    const logsBucket = new s3.Bucket(this, 'AccessLogsBucket', {
      bucketName: `codebrew-site-logs-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // ---------------------------------------------------------------------
    // Security response headers: HSTS, X-Content-Type-Options, and a sane CSP.
    // ---------------------------------------------------------------------
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      'SecurityHeadersPolicy',
      {
        responseHeadersPolicyName: 'CodebrewSiteSecurityHeaders',
        comment: 'HSTS, nosniff, and CSP for codebrewconsulting.com',
        securityHeadersBehavior: {
          strictTransportSecurity: {
            override: true,
            accessControlMaxAge: Duration.days(730),
            includeSubdomains: true,
            preload: true,
          },
          contentTypeOptions: { override: true },
          frameOptions: {
            override: true,
            frameOption: cloudfront.HeadersFrameOption.DENY,
          },
          referrerPolicy: {
            override: true,
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          },
          contentSecurityPolicy: {
            override: true,
            contentSecurityPolicy: [
              "default-src 'self'",
              "img-src 'self' data:",
              // Plausible analytics script; form POSTs go to the API subdomain.
              "script-src 'self' https://plausible.io",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              `connect-src 'self' https://${formApiDomain} https://plausible.io`,
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        },
      },
    );

    // ---------------------------------------------------------------------
    // S3 origin secured with Origin Access Control (OAC). The helper grants
    // CloudFront read access to the (private) bucket via a bucket policy.
    // ---------------------------------------------------------------------
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket);

    // ---------------------------------------------------------------------
    // CloudFront distribution.
    // ---------------------------------------------------------------------
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      comment: 'codebrewconsulting.com static site',
      defaultRootObject: 'index.html',
      domainNames: [apexDomain, wwwDomain],
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableLogging: true,
      logBucket: logsBucket,
      logIncludesCookies: false,
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy,
      },
      // SPA fallback: return index.html with a 200 for client-side routes
      // (403 happens for keys not present under OAC; 404 for missing objects).
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5),
        },
      ],
    });

    // ---------------------------------------------------------------------
    // Route 53 alias records: apex AND www -> the same distribution.
    // ---------------------------------------------------------------------
    const distributionTarget = route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(distribution),
    );

    new route53.ARecord(this, 'ApexAliasA', {
      zone: hostedZone,
      recordName: apexDomain,
      target: distributionTarget,
    });
    new route53.AaaaRecord(this, 'ApexAliasAaaa', {
      zone: hostedZone,
      recordName: apexDomain,
      target: distributionTarget,
    });

    new route53.ARecord(this, 'WwwAliasA', {
      zone: hostedZone,
      recordName: wwwDomain,
      target: distributionTarget,
    });
    new route53.AaaaRecord(this, 'WwwAliasAaaa', {
      zone: hostedZone,
      recordName: wwwDomain,
      target: distributionTarget,
    });

    // ---------------------------------------------------------------------
    // Deploy the built site (../dist) to the bucket and invalidate CloudFront.
    // ---------------------------------------------------------------------
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'dist'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    // =====================================================================
    // Résumé-request & contact form backend.
    //   api.<domain>  →  API Gateway (HTTP API)  →  Lambda  →  SES
    //   Résumé stored in a PRIVATE bucket (never a CloudFront path).
    //   Per-IP rate limiting via DynamoDB; honeypot + timing in the Lambda.
    // =====================================================================

    // --- Feature flag (single source of truth, front + back) -------------
    // OFF without a teardown: `cdk deploy -c formEnabled=false` (or flip the
    // Lambda's FEATURE_ENABLED env var in the console for an instant kill).
    // See docs/infrastructure.md.
    const formEnabled = this.node.tryGetContext('formEnabled') !== 'false';

    // --- Private bucket holding the résumé PDF ---------------------------
    const resumeBucket = new s3.Bucket(this, 'ResumeBucket', {
      bucketName: `codebrew-resume-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const resumeKey = 'Mattie-Phillips-Resume.pdf';
    new s3deploy.BucketDeployment(this, 'DeployResume', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', 'assets', 'resume'))],
      destinationBucket: resumeBucket,
      prune: true,
    });

    // --- Per-IP rate-limit table (atomic counter, TTL-expiring) ----------
    const rateTable = new dynamodb.Table(this, 'FormRateLimitTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: RemovalPolicy.DESTROY, // ephemeral throttling state
    });

    // --- Lambda handler --------------------------------------------------
    const formFn = new lambda.Function(this, 'ResumeRequestFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambda', 'resume-request'),
      ),
      timeout: Duration.seconds(15),
      memorySize: 256,
      environment: {
        FEATURE_ENABLED: String(formEnabled),
        RESUME_BUCKET: resumeBucket.bucketName,
        RESUME_KEY: resumeKey,
        RESUME_FILENAME: resumeKey,
        // SES sender identity — verify this domain/address before going live.
        FROM_EMAIL: `Mattie Phillips <hello@${apexDomain}>`,
        REPLY_TO: 'mphillips1695@gmail.com',
        NOTIFY_EMAIL: 'mphillips1695@gmail.com',
        RATE_TABLE: rateTable.tableName,
        RATE_LIMIT: '5',
        RATE_WINDOW_SEC: '3600',
        MIN_SUBMIT_MS: '2500',
      },
    });

    resumeBucket.grantRead(formFn);
    rateTable.grantReadWriteData(formFn);
    formFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'], // SES send is not resource-scoped at this granularity
      }),
    );

    // --- ACM cert for the API subdomain (us-east-1, DNS-validated) -------
    const apiCertificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName: formApiDomain,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const apiDomainName = new apigwv2.DomainName(this, 'ApiDomainName', {
      domainName: formApiDomain,
      certificate: apiCertificate,
    });

    // --- HTTP API (CORS locked to the site origin) ----------------------
    const httpApi = new apigwv2.HttpApi(this, 'FormApi', {
      description: 'codebrewconsulting.com résumé-request & contact form',
      corsPreflight: {
        allowOrigins: [`https://${apexDomain}`, `https://${wwwDomain}`],
        allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
        allowHeaders: ['content-type'],
        maxAge: Duration.days(1),
      },
      defaultDomainMapping: { domainName: apiDomainName },
    });

    httpApi.addRoutes({
      path: '/resume-request',
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('ResumeRequestIntegration', formFn),
    });

    // Hard cost cap: throttle the default stage so a burst can't run up spend.
    const defaultStage = httpApi.defaultStage!.node.defaultChild as apigwv2.CfnStage;
    defaultStage.defaultRouteSettings = {
      throttlingRateLimit: 10,
      throttlingBurstLimit: 5,
    };

    // --- Route 53 alias for api.<domain> → the API custom domain --------
    const apiTarget = route53.RecordTarget.fromAlias(
      new targets.ApiGatewayv2DomainProperties(
        apiDomainName.regionalDomainName,
        apiDomainName.regionalHostedZoneId,
      ),
    );
    new route53.ARecord(this, 'ApiAliasA', {
      zone: hostedZone,
      recordName: formApiDomain,
      target: apiTarget,
    });
    new route53.AaaaRecord(this, 'ApiAliasAaaa', {
      zone: hostedZone,
      recordName: formApiDomain,
      target: apiTarget,
    });

    // ---------------------------------------------------------------------
    // Outputs.
    // ---------------------------------------------------------------------
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain name.',
    });
    new CfnOutput(this, 'SiteUrl', {
      value: `https://${apexDomain}`,
      description: 'Public site URL.',
    });
    new CfnOutput(this, 'FormApiUrl', {
      value: `https://${formApiDomain}/resume-request`,
      description: 'Résumé-request form endpoint (set as VITE_API_BASE host).',
    });
    new CfnOutput(this, 'FormFeatureEnabled', {
      value: String(formEnabled),
      description: 'Whether the résumé form is enabled at deploy time.',
    });
  }
}
