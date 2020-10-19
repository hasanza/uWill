// SPDX-License-Identifier: MIT

pragma solidity ^0.7;
pragma experimental ABIEncoderV2;

import "./uWill.sol";

//contract called whenever a new user creates a will
//creates a new will and adds it to a uWill type array 

contract willFactory {

    uWill[] public wills;
    function createWill(Heir[] memory _heirs) external {
        uWill will = new uWill(_heirs);

        emit WillCreated(will, wills.length);

        wills.push(will);
    }

    event WillCreated(uWill will, uint256 willIndex);
}