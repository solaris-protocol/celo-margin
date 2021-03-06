const { deployContract } = require("@ubeswap/solidity-create2-deployer");
const fs = require('fs/promises');
const path = require('path');
const {networkNames } = require("@ubeswap/hardhat-celo");
require('dotenv/config');

const {getMoolaV2LendingPoolAddressProvider, getMoolaV2Oracle, getUbeswapRouterAddress, getMoolaV2ProtocolDataProvider} = require("../constants");

const SolarisMargin = require("../artifacts/contracts/SolarisMargin.sol/SolarisMargin.json");

const salt = "Solaris Margin 1111111";

const makeConfigPath = (contractName, chainId) => path.resolve(__dirname, `../ui/src/deployments/${contractName}.${networkNames[chainId]}.address.json`);

const writeDeployment = async (contractName, chainId, address) => {
    const configPath = makeConfigPath(contractName, chainId);
    console.log(`${contractName}: ${address}`);
    await fs.writeFile(configPath, JSON.stringify({address}, null, 2));
};

const getDeployment = async (contractName, chainId) => {
    const configPath = makeConfigPath(contractName, chainId);
    return JSON.parse((await fs.readFile(configPath)).toString());
};

const deploy = async (_, env) => {
    const chainId = await env.celo.kit.connection.chainId();
    const moolaV2LendingPoolAddressProvider = getMoolaV2LendingPoolAddressProvider(networkNames[chainId]);
    const mooldaV2ProtocolDataProvider = getMoolaV2ProtocolDataProvider(networkNames[chainId]);
    const ubeswapRouterAddress = getUbeswapRouterAddress(networkNames[chainId]);

    const [deployer] = env.celo.getSigners();

    if (!deployer) {
        throw new Error("No deployer.");
    }

    const deployerAddress = await deployer.getAddress();
    console.log("Deployer address: " + deployerAddress);

    console.log("Deploying SolarisMargin Contract...");

    const SolarisMarginContract = await deployContract({
        salt,
        contractBytecode: SolarisMargin.bytecode,
        signer: deployer,
        constructorTypes: ["address", "address", "address"],
        constructorArgs: [moolaV2LendingPoolAddressProvider, mooldaV2ProtocolDataProvider, ubeswapRouterAddress],
    });

    await writeDeployment('SolarisMargin', chainId, SolarisMarginContract.address);
}

module.exports = {deploy, getDeployment};
