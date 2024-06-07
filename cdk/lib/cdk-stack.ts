import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

// Read configuration from config.json
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export class NextjsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for the website
    const bucket = new s3.Bucket(this, 'NextjsBucket', {
      bucketName: config.s3BucketName,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    // Lookup for the ACM Certificate
    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', config.certificateArn);

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'NextjsDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
      domainNames: [config.subdomainName],
      certificate: certificate,
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
        ttl: cdk.Duration.seconds(0),
      }],
    });

    // Route 53 Hosted Zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: config.domainName,
    });

    // Route 53 A Record for the subdomain
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: config.subdomainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Deploying the Next.js app to the S3 bucket
    new s3Deployment.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3Deployment.Source.asset('../out')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
