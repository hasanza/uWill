// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;

interface uWillInterface {
    
    struct Heir {
        string name;
        address heirAddress;
    }

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

    // function getInterval() external returns (uint8);

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
}
