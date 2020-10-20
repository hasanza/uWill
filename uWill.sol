// SPDX-License-Identifier: MIT

pragma solidity ^0.7;
pragma experimental ABIEncoderV2;

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be aplied to your functions to restrict their use to
 * the owner.
 */

 //abstract contracts are those where atleast one function lacks implemention; the deriving contract implments it
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * > Note: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

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

contract willFactory {

    uWill[] public wills;
    
    function createWill(Heir[] calldata _heirs) external {
        
        uWill will = new uWill(_heirs);

        emit WillCreated(will, wills.length);

        wills.push(will);
    }

    event WillCreated(uWill will, uint256 willIndex);
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
