'use strict';
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

class Doorman {
    constructor() {
        this.ccp = this.initCcp()
        this.wallet = this.initWallet()
        this.ca = this.initCa()
    }

    initWallet() {
        const walletPath = path.join(process.cwd(), 'server', 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        return wallet;
    }

    initCcp() {
        const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON)
        return ccp
    }

    initCa() {
        const caURL = this.ccp.certificateAuthorities['ca.example.com'].url;
        const ca = new FabricCAServices(caURL);
        return ca;
    }

    async userExists(name) {
        const exist = await this.wallet.exists(name);
        return exist;
    }

    async enrollAdmin() {
        const exist = await this.userExists('admin');
        if (exist) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return false;
        }

        const enrollment = await this.ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        })
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        this.wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return true;
    }

    async registerUser() {
        const exist = await this.userExists('user1');
        if (exist) {
            console.log('An identity for the user "user1" already exists in the wallet');
            return false;
        }

        const gateway = new Gateway();
        await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'admin', discovery: { enabled: false } });

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        this.wallet.import('user1', userIdentity);
        console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
        return true;
    }

    async query() {
        const gateway = new Gateway();
        await gateway.connect(
            this.ccp,
            {
                wallet: this.wallet,
                identity: 'user1',
                discovery: { enabled: false },
            }
        );
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryAllCars');
        return JSON.parse(result.toString())
    }

    async changeOwner(key, newOwner) {
        const gateway = new Gateway();
        await gateway.connect(
            this.ccp,
            {
                wallet: this.wallet,
                identity: 'user1',
                discovery: { enabled: false },
            }
        );
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        await contract.submitTransaction('changeCarOwner', key, newOwner);
        await gateway.disconnect();
        return true
    }
}

module.exports = Doorman