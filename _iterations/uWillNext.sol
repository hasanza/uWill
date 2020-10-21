// SPDX-License-Identifier: MIT

pragma solidity >=0.5;
pragma experimental ABIEncoderV2;

// compound wrapped Eth interface
interface CEth {
    function mint() external payable;
    function redeemUnderlying(uint) external returns (uint);
    function balanceOfUnderlying(address account) external returns (uint);
}

interface uWillInterface {

    struct Heir {
        string name;
        address heirAddress;
        uint8 share;
        bool collected;
    }

    /**
     * @dev adds an address to the heir address array
     */
    function addHeir(Heir calldata heir, uint8 percentageShare) external;

    /**
     * @dev adds an address to the heir address array
     */
    function removeHeir(string calldata heirName) external;
    
     /**
     * @dev returns the heirs array
     */
    function getHeirs() external view returns (Heir[] memory _heirs);

    /**
     * @dev sets the share of an heir in the heir=>share Share mapping.
     */
    function setShare(string calldata heirName, uint8 percentageShare) external;
    
    /**
     * @dev sets address where funds go if not fully distributed
     */
    function setFallBackAddress(address payable _fallBackAddr) external;

    /**
     * @dev Adds 1 to ping uint every 3 months
     */
    function ping() external;

    /**
     * @dev returns the current pingCount
     */
    function getPingCount() external view returns(uint8);

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
    function supplyToCompound() external payable returns (bool supplySuccessful);

     /**
     * @dev redeems the cEth tokens for ETH
     * 
     */
    function redeemFromCompound() external returns (bool redemptionSuccessful);
    
}

//getting "conract uWill should be marked as abstract" error for some reason...
contract uWill is uWillInterface {

    bool unlocked;
    uint8 pingCount;
    uint8 percentageSharesDistributed;
    address payable fallBackAddress;
    address payable cEtherContractAddress;

    Heir[] heirs;

    mapping(address => uint8) Shares;

    event WillExecuted();
    event ShareCollectedBy(string collectingHeir);
    event Ping(uint256 pingCount);
    event NewHeirAdded(string name, address heirAddress);
    event HeirRemoved(string name);
    event PercentageShareSet(uint8 percentage);
    event ReceivedFunds(uint256 amount);
    event SupplySuccessful(uint256 suppliedAmount);
    event RedemptionSuccessfull(uint256 cTokensRedeemed);
    event FundsFullyDistributed();
    event PercentageFundsRemaining(uint256 percentageRemaining);
    event FallBackAddressSet(address payable fallBackAddress);

    constructor(Heir[] memory _heirs) public {
        unlocked = false;
        pingCount = 0;
        cEtherContractAddress = 0x20572e4c090f15667cF7378e16FaD2eA0e2f3EfF;
        for (uint i=0; i<_heirs.length; i++){
            heirs.push(_heirs[i]);
        }
        supplyToCompound();
    }
    
    function setCEtherContractAddress (address payable addr) public {
        cEtherContractAddress = addr;
    }

    function addHeir(Heir memory heir, uint8 percentageShare) public {
        require(percentageSharesDistributed < 100, "No funds remaining...");
        heir.collected = false;
        heir.share = percentageShare;
        heirs.push(heir);
        emit NewHeirAdded(heir.name, heir.heirAddress);
    }

    function removeHeir(string memory heirName) public {
        
        for (uint256 i; i < heirs.length; i++) {
            if (
                keccak256(abi.encodePacked(heirs[i].name)) ==
                keccak256(abi.encodePacked(heirName))
            ) {
                //deduct share from percentageSharesDistributed;
                percentageSharesDistributed -= heirs[i].share;
                //shift places with last heir
                heirs[i] = heirs[heirs.length];
                //remove last heir
                heirs.pop();
            }
        }
        emit HeirRemoved (heirName);
    }
    
    function getHeirs() external view returns (Heir[] memory _heirs) {
        _heirs = heirs;
    }

    function setShare(string memory heirName, uint8 percentageShare)
        public
        isHeir(heirName, address(0))
    {
        //shares in percentages e.g. 25 means funds x 0.25
        require(percentageSharesDistributed + percentageShare <= 100 && percentageSharesDistributed + percentageShare > 0, "Total share % must be less than or add up to 100");
        percentageSharesDistributed += percentageShare;
        for (uint i; i < heirs.length; i++) {
            if (keccak256(abi.encodePacked(heirs[i].name)) ==
                keccak256(abi.encodePacked(heirName))) {
                heirs[i].share = percentageShare;
            }
        }
        emit PercentageShareSet(percentageShare);
        //check if funds remain
        
        if (100 - percentageSharesDistributed == 0){
            emit FundsFullyDistributed();
        } else {
            emit PercentageFundsRemaining(100 - percentageSharesDistributed);
        }
    }
    
    function setFallBackAddress(address payable _fallBackAddr) public {
        fallBackAddress = _fallBackAddr;
        emit FallBackAddressSet(fallBackAddress);
    }

    modifier isHeir(string memory heirName, address heirAddr) {
        bool check = false;
        for (uint256 i; i < heirs.length; i++) {
            if (heirAddr == heirs[i].heirAddress || keccak256(abi.encodePacked(heirs[i].name)) ==
                keccak256(abi.encodePacked(heirName))) {
                check = true;
            }
        }
        require(check, "This address is not an heir");
        _;
    }

    function withdrawShare() public isHeir("", msg.sender){
        require(unlocked);
        Heir memory heir;
        for(uint i; i<heirs.length; i++) {
            if (msg.sender == heirs[i].heirAddress && heirs[i].collected == false) {
                heir = heirs[i];
            }
        }
        require(heir.collected ==  false, "You have collected your share.");
        msg.sender.transfer(address(this).balance * heir.share / 100);
        heir.collected = true;
        string memory collectingHeir;
        for (uint256 i; i < heirs.length; i++) {
            if (msg.sender == heirs[i].heirAddress) {
                collectingHeir = heirs[i].name;
            }
        }
        emit ShareCollectedBy(collectingHeir);
    }

    //called by script at 3 month intervals for a maximum of 4 times (12months max) before unlocking funds
    function ping() public {
        require(pingCount <=4, "Funds have already been released");
        pingCount += 1;
        emit Ping(pingCount);
    }

    function getPingCount() external view returns (uint8 totalPings) {
        totalPings = pingCount;
    }

    //if called, resets ping count; signifies owner's life
    function resetPing() public {
        pingCount = 0;
    }

    function unlockFunds() public  {
        require(pingCount > 4, "Execution period not yet reached."); //if 3 month interval then 12 months and no ping reset
        unlocked = true;
        redeemFromCompound();
        uint8 remainingPercentageShares = 100 - percentageSharesDistributed;
        if (remainingPercentageShares > 0) {
            //send it to fallback address
            fallBackAddress.transfer(address(this).balance * remainingPercentageShares);
        }
        emit WillExecuted();
    }

     function supplyToCompound() public payable returns(bool supplySuccessful) {
         require(msg.value > 0, "Please send some ETH.");
         //reference to eth cEth ctoken contract
         CEth cToken = CEth(cEtherContractAddress);
        //supply eth to compound; value is msg.payable
        cToken.mint();
        //returning true to signify complete and successful operation
        supplySuccessful = true;
        emit SupplySuccessful(msg.value);
    }

    function redeemFromCompound() public  returns (bool redemptionSuccessful) {
        //reference to eth cEth ctoken contract
         CEth cToken = CEth(cEtherContractAddress);
        uint256 redeemResult;
        uint256 cTokenBalance = cToken.balanceOfUnderlying(address(this));
        redeemResult = cToken.redeemUnderlying(cTokenBalance);
        if (redeemResult == 0)
            redemptionSuccessful = true;
        else
            redemptionSuccessful = false;
            emit RedemptionSuccessfull(cTokenBalance);
    }
    
    function() external payable {
        emit ReceivedFunds (msg.value);
    }
    

}

contract willFactory is uWill {
    
    uWill[] public wills;
    
    function createWill(Heir[] calldata _heirs) external {
        
        uWill will = new uWill(_heirs);

        emit WillCreated(will, wills.length);

        wills.push(will);
    }

    event WillCreated(uWill will, uint256 willIndex);
}

