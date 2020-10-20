pragma solidity >=0.7;
pragma experimental ABIEncoderV2;

import "./uWill.sol";

contract willFactory {

    uWill[] public wills;
    
    function createWill(Heir[] calldata _heirs) external {
        
        uWill will = new uWill(_heirs);

        emit WillCreated(will, wills.length);

        wills.push(will);
    }

    event WillCreated(uWill will, uint256 willIndex);
}