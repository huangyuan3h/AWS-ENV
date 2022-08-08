import {
    Stack, StackProps
} from 'aws-cdk-lib';

import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion, Credentials } from 'aws-cdk-lib/aws-rds';
import { Duration, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Vpc, SubnetType, InstanceType, InstanceClass, InstanceSize, Port, Instance } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';



export interface MysqlStackProps extends StackProps {
    vpc: Vpc;
    jumpserver: Instance;
}

export class MysqlStack extends Stack {
    db: DatabaseInstance;

    constructor(scope: Construct, id: string, props: MysqlStackProps) {
        super(scope, id, props);
        const { vpc, jumpserver } = props;

        this.db = new DatabaseInstance(this, 'db-instance', {
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_ISOLATED,
            },
            engine: DatabaseInstanceEngine.mysql({
                version: MysqlEngineVersion.VER_8_0_28,
            }),
            instanceType: InstanceType.of(
                InstanceClass.BURSTABLE3,
                InstanceSize.MICRO,
            ),
            credentials: Credentials.fromGeneratedSecret('admin'),
            multiAz: false,
            allocatedStorage: 20,
            maxAllocatedStorage: 100,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'foodb',
            publiclyAccessible: false,
        });

        this.db.connections.allowFrom(jumpserver, Port.tcp(3306));

        new CfnOutput(this, 'dbEndpoint', {
            value: this.db.instanceEndpoint.hostname,
        });

        new CfnOutput(this, 'secretName', {
            value: this.db.secret?.secretName!,
        });

    }
}

