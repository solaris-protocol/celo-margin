const getMoolaV2LendingPoolAddressProvider = (networkName) => {
    switch (networkName) {
        case 'mainnet':
            return '0xD1088091A174d33412a968Fa34Cb67131188B332';
        case 'alfajores':
            return '0xb3072f5F0d5e8B9036aEC29F37baB70E86EA0018';
        default:
            return '0xD1088091A174d33412a968Fa34Cb67131188B332';
    }
}

const getUbeswapRouterAddress = (networkName) => {
    switch (networkName) {
        case 'mainnet':
            return '0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121';
        case 'alfajores':
            return '0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121';
        default:
            return '0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121';
    }
}

const getMoolaV2ProtocolDataProvider = (networkName) => {
    switch (networkName) {
        case 'mainnet':
            return '0x43d067ed784D9DD2ffEda73775e2CC4c560103A1';
        case 'alfajores':
            return '0x31ccB9dC068058672D96E92BAf96B1607855822E';
        default:
            return '0x43d067ed784D9DD2ffEda73775e2CC4c560103A1';
    }
}

const getMoolaV2Oracle = (networkName) => {
    switch (networkName) {
        case 'mainnet':
            return '0xaA6e0F0B63287EAC5DDBEefd1f133Fc7F554ee9b';
        case 'alfajores':
            return '0x88A4a87eF224D8b1F463708D0CD62b17De593DAd';
        default:
            return '0xaA6e0F0B63287EAC5DDBEefd1f133Fc7F554ee9b';
    }
}

module.exports = {
    getMoolaV2LendingPoolAddressProvider,
    getUbeswapRouterAddress,
    getMoolaV2ProtocolDataProvider,
    getMoolaV2Oracle
}
