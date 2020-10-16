// SPDX-License-Identifier: MIT

pragma solidity >=0.6.17;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./uWillInterface.sol";

contract uWill is uWillInterface, Ownable {

    using SafeMath for uint256;
    using SafeMath for uint8;

    bool unlocked;
    uint8 pingCount;
    uint8 totalShares;

    Heir[] heirs;

    mapping(address => uint8) Shares;



    event WillExecuted ();
    event ShareCollected(string collectingHeir);
    event Ping(uint pingCount);

    constructor(Heir[] memory _heirs) public{
        unlocked = false;
        pingCount = 0;
        heirs = _heirs;
    }

    function addHeir(Heir memory heir) public onlyOwner override{
        heirs.push(heir);
    }

    function removeHeir(string memory heirName) public onlyOwner override{
        for (uint256 i; i < heirs.length; i++) {
            if (keccak256(abi.encodePacked(heirs[i].name)) == keccak256(abi.encodePacked(heirName))) {
                //shift places with last heir
                heirs[i] = heirs[heirs.length];
                //remove last heir
                heirs.pop();
            }
        }
    }

    function setShare(address heir, uint8 share) public onlyOwner isHeir(heir) override{
        //shares in percentages e.g. 25 means funds x 0.25
        require(totalShares + share <= 100, "Total share % must add up to 100");
        totalShares.add(share);
        Shares[heir] = share;
    }

    modifier isHeir(address _heirAddress) {
        bool check = false;
        for (uint256 i; i < heirs.length; i++) {
            if (_heirAddress == heirs[i].heirAddress) {
                check = true;
            }
        }
        require(check, "This address is not an heir");
        _;
    }

    function withdrawShare() public isHeir(msg.sender) override{
        require(unlocked);
        msg.sender.transfer(address(this).balance * Shares[msg.sender]);
        string memory collectingHeir;
        for (uint i; i<heirs.length; i++) {
            if(msg.sender == heirs[i].heirAddress){
                collectingHeir = heirs[i].name;
            }
        }
        emit ShareCollected(collectingHeir);
    }

    //called by script at 3 month intervals for a maximum of 4 times (12months max) before unlocking funds
    function ping() public onlyOwner override {
        pingCount.add(1);
        emit Ping(pingCount);
    }

    //if called, signifies owner's life
    function resetPing() public onlyOwner override {
        pingCount = 0;
    }

    function unlockFunds() public onlyOwner override{
        require(pingCount == 4); //if 3 month interval then 15 months and no ping reset
        unlocked = true;
        emit WillExecuted();
    }
}
