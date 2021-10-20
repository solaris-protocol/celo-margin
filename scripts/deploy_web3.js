require('dotenv/config');

const HelloWorld = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

const deploy = async (_, env) => {
    const kit = env.celo.kit;

    if (!kit) return;

    const chainId = await kit.connection.chainId();
    const private_key = process.env.PRIVATE_KEY || '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';

    const account = kit.web3.eth.accounts.privateKeyToAccount(private_key);
    console.log(`###: account`, account.address);

    kit.connection.addAccount(account.privateKey);

    let tx = await kit.connection.sendTransaction({
        from: account.address,
        data: HelloWorld.bytecode
    });

    const receipt = await tx.waitReceipt();
    console.log(receipt);
}

module.exports = {deploy};
