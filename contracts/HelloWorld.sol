// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string private _name = "Celo";

    function getName() public view returns (string memory) {
        return _name;
    }

    function setName(string calldata newName) external {
        _name = newName;
    }
}
