#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NextjsCdkStack } from '../lib/cdk-stack';
import 'dotenv/config';

const app = new cdk.App();

new NextjsCdkStack(app, 'NextjsCdkStack', {
    env: {
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
        account: process.env.CDK_DEFAULT_ACCOUNT || ''
      }
});
