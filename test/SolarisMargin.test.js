const Web3 = require("web3")
const {ether} = require('@openzeppelin/test-helpers');
const ContractKit = require('@celo/contractkit')
const LendingPoolAddressesProvider = require("@aave/protocol-v2/artifacts/contracts/protocol/configuration/LendingPoolAddressesProvider.sol/LendingPoolAddressesProvider.json");
const MoolaOracle = require("@aave/protocol-v2/artifacts/contracts/misc/AaveOracle.sol/AaveOracle.json");
const {getMoolaV2LendingPoolAddressProvider, getMoolaV2Oracle, getUbeswapRouterAddress, getMoolaV2ProtocolDataProvider} = require("../constants");

const {toBN} = require('./helpers/utils');
const SolarisMargin = artifacts.require('SolarisMargin');
const MoolaV2LendingPool = artifacts.require("ILendingPool");
const IERC20 = artifacts.require("IERC20");
const MoolaV2IProtocolDataProvider = artifacts.require("IProtocolDataProvider");
const MoolaV2IStableDebtToken = artifacts.require("IStableDebtToken");


contract('SolarisMargin', async function () {
	const private_key = process.env.PRIVATE_KEY || '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';

	const web3 = new Web3('https://alfajores-forno.celo-testnet.org');
	const kit = ContractKit.newKitFromWeb3(web3);


	const account = kit.web3.eth.accounts.privateKeyToAccount(private_key);
	kit.connection.addAccount(account.privateKey);

	async function getUserInfo(_user) {
		const moolaV2LendingPoolAddressProvider = new kit.web3.eth.Contract(LendingPoolAddressesProvider.abi, getMoolaV2LendingPoolAddressProvider('alfajores'));
		const moolaV2LendingPoolAddress = await moolaV2LendingPoolAddressProvider.methods.getLendingPool().call();

		const moolaV2LendingPool = new kit.web3.eth.Contract(MoolaV2LendingPool.abi, moolaV2LendingPoolAddress);
		const userInfo = await moolaV2LendingPool.methods.getUserAccountData(account.address).call();
		return userInfo;
	}

	async function getReserveData(asset) {
		const moolaV2LendingPoolAddressProvider = new kit.web3.eth.Contract(LendingPoolAddressesProvider.abi, getMoolaV2LendingPoolAddressProvider('alfajores'));
		const moolaV2LendingPoolAddress = await moolaV2LendingPoolAddressProvider.methods.getLendingPool().call();

		const moolaV2LendingPool = new kit.web3.eth.Contract(MoolaV2LendingPool.abi, moolaV2LendingPoolAddress);
		const reserveData = await moolaV2LendingPool.methods.getReserveData(asset).call();
		return reserveData;
	}

	async function getPrincipalBalanceOf(user, asset) {
		// Get the relevant debt token address
		const moolaV2IProtocolDataProvider = new kit.web3.eth.Contract(MoolaV2IProtocolDataProvider.abi, getMoolaV2ProtocolDataProvider('alfajores'));
		const tokenDetails = await moolaV2IProtocolDataProvider.methods.getReserveTokensAddresses(asset).call();
		const stableDebtContract = new kit.web3.eth.Contract(MoolaV2IStableDebtToken.abi, tokenDetails.stableDebtTokenAddress);
		return await stableDebtContract.methods.principalBalanceOf(user).call();
	}

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
		this.stableToken = await kit.contracts.getStableToken();
		this.solarisMargin = await SolarisMargin.deployed();
		this.moolaV2IProtocolDataProvider = new kit.web3.eth.Contract(MoolaV2IProtocolDataProvider.abi, getMoolaV2ProtocolDataProvider('alfajores'));
		this.moolaOracle = new kit.web3.eth.Contract(MoolaOracle.abi, getMoolaV2Oracle('alfajores'));

		const SolarisMarginCeloBalance = await this.goldToken.balanceOf(this.solarisMargin.address);
		const accountCUSDBalance = await this.stableToken.balanceOf(account.address);

		if (!accountCUSDBalance.gt(toBN(10000))) {
			const approveTx = await this.stableToken.approve(this.solarisMargin.address, 5000).send({from: account.address});
			await approveTx.waitReceipt();
			const tx = await this.solarisMargin.swap(this.ASSET_ADDRESSES['CELO'], this.ASSET_ADDRESSES['cUSD'], 5000, 10000, account.address);
			await tx.waitReceipt();
		}

		const accountCUSDBalanceAfterSwap = await this.stableToken.balanceOf(account.address);

		if (!SolarisMarginCeloBalance.gt(toBN(1000001))) {
			const tx = await this.goldToken.transfer(this.solarisMargin.address, 1000001).send({from: account.address});
			await tx.waitReceipt();
		}
	});

	describe('Solaris Margin', function () {
		// it('should swap', async function () {
		// 	try {
		// 		const receipt = await this.solarisMargin.contract.methods.swap(this.ASSET_ADDRESSES['CELO'], this.ASSET_ADDRESSES['cUSD'], 10, 1, account.address).send({from: account.address});
		//
		// 		console.log(`###: receipt`, receipt.events.TestEvent);
		// 	} catch (e) {
		// 		console.log(`###: e`, e)
		// 	}
		// });
		// it('should user account data', async function () {
		//
		// 	console.log(await getUserInfo(account.address));
		// });

		// it('should get principal balance of a user', async function () {
		//
		// 	console.log('getPrincipalBalanceOf', await getPrincipalBalanceOf(account.address, this.ASSET_ADDRESSES['cUSD']));
		// });


		// it('should borrow onBehalf of a user', async function () {
		// 	try {
		// 		await this.solarisMargin.borrow(this.ASSET_ADDRESSES['cUSD'], 1000, 1, 0, account.address);
		//
		// 		const solarisMarginCUSDBalance = await this.stableToken.balanceOf(this.solarisMargin.address);
		// 		console.log(`###: solarisMarginCUSDBalance`, solarisMarginCUSDBalance.toString());
		// 	} catch (e) {
		// 		console.log(`###: e`, e)
		// 	}
		// });

		// it('should repay a loan', async function () {
		// 	const moolaV2LendingPoolAddressProvider = new kit.web3.eth.Contract(LendingPoolAddressesProvider.abi, getMoolaV2LendingPoolAddressProvider('alfajores'));
		// 	const moolaV2LendingPoolAddress = await moolaV2LendingPoolAddressProvider.methods.getLendingPool().call();
		//
		// 	const moolaV2LendingPool = new kit.web3.eth.Contract(MoolaV2LendingPool.abi, moolaV2LendingPoolAddress);
		// 	const approveTx = await this.goldToken.approve(moolaV2LendingPoolAddress, 20024).send({from: account.address});
		// 	await approveTx.waitReceipt();
		// 	await moolaV2LendingPool.methods.repay(this.ASSET_ADDRESSES['CELO'], 20024, 1, account.address).send({from: account.address});
		// });

		// it('withdraw', async function () {
		// 	const moolaV2LendingPoolAddressProvider = new kit.web3.eth.Contract(LendingPoolAddressesProvider.abi, getMoolaV2LendingPoolAddressProvider('alfajores'));
		// 	const moolaV2LendingPoolAddress = await moolaV2LendingPoolAddressProvider.methods.getLendingPool().call();
		//
		// 	const moolaV2LendingPool = new kit.web3.eth.Contract(MoolaV2LendingPool.abi, moolaV2LendingPoolAddress);
		// 	await moolaV2LendingPool.methods.withdraw(this.ASSET_ADDRESSES['cUSD'], 60, account.address).send({from: account.address});
		// });


		// it('should user account data', async function () {
		//
		// 	console.log(await getUserInfo(account.address));
		// });

		// it('should get reserve data', async function () {
		//
		// 	console.log(await getReserveData(this.ASSET_ADDRESSES['CELO']));
		// });

		// it('should open long cUSD -> CELO 2x position', async function () {
		// 	const amount = toBN(1000);
		// 	const minAmount = toBN(1);
		// 	const leverage = toBN(2);
		// 	const moolaFlashLoanFee = amount.mul(toBN(35)).div(toBN(10000));
		//
		// 	const approveTx = await this.stableToken.approve(this.solarisMargin.address, amount).send({from: account.address});
		// 	await approveTx.waitReceipt();
		//
		// 	//Approve credit delegation to SolarisMargin contract
		// 	// Get the relevant debt token address
		// 	const tokenDetails = await this.moolaV2IProtocolDataProvider.methods.getReserveTokensAddresses(this.ASSET_ADDRESSES['cUSD']).call();
		// 	const stableDebtContract = new kit.web3.eth.Contract(MoolaV2IStableDebtToken.abi, tokenDetails.stableDebtTokenAddress);
		//
		// 	// approve delegation for stable debt token
		// 	const approveDelegationTxo = await stableDebtContract.methods.approveDelegation(this.solarisMargin.address, amount.mul(leverage).add(moolaFlashLoanFee));
		// 	const approveDelegationTx = await kit.sendTransactionObject(approveDelegationTxo, {from: account.address});
		// 	await approveDelegationTx.waitReceipt();
		//
		// 	try {
		// 		const receipt = await this.solarisMargin.openLongPosition(this.ASSET_ADDRESSES['cUSD'], this.ASSET_ADDRESSES['CELO'], amount, minAmount, leverage);
		// 		console.log(`###: receipt`, receipt);
		// 	} catch (e) {
		// 		console.log(`###: e`, e)
		// 	}
		//
		// 	return true;
		//
		// });

		// it('should close long cUSD -> CELO 2x position', async function () {
		// 	const cUSDPrice = await this.moolaOracle.methods.getAssetPrice(this.ASSET_ADDRESSES['cUSD']).call();
		//
		// 	const debtAmount = await getPrincipalBalanceOf(account.address, this.ASSET_ADDRESSES['cUSD']);
		//
		// 	const celoReserveData = await getReserveData(this.ASSET_ADDRESSES['CELO'])
		//
		// 	const aCELOAddress = celoReserveData.aTokenAddress;
		// 	const aCELOContract = new kit.web3.eth.Contract(IERC20.abi, celoReserveData.aTokenAddress);
		//
		// 	const collateralAmount = await aCELOContract.methods.balanceOf(account.address).call();
		//
		// 	const minAmount = toBN(1);
		//
		// 	// approve collateral to transfer to SolariSMargin contract
		// 	const approveTx = await kit.sendTransactionObject(aCELOContract.methods.approve(this.solarisMargin.address, collateralAmount), {from: account.address});
		// 	approveTx.waitReceipt();
		//
		// 	try {
		// 		const receipt = await this.solarisMargin.repay(this.ASSET_ADDRESSES['cUSD'], this.ASSET_ADDRESSES['CELO'], aCELOAddress, debtAmount, collateralAmount, minAmount);
		// 		console.log(`###: receipt`, receipt);
		// 	} catch (e) {
		// 		console.log(`###: e`, e)
		// 	}
		//
		// 	return true;
		//
		// });

		it('should open short cUSD -> CELO position', async function () {

			const amount = toBN(10);
			const leverage = toBN(3);
			const cUSDPrice = await this.moolaOracle.methods.getAssetPrice(this.ASSET_ADDRESSES['cUSD']).call();
			const loanAmount = amount.mul(leverage.subn(1)).mul(new kit.web3.utils.BN(cUSDPrice)).div(kit.web3.utils.toWei(toBN(1), 'ether'));

			console.log(`###: loanAmount`, loanAmount.toString());
			const SolarisMarginCeloBalance = await this.goldToken.balanceOf(this.solarisMargin.address);
			console.log(`###: SolarisMarginCeloBalance`, SolarisMarginCeloBalance.toString())
			const moolaFlashLoanFee = loanAmount.mul(toBN(35)).div(toBN(10000));
			const minAmount = amount;

			console.log(`###: minAmount`, minAmount.toString());

			// const amountOut = await this.solarisMargin.getAmountsOut(this.ASSET_ADDRESSES['CELO'], this.ASSET_ADDRESSES['cUSD'], loanAmount);

			// console.log(`###: amountOut`, amountOut.toString())
			const approveTx = await this.stableToken.approve(this.solarisMargin.address, amount).send({from: account.address});
			await approveTx.waitReceipt();

			//Approve credit delegation to SolarisMargin contract
			// Get the relevant debt token address
			const tokenDetails = await this.moolaV2IProtocolDataProvider.methods.getReserveTokensAddresses(this.ASSET_ADDRESSES['CELO']).call();
			const stableDebtContract = new kit.web3.eth.Contract(MoolaV2IStableDebtToken.abi, tokenDetails.stableDebtTokenAddress);

			// approve delegation for stable debt token
			const approveDelegationTxo = await stableDebtContract.methods.approveDelegation(this.solarisMargin.address, loanAmount.add(moolaFlashLoanFee));
			const approveDelegationTx = await kit.sendTransactionObject(approveDelegationTxo, {from: account.address});
			await approveDelegationTx.waitReceipt();

			try {
				const receipt = await this.solarisMargin.openShortPosition(this.ASSET_ADDRESSES['cUSD'], this.ASSET_ADDRESSES['CELO'], amount, loanAmount, minAmount, leverage);
				console.log(`###: receipt`, receipt);
			} catch (e) {
				console.log(`###: e`, e)
			}

			return true;

		});

		// it('should close short cUSD -> CELO 2x position', async function () {
		// 	// const cUSDPrice = await this.moolaOracle.methods.getAssetPrice(this.ASSET_ADDRESSES['cUSD']).call();
		//
		// 	const debtAmount = await getPrincipalBalanceOf(account.address, this.ASSET_ADDRESSES['CELO']);
		// 	console.log(`###: debtAmount`, debtAmount)
		// 	const cUSDReserveData = await getReserveData(this.ASSET_ADDRESSES['cUSD'])
		//
		// 	const aCUSDAddress = cUSDReserveData.aTokenAddress;
		// 	const aCUSDContract = new kit.web3.eth.Contract(IERC20.abi, aCUSDAddress);
		// 	const collateralAmount = await aCUSDContract.methods.balanceOf(account.address).call();
		// 	console.log(`###: collateralAmount`, collateralAmount)
		// 	const moolaFlashloanFee = (new kit.web3.utils.BN(debtAmount)).mul(toBN(35)).div(toBN(10000));
		// 	const minAmount = (new kit.web3.utils.BN(debtAmount)).add(moolaFlashloanFee);
		//
		// 	// approve collateral to transfer to SolarisMargin contract
		// 	const approveTx = await kit.sendTransactionObject(aCUSDContract.methods.approve(this.solarisMargin.address, collateralAmount), {from: account.address});
		// 	approveTx.waitReceipt();
		//
		// 	try {
		// 		const receipt = await this.solarisMargin.repay(this.ASSET_ADDRESSES['CELO'], this.ASSET_ADDRESSES['cUSD'], aCUSDAddress, debtAmount, collateralAmount, minAmount);
		// 		console.log(`###: receipt`, receipt);
		// 	} catch (e) {
		// 		console.log(`###: e`, e)
		// 	}
		//
		// 	return true;
		//
		// });
	});
});


