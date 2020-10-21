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
    }

    /**
     * @dev adds an address to the heir address array
     */
    function addHeir(Heir calldata heir) external;

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
    function setShare(address heir, uint8 share) external;
    
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
    mapping(address => bool) ShareCollected;

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

    constructor(Heir[] memory _heirs, address payable cEthAddr) public payable {
        unlocked = false;
        pingCount = 0;
        cEtherContractAddress = cEthAddr;
        for (uint i=0; i<_heirs.length; i++){
            heirs.push(_heirs[i]);
            ShareCollected[_heirs[i].heirAddress] = false;
            Shares[_heirs[i].heirAddress] = _heirs[i].share;
        }
    }
    
    function setCEtherContractAddress (address payable addr) public {
        cEtherContractAddress = addr;
    }

    function addHeir(Heir memory heir) public {
        require(percentageSharesDistributed < 100, 'No funds remaining...');
        heirs.push(heir);
        ShareCollected[heir.heirAddress] = false;
        setShare(heir.heirAddress, heir.share);
        emit NewHeirAdded(heir.name, heir.heirAddress);
    }

    function removeHeir(string memory heirName) public {
        
        for (uint256 i; i < heirs.length; i++) {
            if (
                keccak256(abi.encodePacked(heirs[i].name)) ==
                keccak256(abi.encodePacked(heirName))
            ) {
                //deduct share from percentageSharesDistributed;
                percentageSharesDistributed -= Shares[heirs[i].heirAddress];
                //remove share
                Shares[heirs[i].heirAddress] = 0;
                //shift places with last heir
                heirs[i] = heirs[heirs.length];
                //remove last heir
                heirs.pop();
            }
        }
        emit HeirRemoved (heirName);
        emit PercentageFundsRemaining(100 - percentageSharesDistributed);
    }
    
    function getHeirs() external view returns (Heir[] memory _heirs) {
        _heirs = heirs;
    }

    function setShare(address heir, uint8 percentageShare)
        public
        isHeir(heir)
    {
        //shares in percentages e.g. 25 means funds x 0.25
        require(percentageSharesDistributed + percentageShare <= 100 && percentageSharesDistributed + percentageShare >= 0, "Total share % must be less than or add up to 100");
        percentageSharesDistributed += percentageShare;
        Shares[heir] = percentageShare;
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

    function withdrawShare() public isHeir(msg.sender) {
        require(unlocked);
        require(ShareCollected[msg.sender] == false);
        msg.sender.transfer(address(this).balance * Shares[msg.sender] / 100);
        ShareCollected[msg.sender] = true;
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

     function supplyToCompound() payable public returns(bool supplySuccessful) {
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

