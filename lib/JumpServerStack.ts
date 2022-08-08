import {
    Stack, StackProps, Fn, Duration,
    RemovalPolicy, CfnOutput, Tags,
} from 'aws-cdk-lib';
import { Vpc, SecurityGroup, Peer, Port, Instance, SubnetType, InstanceClass, InstanceSize, InstanceType, AmazonLinuxImage, AmazonLinuxGeneration } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface JumpServerProps extends StackProps {

    vpc: Vpc;

}

// connect by ssh -i "~/.ssh/aws-jump-server-key.pem" ec2-user@18.142.46.229
export class JumpServerStack extends Stack {
    server: Instance;

    constructor(scope: Construct, id: string, props: JumpServerProps) {
        super(scope, id, props);
        const { vpc } = props;
        // define security group for jump server
        const ec2InstanceSG = new SecurityGroup(this, 'jump-server-sg', {
            vpc,
        });

        ec2InstanceSG.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(22),
            'allow SSH connections',
        );

        this.server = new Instance(this, 'jump-server-instance', {
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            securityGroup: ec2InstanceSG,
            instanceType: InstanceType.of(
                InstanceClass.BURSTABLE2,
                InstanceSize.MICRO,
            ),
            machineImage: new AmazonLinuxImage({
                generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            keyName: 'aws-jump-server-key',
        });


    }
}