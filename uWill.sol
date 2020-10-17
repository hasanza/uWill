// SPDX-License-Identifier: MIT

pragma solidity ^0.7;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./uWillInterface.sol";

// compound wrapped Eth interface
interface CEth {
    function mint() external payable;
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeemUnderlying(uint) external returns (uint);
    function balanceOfUnderlying(address account) external returns (uint);
}

//getting "conract uWill should be marked as abstract" error for some reason...
contract uWill is uWillInterface, Ownable, CEth {

    using SafeMath for uint256;
    using SafeMath for uint8;

    bool unlocked;
    uint8 pingCount;
    uint8 totalShares;

    Heir[] heirs;

    mapping(address => uint8) Shares;

    event WillExecuted();
    event ShareCollected(string collectingHeir);
    event Ping(uint256 pingCount);

    constructor(Heir[] memory _heirs) public {
        unlocked = false;
        pingCount = 0;
        heirs = _heirs;
    }

    function addHeir(Heir memory heir) public override onlyOwner {
        heirs.push(heir);
    }

    function removeHeir(string memory heirName) public override onlyOwner {
        for (uint256 i; i < heirs.length; i++) {
            if (
                keccak256(abi.encodePacked(heirs[i].name)) ==
                keccak256(abi.encodePacked(heirName))
            ) {
                //shift places with last heir
                heirs[i] = heirs[heirs.length];
                //remove last heir
                heirs.pop();
            }
        }
    }

    function setShare(address heir, uint8 share)
        public
        override
        onlyOwner
        isHeir(heir)
    {
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

    function withdrawShare() public override isHeir(msg.sender) {
        require(unlocked);
        msg.sender.transfer(address(this).balance * Shares[msg.sender]);
        string memory collectingHeir;
        for (uint256 i; i < heirs.length; i++) {
            if (msg.sender == heirs[i].heirAddress) {
                collectingHeir = heirs[i].name;
            }
        }
        emit ShareCollected(collectingHeir);
    }

    //called by script at 3 month intervals for a maximum of 4 times (12months max) before unlocking funds
    function ping() public override onlyOwner {
        pingCount.add(1);
        emit Ping(pingCount);
    }

    function getPingCount() external override view returns (uint8 totalPings) {
        totalPings = pingCount;
    }

    //if called, resets ping count; signifies owner's life
    function resetPing() public override onlyOwner {
        pingCount = 0;
    }

    function unlockFunds() public override onlyOwner {
        require(pingCount == 4); //if 3 month interval then 12 months and no ping reset
        unlocked = true;
        emit WillExecuted();
    }

     function supplyToCompound(address payable _cEtherContractAddress) public onlyOwner override returns(bool supplySuccessful) {
         //reference to eth cEth ctoken contract
         CEth cToken = CEth(_cEtherContractAddress);
        //current exchange rate between Eth cToken and ETH
        uint256 exchangeRate = cToken.exchangeRateCurrent();
        //how much we supplied
        uint supplyRate = cToken.supplyRatePerBlock();
        //supply eth to compound; value is msg.payable
        cToken.mint();
        //returning true to signify complete and successful operation
        supplySuccessful = true;
    }

    function redeemFromCompound(address payable _cEtherContractAddress) public onlyOwner override returns (bool redemptionSuccessful) {
        //reference to eth cEth ctoken contract
         CEth cToken = CEth(_cEtherContractAddress);
        uint256 redeemResult;
        uint256 cTokenBalance = cToken.balanceOfUnderlying(address(this));
        redeemResult = cToken.redeemUnderlying(cTokenBalance);
        if (redeemResult == 0)
            redemptionSuccessful = true;
        else
            redemptionSuccessful = false;
    }

}
