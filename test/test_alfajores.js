const Web3 = require("web3")
const { ether } = require('@openzeppelin/test-helpers');
const ContractKit = require('@celo/contractkit')
const LendingPoolAddressesProvider = require("@aave/protocol-v2/artifacts/contracts/protocol/configuration/LendingPoolAddressesProvider.sol/LendingPoolAddressesProvider.json");
const {getMoolaV2LendingPoolAddressProvider} = require("../constants");
const { toBN } = require('./helpers/utils');
const SolarisMargin = artifacts.require('SolarisMargin');
const SolarisMarginDeployment = require('../ui/src/deployments/SolarisMargin.alfajores.address.json');

contract('SolarisMargin', async function () {
    const private_key = process.env.PRIVATE_KEY || '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';

    const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
    const kit = ContractKit.newKitFromWeb3(web3);

    const account = kit.web3.eth.accounts.privateKeyToAccount(private_key);
    kit.connection.addAccount(account.privateKey);

    beforeEach(async function () {
        const goldTokenAddress = await kit.registry.addressFor(ContractKit.CeloContract.GoldToken);
        const stableTokenAddress = await kit.registry.addressFor(ContractKit.CeloContract.StableToken)
        const stableTokenEURAddress = await kit.registry.addressFor(ContractKit.CeloContract.StableTokenEUR)

        this.ASSET_ADDRESSES = {
            CELO: goldTokenAddress,
            cUSD: stableTokenAddress,
            cEUR: stableTokenEURAddress,
        };

        this.goldToken = await kit.contracts.getGoldToken();
        this.lendingPoolAddressProvider = new kit.web3.eth.Contract(LendingPoolAddressesProvider.abi, getMoolaV2LendingPoolAddressProvider('alfajores'));
        this.solarisMargin = new kit.web3.eth.Contract(SolarisMargin.abi, SolarisMarginDeployment.address);

        const SolarisMarginCeloBalance = await this.goldToken.balanceOf(this.solarisMargin._address);

        if (!SolarisMarginCeloBalance.gt(toBN(1000001))) {
            const tx = await this.goldToken.transfer(this.solarisMargin._address, 1000001).send({from: account.address});
            await tx.waitReceipt();
        }

        const SolarisMarginCeloBalanceAfter = await this.goldToken.balanceOf(this.solarisMargin._address);

        console.log(`###: SolarisMarginCeloBalanceAfter`, SolarisMarginCeloBalanceAfter.gt(1000000));
    });

    describe('Solaris Margin', function () {
        it('opens long position', async function () {
            console.log(`###: this.ASSET_ADDRESSES['cUSD']`, this.ASSET_ADDRESSES['cUSD']);
            console.log(`###: this.ASSET_ADDRESSES['cUSD']`, this.ASSET_ADDRESSES['CELO']);
            try {
                const txo = this.solarisMargin.methods.openLongPosition(this.ASSET_ADDRESSES['CELO'], this.ASSET_ADDRESSES['cUSD'], 100, 1, '0x');
                const tx = await kit.sendTransactionObject(txo, { from: account.address });
                const receipt = await tx.waitReceipt();
                console.log(`###: receipt`, receipt);
            } catch (e) {
                console.log(`###: e`, e)
            }
            const name = await this.solarisMargin.methods.getName().call();
            console.log(`###: name`, name);

            return true;

        });
    });
});


