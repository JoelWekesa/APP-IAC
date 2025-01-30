import { ec2 } from "@pulumi/aws";

const publicKey = process.env.PUBLIC_KEY;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!publicKey) {
    throw new Error('Missing PUBLIC_KEY environment variable');
}

if (!awsAccessKeyId) {
    throw new Error('Missing AWS_ACCESS_KEY_ID environment variable');
}

if (!awsSecretAccessKey) {
    throw new Error('Missing AWS_SECRET_ACCESS_KEY environment variable');
}

const keyPair = new ec2.KeyPair('sil-pair', {
    publicKey,
    keyName: 'sil-pair',
    tags: {
        Name: 'sil-pair',
    }
});

const vpc = new ec2.Vpc('sil-vpc', {
    cidrBlock: '10.0.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: 'sil-vpc',
    }
});

const subnet = new ec2.Subnet('sil-subnet', {
    cidrBlock: '10.0.0.0/24',
    vpcId: vpc.id,
    mapPublicIpOnLaunch: true,
    tags: {
        Name: 'sil-subnet',
    }
});

const eip = new ec2.Eip('sil-eip', {});

const internetGateway = new ec2.InternetGateway('sil-igw', {
    vpcId: vpc.id,
    tags: {
        Name: 'sil-igw',
    }
});

const routingTable = new ec2.RouteTable('sil-rt', {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: '0.0.0.0/0',
            gatewayId: internetGateway.id,
        }
    ],
});

new ec2.RouteTableAssociation('sil-rt-assoc', {
    routeTableId: routingTable.id,
    subnetId: subnet.id,
});

const sg = new ec2.SecurityGroup('sil-sg', {
    vpcId: vpc.id,
    name: 'sil-sg',
    description: 'Security group for sil',
})

new ec2.SecurityGroupRule('sil-sg-allow-ssh', {
    type: 'ingress',
    fromPort: 22,
    toPort: 22,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})

new ec2.SecurityGroupRule('sil-sg-allow-http', {
    type: 'ingress',
    fromPort: 80,
    toPort: 80,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})


new ec2.SecurityGroupRule('sil-sg-allow-https', {
    type: 'ingress',
    fromPort: 443,
    toPort: 443,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})


new ec2.SecurityGroupRule('sil-sg-allow-portainer', {
    type: 'ingress',
    fromPort: 9443,
    toPort: 9443,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
});

new ec2.SecurityGroupRule('sil-sg-allow-grafana', {
    type: 'ingress',
    fromPort: 3000,
    toPort: 3000,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
});


new ec2.SecurityGroupRule('sil-sg-allow-backend', {
    type: 'ingress',
    fromPort: 5001,
    toPort: 5001,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})


new ec2.SecurityGroupRule('sil-sg-allow-frontend', {
    type: 'ingress',
    fromPort: 3001,
    toPort: 3001,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})


new ec2.SecurityGroupRule('sil-sg-allow-proxy', {
    type: 'ingress',
    fromPort: 81,
    toPort: 81,
    protocol: 'tcp',
    cidrBlocks: ['0.0.0.0/0'],
    securityGroupId: sg.id,
})



new ec2.SecurityGroupRule("pulumi-init-sg-all-egress", {
    securityGroupId: sg.id,
    type: "egress",
    fromPort: 0,
    toPort: 0,
    protocol: "-1",
    cidrBlocks: ["0.0.0.0/0"],
});


const ec2Instance = new ec2.Instance('sil-instance', {
    instanceType: "t2.small",
    ami: "ami-06e5a963b2dadea6f",
    subnetId: subnet.id,
    keyName: keyPair.keyName,
    vpcSecurityGroupIds: [sg.id],
    rootBlockDevice: {
        volumeSize: 100,
        volumeType: 'gp2',
        deleteOnTermination: true,
    },
    tags: {
        Name: 'sil-instance'
    }

})

new ec2.EipAssociation('sil-eip-assoc', {
    allocationId: eip.id,
    instanceId: ec2Instance.id,
}, { dependsOn: [ec2Instance] });

export const publicIp = eip.publicIp;
export const instanceState = ec2Instance.instanceState;
export const privateIp = ec2Instance.privateIp;
