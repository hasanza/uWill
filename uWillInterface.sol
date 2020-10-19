// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;

interface uWillInterface {

    /**
     * @dev adds an address to the heir address array
     */
    function addHeir(Heir memory heir) external;

    /**
     * @dev adds an address to the heir address array
     */
    function removeHeir(string memory heirName) external;

    /**
     * @dev sets the share of an heir in the heir=>share Share mapping.
     */
    function setShare(address heir, uint8 share) external;

    /**
     * @dev Adds 1 to ping uint every 3 months
     */
    function ping() external;

    /**
     * @dev returns the current pingCount
     */
    function getPingCount() external returns(uint8);

    /**
     * @dev resets uint ping to 0;
     * emits a Ping event
     */
    function resetPing() external;

    /**
     * @dev sets unlock state to true;
     * emits a FundsUnlocked event
     */
    function unlockFunds() external;

    /**
     * @dev Releases fund as per share to msg.sender if found to be in heirs array
     * Requires unlock state to be true
     * emits a Claim event
     */
    function withdrawShare() external;

    /**
     * @dev supplies all available ETH to compound, getting cEth tokens in return
     * 
     */
    function supplyToCompound(address payable _cEtherContractAddress) external returns (bool supplySuccessful);

     /**
     * @dev redeems the cEth tokens for ETH
     * 
     */
    function redeemFromCompound(address payable _cEtherContractAddress) external returns (bool redemptionSuccessful);
    
}
