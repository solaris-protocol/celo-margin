require('dotenv/config');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('hardhat-deploy');
require('hardhat-gas-reporter');
require('hardhat-abi-exporter');
require('@ubeswap/hardhat-celo');
require('hardhat-spdx-license-identifier');
require('hardhat-watcher');
const { fornoURLs, ICeloNetwork } = require('@ubeswap/hardhat-celo');
const { removeConsoleLog } = require('hardhat-preprocessor');
const {task} = require('hardhat/config');
const {deploy} = require('./scripts/deploy.js');

task(
    "deploy",
    "Deploys a contract",
    async (...args) => {
    return await deploy(...args);
});

const accounts = {
    mnemonic:
        process.env.MNEMONIC ||
        'test test test test test test test test test test test junk',
    path: 'm/44\'/52752\'/0\'/0/',
};

module.exports = {
    abiExporter: {
        path: './ui/src/abis/margin',
        // clear: true,
        flat: true,
        // only: [],
        // except: []
    },
    defaultNetwork: 'hardhat',
    gasReporter: {
        enable: true,
        currency: 'USD',
    },
    networks: {
        mainnet: {
            url: fornoURLs[ICeloNetwork.MAINNET],
            accounts,
            chainId: ICeloNetwork.MAINNET,
            live: true,
            gasPrice: 0.5 * 10 ** 9,
            gas: 8000000,
        },
        alfajores: {
            url: fornoURLs[ICeloNetwork.ALFAJORES],
            accounts,
            chainId: ICeloNetwork.ALFAJORES,
            live: true,
            gasPrice: 0.5 * 10 ** 9,
            gas: 8000000,
        },
        hardhat: {
            chainId: 31337,
            accounts,
        },
    },
    paths: {
        cache: './cache',
        tests: './test',
        sources: './contracts',
        artifacts: './artifacts',
    },
    preprocess: {
        eachLine: removeConsoleLog(
            (bre) =>
                bre.network.name !== 'hardhat' && bre.network.name !== 'localhost',
        ),
    },
    solidity: {
        compilers: [
            {
                version: '0.8.4',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 5000,
                    },
                },
            },
        ],
    },
    spdxLicenseIdentifier: {
        overwrite: false,
        runOnCompile: true,
    },
    watcher: {
        compile: {
            tasks: ['compile'],
            files: ['./contracts'],
            verbose: true,
        },
    },
    mocha: {
        timeout: 200000,
    },
};
