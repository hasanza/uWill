// SPDX-License-Identifier: MIT

pragma solidity >=0.5.17;

import "./SafeMath.sol";
import "./Ownable.sol";

contract uWill is Ownable {

    using SafeMath for uint256;
    using SafeMath for uint8;

    bool unlocked;
    uint8 pingCount;
    uint8 interval;
    uint8 totalShares;

    address[] heirs;

    mapping(address => uint8) Shares;

    event WillExecuted();
    event ShareCollected(address heir);
    event Ping();

    constructor(address[] memory _heirs, uint8 _interval) public {
        unlocked = false;
        pingCount = 0;
        heirs = _heirs;
        interval = _interval;
    }

    function addHeir(address heir) public onlyOwner {
        heirs.push(heir);
    }

    function removeHeir(address heir) public onlyOwner {
        for (uint256 i; i < heirs.length; i++) {
            if (heirs[i] == heir) {
                //shift places with last heir
                heirs[i] = heirs[heirs.length];
                //remove last heir
                heirs.pop();
            }
        }
    }

    function setShare(address heir, uint8 share) public onlyOwner isHeir(heir) {
        //shares in percentages e.g. 25 means funds x 0.25
        require(totalShares + share <= 100, "Total share % must add up to 100");
        totalShares.add(share);
        Shares[heir] = share;
    }

    modifier isHeir(address heir) {
        bool check = false;
        for (uint256 i; i < heirs.length; i++) {
            if (heir == heirs[i]) {
                check = true;
            }
        }
        require(check, "This address is not an heir");
        _;
    }

    function withdrawShare() public isHeir(msg.sender) {
        require(unlocked);
        msg.sender.transfer(address(this).balance * Shares[msg.sender]);
        emit ShareCollected(msg.sender);
    }

    //called by script at intervals
    function ping() private {
        pingCount.add(1);
        emit Ping();
    }

    function getInterval() public onlyOwner returns (uint8) {
        return interval;
    }

    //if called, signifies owner's life
    function resetPing() public onlyOwner {
        pingCount = 0;
    }

    function unlockFunds() private {
        require(pingCount == 5); //if 3 month interval then 15 months and no ping reset
        unlocked = true;
        emit WillExecuted();
    }
}
