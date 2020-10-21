contract willFactory {

    uWill[] public wills;
    
    function createWill(uWill.Heir[] calldata _heirs, address payable CethAddr) external {
        
        uWill will = new uWill(_heirs, CethAddr);

        emit WillCreated(will, wills.length);

        wills.push(will);
    }

    event WillCreated(uWill will, uint256 willIndex);
}
