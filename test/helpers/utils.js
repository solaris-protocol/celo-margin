const { BN, ether } = require('@openzeppelin/test-helpers');

function price (val) {
    return ether(val).toString();
}

function toBN (num) {
    return new BN(num);
}

module.exports = {
    price,
    toBN,
};
