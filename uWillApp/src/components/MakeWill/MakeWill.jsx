import React, {useState } from "react";
import { ethers } from "ethers";
import styles from "./MakeWill.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function MakeWill() {

    const abi = [{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"heirAddress","type":"address"},{"internalType":"uint8","name":"share","type":"uint8"}],"internalType":"struct uWillInterface.Heir[]","name":"_heirs","type":"tuple[]"},{"internalType":"address payable","name":"cEthAddr","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address payable","name":"fallBackAddress","type":"address"}],"name":"FallBackAddressSet","type":"event"},{"anonymous":false,"inputs":[],"name":"FundsFullyDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"HeirRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"heirAddress","type":"address"}],"name":"NewHeirAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"percentageRemaining","type":"uint256"}],"name":"PercentageFundsRemaining","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"percentage","type":"uint8"}],"name":"PercentageShareSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pingCount","type":"uint256"}],"name":"Ping","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReceivedFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cTokensRedeemed","type":"uint256"}],"name":"RedemptionSuccessfull","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"collectingHeir","type":"string"}],"name":"ShareCollectedBy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"suppliedAmount","type":"uint256"}],"name":"SupplySuccessful","type":"event"},{"anonymous":false,"inputs":[],"name":"WillExecuted","type":"event"},{"constant":false,"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"heirAddress","type":"address"},{"internalType":"uint8","name":"share","type":"uint8"}],"internalType":"struct uWillInterface.Heir","name":"heir","type":"tuple"}],"name":"addHeir","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHeirs","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"heirAddress","type":"address"},{"internalType":"uint8","name":"share","type":"uint8"}],"internalType":"struct uWillInterface.Heir[]","name":"_heirs","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPingCount","outputs":[{"internalType":"uint8","name":"totalPings","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"ping","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"redeemFromCompound","outputs":[{"internalType":"bool","name":"redemptionSuccessful","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"heirName","type":"string"}],"name":"removeHeir","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"resetPing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"addr","type":"address"}],"name":"setCEtherContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_fallBackAddr","type":"address"}],"name":"setFallBackAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"heir","type":"address"},{"internalType":"uint8","name":"percentageShare","type":"uint8"}],"name":"setShare","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"supplyToCompound","outputs":[{"internalType":"bool","name":"supplySuccessful","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unlockFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawShare","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
//uWill bytecode (deployed to the blockchain) and abi (provides an interface)
const bytecode = '608060405260405162003564380380620035648339818101604052620000299190810190620005cf565b5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35b6000600060146101000a81548160ff0219169083151502179055506000600060156101000a81548160ff021916908360ff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600090505b82518110156200035b57600360005083828151811015156200018757fe5b602002602001015190806001815401808255809150509060018203906000526020600020906002020160005b90919290919091506000820151816000016000509080519060200190620001dc92919062000365565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff021916908360ff16021790555050505060006005600050600085848151811015156200026057fe5b60200260200101516020015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508281815181101515620002cc57fe5b602002602001015160400151600460005060008584815181101515620002ee57fe5b60200260200101516020015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055505b808060010191505062000169565b505b505062000797565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003a857805160ff1916838001178555620003de565b82800160010185558215620003de579182015b82811115620003dd5782518260005090905591602001919060010190620003bb565b5b509050620003ed9190620003f1565b5090565b6200041d9190620003fd565b80821115620004195760008181506000905550600101620003fd565b5090565b905662000796565b60008151905062000436816200073f565b92915050565b6000815190506200044d816200075c565b92915050565b600082601f8301121515620004685760006000fd5b81516200047f62000479826200065b565b6200062c565b9150818183526020840193506020810190508360005b83811015620004ca5781518601620004ae888262000534565b8452602084019350602083019250505b60018101905062000495565b5050505092915050565b600082601f8301121515620004e95760006000fd5b815162000500620004fa8262000685565b6200062c565b915080825260208301602083018583830111156200051e5760006000fd5b6200052b83828462000708565b50505092915050565b600060608284031215620005485760006000fd5b6200055460606200062c565b9050600082015167ffffffffffffffff811115620005725760006000fd5b6200058084828501620004d4565b6000830152506020620005968482850162000425565b6020830152506040620005ac84828501620005b8565b60408301525092915050565b600081519050620005c98162000779565b92915050565b6000600060408385031215620005e55760006000fd5b600083015167ffffffffffffffff811115620006015760006000fd5b6200060f8582860162000453565b925050602062000622858286016200043c565b9150509250929050565b6000604051905081810181811067ffffffffffffffff82111715620006515760006000fd5b8060405250919050565b600067ffffffffffffffff821115620006745760006000fd5b602082029050602081019050919050565b600067ffffffffffffffff8211156200069e5760006000fd5b601f19601f8301169050602081019050919050565b6000620006c082620006db565b9050919050565b6000620006d482620006db565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600060ff82169050919050565b60005b83811015620007295780820151818401525b6020810190506200070b565b8381111562000739576000848401525b50505050565b6200074a81620006b3565b81141515620007595760006000fd5b50565b6200076781620006c7565b81141515620007765760006000fd5b50565b6200078481620006fb565b81141515620007935760006000fd5b50565b5b612dbd80620007a76000396000f3fe6080604052600436106101025760003560e01c80638f32d59b11610095578063b2165eee11610064578063b2165eee146102b6578063b4d1c485146102e0578063bd87a701146102f8578063cec8f52f14610322578063f2fde38b1461034c57610102565b80638f32d59b1461020857806395a35bfa14610234578063a0481c4114610260578063a9bf32821461028c57610102565b80634eae51f4116100d15780634eae51f4146101805780635c36b186146101ac578063715018a6146101c45780638da5cb5b146101dc57610102565b806302371cee14610108578063243496711461013257806337c594961461014a5780633c4195ed1461016257610102565b60006000fd5b3480156101155760006000fd5b50610130600480360361012b91908101906121fc565b610376565b005b34801561013f5760006000fd5b506101486107e4565b005b3480156101575760006000fd5b50610160610c62565b005b61016a610cd1565b604051610177919061292d565b60405180910390f35b34801561018d5760006000fd5b50610196610e33565b6040516101a3919061290b565b60405180910390f35b3480156101b95760006000fd5b506101c2610fb7565b005b3480156101d15760006000fd5b506101da6110d6565b005b3480156101e95760006000fd5b506101f26111e8565b6040516101ff91906128d5565b60405180910390f35b3480156102155760006000fd5b5061021e611217565b60405161022b919061292d565b60405180910390f35b3480156102415760006000fd5b5061024a611274565b6040516102579190612b10565b60405180910390f35b34801561026d5760006000fd5b5061027661128e565b604051610283919061292d565b60405180910390f35b3480156102995760006000fd5b506102b460048036036102af9190810190612194565b611484565b005b3480156102c35760006000fd5b506102de60048036036102d991908101906121be565b611519565b005b3480156102ed5760006000fd5b506102f6611831565b005b3480156103055760006000fd5b50610320600480360361031b9190810190612194565b6119c5565b005b34801561032f5760006000fd5b5061034a6004803603610345919081019061223f565b611ab3565b005b3480156103595760006000fd5b50610374600480360361036f919081019061216a565b611cd3565b005b61038461121763ffffffff16565b15156103c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103bc90612a5a565b60405180910390fd5b60005b60036000508054905081101561075e57816040516020016103e991906128a7565b604051602081830303815290604052805190602001206000191660036000508281548110151561041557fe5b906000526020600020906002020160005b5060000160005060405160200161043d91906128be565b60405160208183030381529060405280519060200120600019161415610750576004600050600060036000508381548110151561047657fe5b906000526020600020906002020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16600060168282829054906101000a900460ff160392506101000a81548160ff021916908360ff16021790555060006004600050600060036000508481548110151561053b57fe5b906000526020600020906002020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff16021790555060036000506003600050805490508154811015156105dd57fe5b906000526020600020906002020160005b5060036000508281548110151561060157fe5b906000526020600020906002020160005b5060008201600050816000016000509080546001816001161561010002031660029004610640929190611e69565b506001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001820160149054906101000a900460ff168160010160146101000a81548160ff021916908360ff160217905550905050600360005080548015156106e957fe5b600190038181906000526020600020906002020160005b6000820160006107109190611ef0565b6001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160146101000a81549060ff0219169055505090555b5b80806001019150506103c8565b507f2b907e861742459da0e7b9d875b1b77b83157d451e0e6b8ab3bc014072eb71418160405161078e9190612948565b60405180910390a17f1f4a7756bf120af66437dd1398bc65d3de3fd661cf768a1fb0485ba255467c58600060169054906101000a900460ff166064036040516107d79190612af5565b60405180910390a15b5b50565b3360006000905060005b60036000508054905081101561088e5760036000508181548110151561081057fe5b906000526020600020906002020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610880576001915081505b5b80806001019150506107ee565b508015156108d1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108c890612a9a565b60405180910390fd5b600060149054906101000a900460ff161515610922576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091990612a7a565b60405180910390fd5b60001515600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156109ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109b190612a3a565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc6064600460005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1660ff164702811515610a3457fe5b049081150290604051600060405180830381858888f19350505050158015610a61573d600060003e3d6000fd5b506001600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550606060005b600360005080549050811015610c2357600360005081815481101515610ae457fe5b906000526020600020906002020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610c1557600360005081815481101515610b5f57fe5b906000526020600020906002020160005b506000016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c0b5780601f10610be057610100808354040283529160200191610c0b565b820191906000526020600020905b815481529060010190602001808311610bee57829003601f168201915b5050505050915081505b5b8080600101915050610ac2565b507fd08b5c6292957528736ad231bb47b0021916b79015f561e34b8839f4340b5e8281604051610c539190612948565b60405180910390a1505b505b50565b610c7061121763ffffffff16565b1515610cb1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ca890612a5a565b60405180910390fd5b6000600060156101000a81548160ff021916908360ff1602179055505b5b565b6000610ce161121763ffffffff16565b1515610d22576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d1990612a5a565b60405180910390fd5b600034111515610d67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d5e906129ba565b60405180910390fd5b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff16631249c58b6040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610dd75760006000fd5b505af1158015610dec573d600060003e3d6000fd5b505050506001915081507f7e750f32b2e7cdad47550c68e2064aca55b3b8f84d0c45744e8f70ca55da4b3d34604051610e259190612ada565b60405180910390a1505b5b90565b60606003600050805480602002602001604051908101604052809291908181526020016000905b82821015610fab578382906000526020600020906002020160005b50604051806060016040529081600082016000508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f1d5780601f10610ef257610100808354040283529160200191610f1d565b820191906000526020600020905b815481529060010190602001808311610f0057829003601f168201915b505050505081526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160149054906101000a900460ff1660ff1660ff168152602001505081526020019060010190610e5a565b50505050905080505b90565b610fc561121763ffffffff16565b1515611006576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ffd90612a5a565b60405180910390fd5b6004600060159054906101000a900460ff1660ff161115151561105e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161105590612a1a565b60405180910390fd5b6001600060158282829054906101000a900460ff160192506101000a81548160ff021916908360ff1602179055507f48257dc961b6f792c2b78a080dacfed693b660960a702de21cee364e20270e2f600060159054906101000a900460ff166040516110ca9190612af5565b60405180910390a15b5b565b6110e461121763ffffffff16565b1515611125576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111c90612a5a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611214565b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050611271565b90565b6000600060159054906101000a900460ff16905080505b90565b600061129e61121763ffffffff16565b15156112df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112d690612a5a565b60405180910390fd5b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600060008273ffffffffffffffffffffffffffffffffffffffff16633af9e669306040518263ffffffff1660e01b815260040161134391906128d5565b602060405180830381600087803b15801561135e5760006000fd5b505af1158015611373573d600060003e3d6000fd5b505050506040513d601f19601f820116820180604052506113979190810190612282565b90508273ffffffffffffffffffffffffffffffffffffffff1663852a12e3826040518263ffffffff1660e01b81526004016113d29190612ada565b602060405180830381600087803b1580156113ed5760006000fd5b505af1158015611402573d600060003e3d6000fd5b505050506040513d601f19601f820116820180604052506114269190810190612282565b91508150600082141561143e57600193508350611445565b6000935083505b7f73c5fe0de1798b9b41cd002060e47c19fc7a10a30aacedc8d22cda82d87bb2be816040516114749190612ada565b60405180910390a15050505b5b90565b61149261121763ffffffff16565b15156114d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114ca90612a5a565b60405180910390fd5b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b8160006000905060005b6003600050805490508110156115c35760036000508181548110151561154557fe5b906000526020600020906002020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156115b5576001915081505b5b8080600101915050611523565b50801515611606576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115fd90612a9a565b60405180910390fd5b61161461121763ffffffff16565b1515611655576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161164c90612a5a565b60405180910390fd5b606483600060169054906101000a900460ff160160ff161115801561168f5750600083600060169054906101000a900460ff160160ff1610155b15156116d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116c7906129fa565b60405180910390fd5b82600060168282829054906101000a900460ff160192506101000a81548160ff021916908360ff16021790555082600460005060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055507f3c10fbce5311d64653bb6e376ba344ae56815877a4a63fe0519fd7a3ea8061a2836040516117879190612b10565b60405180910390a16000600060169054906101000a900460ff1660640360ff1614156117de577ff422d92ae29bfd0e88747a1112bc44196d1da50b45327c032adc483074d7303860405160405180910390a1611828565b7f1f4a7756bf120af66437dd1398bc65d3de3fd661cf768a1fb0485ba255467c58600060169054906101000a900460ff1660640360405161181f9190612af5565b60405180910390a15b5b5b505b505050565b61183f61121763ffffffff16565b1515611880576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161187790612a5a565b60405180910390fd5b6004600060159054906101000a900460ff1660ff161115156118d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118ce90612aba565b60405180910390fd5b6001600060146101000a81548160ff02191690831515021790555061190061128e63ffffffff16565b506000600060169054906101000a900460ff16606403905060008160ff16111561199457600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc8260ff1647029081150290604051600060405180830381858888f19350505050158015611992573d600060003e3d6000fd5b505b7fa0928469930446397e17f248dffd14546197faa772d745d5ddbc3e328618183a60405160405180910390a1505b5b565b6119d361121763ffffffff16565b1515611a14576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a0b90612a5a565b60405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f192346dbc0542f356a2d918ef00b58723f092494c4d945ec5fea6b330011595d600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051611aa691906128f0565b60405180910390a15b5b50565b611ac161121763ffffffff16565b1515611b02576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611af990612a5a565b60405180910390fd5b6064600060169054906101000a900460ff1660ff16101515611b59576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b50906129da565b60405180910390fd5b60036000508190806001815401808255809150509060018203906000526020600020906002020160005b90919290919091506000820151816000016000509080519060200190611baa929190611f38565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff021916908360ff160217905550505050600060056000506000836020015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611c8d8160200151826040015161151963ffffffff16565b7f655bdccf5f50b3557383dee361c1163753e08dfc8c5f1e9eaf1844639439858c81600001518260200151604051611cc692919061296a565b60405180910390a15b5b50565b611ce161121763ffffffff16565b1515611d22576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d1990612a5a565b60405180910390fd5b611d3181611d3663ffffffff16565b5b5b50565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611da8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d9f9061299a565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611ea25780548555611edf565b82800160010185558215611edf57600052602060002091601f016020900482015b82811115611ede578254825591600101919060010190611ec3565b5b509050611eec9190611fbd565b5090565b50805460018160011615610100020316600290046000825580601f10611f165750611f35565b601f016020900490600052602060002090810190611f349190611fbd565b5b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611f7957805160ff1916838001178555611fac565b82800160010185558215611fac579182015b82811115611fab5782518260005090905591602001919060010190611f8b565b5b509050611fb99190611fbd565b5090565b611fe59190611fc7565b80821115611fe15760008181506000905550600101611fc7565b5090565b9056612d79565b600081359050611ffb81612d11565b92915050565b60008135905061201081612d2b565b92915050565b600082601f830112151561202a5760006000fd5b813561203d61203882612b59565b612b2b565b9150808252602083016020830185838301111561205a5760006000fd5b612065838284612cbd565b50505092915050565b600082601f83011215156120825760006000fd5b813561209561209082612b86565b612b2b565b915080825260208301602083018583830111156120b25760006000fd5b6120bd838284612cbd565b50505092915050565b6000606082840312156120d95760006000fd5b6120e36060612b2b565b9050600082013567ffffffffffffffff8111156121005760006000fd5b61210c84828501612016565b600083015250602061212084828501611fec565b602083015250604061213484828501612155565b60408301525092915050565b60008151905061214f81612d45565b92915050565b60008135905061216481612d5f565b92915050565b60006020828403121561217d5760006000fd5b600061218b84828501611fec565b91505092915050565b6000602082840312156121a75760006000fd5b60006121b584828501612001565b91505092915050565b60006000604083850312156121d35760006000fd5b60006121e185828601611fec565b92505060206121f285828601612155565b9150509250929050565b60006020828403121561220f5760006000fd5b600082013567ffffffffffffffff81111561222a5760006000fd5b6122368482850161206e565b91505092915050565b6000602082840312156122525760006000fd5b600082013567ffffffffffffffff81111561226d5760006000fd5b612279848285016120c6565b91505092915050565b6000602082840312156122955760006000fd5b60006122a384828501612140565b91505092915050565b60006122b8838361281b565b905092915050565b6122c981612c56565b82525050565b6122d881612c44565b82525050565b6122e781612c44565b82525050565b60006122f882612bd8565b6123028185612c06565b93508360208202850161231485612bb3565b8060005b85811015612351578484038952815161233185826122ac565b945061233c83612bf9565b925060208a019950505b600181019050612318565b50829750879550505050505092915050565b61236c81612c68565b82525050565b600061237d82612bee565b6123878185612c28565b9350612397818560208601612ccc565b6123a081612d00565b840191505092915050565b60006123b682612bee565b6123c08185612c39565b93506123d0818560208601612ccc565b80840191505092915050565b60006123e782612be3565b6123f18185612c17565b9350612401818560208601612ccc565b61240a81612d00565b840191505092915050565b600061242082612be3565b61242a8185612c28565b935061243a818560208601612ccc565b61244381612d00565b840191505092915050565b60008154600181166000811461246b5760018114612490576124d5565b607f600283041661247c8187612c39565b955060ff19831686528086019350506124d5565b6002820461249e8187612c39565b95506124a985612bc3565b60005b828110156124cc578154818901526001820191505b6020810190506124ac565b82880195505050505b505092915050565b60006124ea602683612c28565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612550601583612c28565b91507f506c656173652073656e6420736f6d65204554482e00000000000000000000006000830152602082019050919050565b6000612590601583612c28565b91507f4e6f2066756e64732072656d61696e696e672e2e2e00000000000000000000006000830152602082019050919050565b60006125d0603083612c28565b91507f546f74616c2073686172652025206d757374206265206c657373207468616e2060008301527f6f722061646420757020746f20313030000000000000000000000000000000006020830152604082019050919050565b6000612636602083612c28565b91507f46756e6473206861766520616c7265616479206265656e2072656c65617365646000830152602082019050919050565b6000612676602683612c28565b91507f596f75206861766520616c726561647920636f6c6c656374656420796f75722060008301527f73686172652e00000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006126dc602083612c28565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b600061271c602383612c28565b91507f5468652077696c6c20686173206e6f74206265656e206578656375746564207960008301527f65742e00000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000612782601b83612c28565b91507f546869732061646472657373206973206e6f7420616e206865697200000000006000830152602082019050919050565b60006127c2602183612c28565b91507f457865637574696f6e20706572696f64206e6f7420796574207265616368656460008301527f2e000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000606083016000830151848203600086015261283882826123dc565b915050602083015161284d60208601826122cf565b5060408301516128606040860182612889565b508091505092915050565b61287481612c94565b82525050565b61288381612cab565b82525050565b61289281612c9e565b82525050565b6128a181612c9e565b82525050565b60006128b382846123ab565b915081905092915050565b60006128ca828461244e565b915081905092915050565b60006020820190506128ea60008301846122de565b92915050565b600060208201905061290560008301846122c0565b92915050565b6000602082019050818103600083015261292581846122ed565b905092915050565b60006020820190506129426000830184612363565b92915050565b600060208201905081810360008301526129628184612372565b905092915050565b600060408201905081810360008301526129848185612415565b905061299360208301846122de565b9392505050565b600060208201905081810360008301526129b3816124dd565b9050919050565b600060208201905081810360008301526129d381612543565b9050919050565b600060208201905081810360008301526129f381612583565b9050919050565b60006020820190508181036000830152612a13816125c3565b9050919050565b60006020820190508181036000830152612a3381612629565b9050919050565b60006020820190508181036000830152612a5381612669565b9050919050565b60006020820190508181036000830152612a73816126cf565b9050919050565b60006020820190508181036000830152612a938161270f565b9050919050565b60006020820190508181036000830152612ab381612775565b9050919050565b60006020820190508181036000830152612ad3816127b5565b9050919050565b6000602082019050612aef600083018461286b565b92915050565b6000602082019050612b0a600083018461287a565b92915050565b6000602082019050612b256000830184612898565b92915050565b6000604051905081810181811067ffffffffffffffff82111715612b4f5760006000fd5b8060405250919050565b600067ffffffffffffffff821115612b715760006000fd5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff821115612b9e5760006000fd5b601f19601f8301169050602081019050919050565b6000819050602082019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612c4f82612c74565b9050919050565b6000612c6182612c74565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6000612cb682612c9e565b9050919050565b82818337600083830152505050565b60005b83811015612ceb5780820151818401525b602081019050612ccf565b83811115612cfa576000848401525b50505050565b6000601f19601f8301169050919050565b612d1a81612c44565b81141515612d285760006000fd5b50565b612d3481612c56565b81141515612d425760006000fd5b50565b612d4e81612c94565b81141515612d5c5760006000fd5b50565b612d6881612c9e565b81141515612d765760006000fd5b50565bfea365627a7a7231582013b93101a67c673b3d42d1fbbd5be864035dcb7ad1ac19a7405b75458276d5e26c6578706572696d656e74616cf564736f6c63430005110040';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const ContractFactory = ethers.ContractFactory;
//const uWillFactory = "0x7e770cDcf1bd93e551797945c681F77E3BAbce77";
const cEthAddress = "0x20572e4c090f15667cf7378e16fad2ea0e2f3eff";
//this will create a new uWill for each signer i.e. each new addres/ user
const factory = new ethers.ContractFactory(abi, bytecode, signer);

  const [willContract, setWillContract] = useState(null);
  const [deployed, setDeployed] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeWill = async() => {
      setLoading(true);
       const contract = await factory.deploy(["hasan", "0x2fbD5a00723DbFf461dc1B1Ba6A021FDd2a2Cd7a", 25], cEthAddress);
       alert('contract deployed successfully at address: ', contract.address)
       setLoading(false);
  }

  if(loading) {
    return <div>Loading...</div>
  }
  if (!deployed) {
    return (
      <div className={styles.makeWill}>
        <div>
          <h1 style={{ fontSize: "3rem" }}>Make a Will</h1>
          <button>
            Deploy Contract
            </button>
        </div>
      </div>
    );
  }
  return (
    //get the current user's/ address' contract 
    <div>
      Modify your contract...
    </div>
  )
  
}

export default MakeWill;