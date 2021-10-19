const HelloWorld = artifacts.require('HelloWorld');

contract('HelloWorld', async function([_, wallet]) {
    beforeEach(async function () {
        this.hello_world = await HelloWorld.new();
    });

    describe('Hellow world test', function () {
        it('should work', async function () {
            return true;
        });
    });
});
