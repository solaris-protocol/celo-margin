const { deployContract } = require("@ubeswap/solidity-create2-deployer");
const fs = require('fs/promises');
const path = require('path');
const {networkNames } = require("@ubeswap/hardhat-celo");
require('dotenv/config');

const HelloWorld = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

const salt = "Solaris Margin salt";

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

    const [deployer] = env.celo.getSigners();

    if (!deployer) {
        throw new Error("No deployer.");
    }

    const deployerAddress = await deployer.getAddress();
    console.log("Deployer address: " + deployerAddress);

    console.log("Deploying HelloWorld Contract...");

    const HelloWorldContract = await deployContract({
        salt,
        contractBytecode: HelloWorld.bytecode,
        signer: deployer,
        constructorTypes: ["address"],
        constructorArgs: [await deployer.getAddress()],
    });

    await writeDeployment('HelloWorld', chainId, HelloWorldContract.address);
}

module.exports = {deploy, getDeployment};
