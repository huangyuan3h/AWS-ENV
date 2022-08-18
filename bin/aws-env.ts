#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { VPCStack } from '../lib/VPCStack';
import { JumpServerStack } from '../lib/JumpServerStack';
import { MysqlStack } from '../lib/MysqlStack';

const app = new cdk.App();

const env = { account: '319653899185', region: 'ap-southeast-1' };

const vpcStack = new VPCStack(app, 'VPCStack', {
  env,
});

const jumpServerStack = new JumpServerStack(app, 'JumpServerStack', {
  env,
  vpc: vpcStack.vpc,
});

const mysqlStack = new MysqlStack(app, 'MysqlStack', {
  env,
  vpc: vpcStack.vpc,
  jumpserver: jumpServerStack.server
})






