#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AwsEnvStack } from '../lib/aws-env-stack';
import {VPCStack} from '../lib/VPCStack';
import { Mysql } from '../lib/RDSStack';

const app = new cdk.App();

const env = { account: '319653899185', region: 'ap-southeast-1' };

new VPCStack(app, 'VPCStack',{
  env,
});

new Mysql(app, 'MysqlStack', {
  env,
  mysqlUsername:'yuanhuang',
  description:"Mysql Stack",
  vpcId:"vpc-064a917573f09148b",
  subnetIds:["subnet-0c54561661147f001", "subnet-060fa6933a4306ed0"],
  dbName:"FooDb",
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL)
});


new AwsEnvStack(app, 'AwsEnvStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env,

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});





