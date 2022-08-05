
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';


export class VPCStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'vpc-foo', {
            cidr: '10.0.0.0/16',
            natGateways: 1,
            maxAzs: 2,
            subnetConfiguration: [
              {
                name: 'public',
                subnetType: ec2.SubnetType.PUBLIC,
                cidrMask: 24,
              },
            ],
          });
    }

}
