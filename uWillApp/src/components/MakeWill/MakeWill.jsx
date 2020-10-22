import React, { useState, useEffect } from "react";
import styles from "./MakeWill.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { Button, Card, Text, Icon, Loader, Input, Heading } from "rimble-ui";
import {HeirList} from '../';

//abi of the factory contract, will call the createWill function from here
const factoryAbi = [
  {
    constant: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "heirAddress",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "share",
            type: "uint8",
          },
        ],
        internalType: "struct uWillInterface.Heir[]",
        name: "_heirs",
        type: "tuple[]",
      },
      {
        internalType: "address payable",
        name: "CethAddr",
        type: "address",
      },
    ],
    name: "createWill",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract uWill",
        name: "will",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "willIndex",
        type: "uint256",
      },
    ],
    name: "WillCreated",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wills",
    outputs: [
      {
        internalType: "contract uWill",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const willAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "heirAddress", type: "address" },
          { internalType: "uint8", name: "share", type: "uint8" },
        ],
        internalType: "struct uWillInterface.Heir[]",
        name: "_heirs",
        type: "tuple[]",
      },
      { internalType: "address payable", name: "cEthAddr", type: "address" },
    ],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address payable",
        name: "fallBackAddress",
        type: "address",
      },
    ],
    name: "FallBackAddressSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "FundsFullyDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "HeirRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "address",
        name: "heirAddress",
        type: "address",
      },
    ],
    name: "NewHeirAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "percentageRemaining",
        type: "uint256",
      },
    ],
    name: "PercentageFundsRemaining",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "percentage",
        type: "uint8",
      },
    ],
    name: "PercentageShareSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pingCount",
        type: "uint256",
      },
    ],
    name: "Ping",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cTokensRedeemed",
        type: "uint256",
      },
    ],
    name: "RedemptionSuccessfull",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "collectingHeir",
        type: "string",
      },
    ],
    name: "ShareCollectedBy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "suppliedAmount",
        type: "uint256",
      },
    ],
    name: "SupplySuccessful",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "WillExecuted", type: "event" },
  {
    constant: false,
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "heirAddress", type: "address" },
          { internalType: "uint8", name: "share", type: "uint8" },
        ],
        internalType: "struct uWillInterface.Heir",
        name: "heir",
        type: "tuple",
      },
    ],
    name: "addHeir",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getHeirs",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "heirAddress", type: "address" },
          { internalType: "uint8", name: "share", type: "uint8" },
        ],
        internalType: "struct uWillInterface.Heir[]",
        name: "_heirs",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getPingCount",
    outputs: [{ internalType: "uint8", name: "totalPings", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "ping",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "redeemFromCompound",
    outputs: [
      { internalType: "bool", name: "redemptionSuccessful", type: "bool" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "string", name: "heirName", type: "string" }],
    name: "removeHeir",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "resetPing",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address payable", name: "addr", type: "address" },
    ],
    name: "setCEtherContractAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address payable",
        name: "_fallBackAddr",
        type: "address",
      },
    ],
    name: "setFallBackAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "heir", type: "address" },
      { internalType: "uint8", name: "percentageShare", type: "uint8" },
    ],
    name: "setShare",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "supplyToCompound",
    outputs: [{ internalType: "bool", name: "supplySuccessful", type: "bool" }],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unlockFunds",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawShare",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const uWillFactory = "0x7e770cDcf1bd93e551797945c681F77E3BAbce77";
const cEthAddress = "0x20572e4c090f15667cf7378e16fad2ea0e2f3eff";

function MakeWill() {
  const [willContract, setWillContract] = useState("");
  const [signer, setSigner] = useState({});
  const [provider, setProvider] = useState({});
  const [deployed, setDeployed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState(0);

  const [nameInput, setNameInput] = useState([""]);
  const [addressInput, setAddressInput] = useState([""]);
  const [shareInput, setShareInput] = useState([0]);
  const [heirs, setHeirs] = useState([]);
  const [heir, setHeir] = useState([]);
  

  //[["name", "addr", share], ...]

  // const [heirName, setHeirName] = useState("");
  // const [heirAddress, setHeirAddress] = useState("");
  // const [heirShare, setHeirShare] = useState(0);

  const onNameChange = (e) => {
    setNameInput(e.target.value);
  };
  const onAddrChange = (e) => {
    setAddressInput(e.target.value);
  };
  const onShareChange = (e) => {
    setShareInput(e.target.value);
  };

  const onAddHeir = () => {
    //add the name, addr and share to heir array and push it to heirs array
    //push nameinput, addressinput and share unput to heir array
    let _heir = [nameInput, addressInput, shareInput];
    setHeir(_heir);
    console.log('heir is', heir);
    //get current heirs
    let _heirs = heirs;
    console.log('heirs are: ', heirs);
    //push new heir array
    _heirs.push(heir);
    setHeirs(heirs);
    console.log(heirs);
  }

  const onHeirSubmit = async () => {
    //send name, addr, share and cTokenAddr to createWill func
    //receive the WillCreated event and show Toast + set willAddress
  };

  const gotProvider = () => toast.dark("Connected to Provider");

  const getBlock = async () => {
    let n = await provider.getBalance(cEthAddress);
    setBlock(ethers.utils.formatEther(n));
  };

  useEffect(() => {
    //get the web3 object form the provider i.e. metamask
    const init = async () => {
      try {
        let provider1 = new ethers.providers.Web3Provider(window.ethereum);
        let signer1 = provider1.getSigner();
        setProvider(provider1);
        setSigner(signer1);
        console.log("Successfully set provider and signer", signer, provider);
        if (provider && signer) {
          gotProvider();
        }
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);

  if (loading) {
    return <div className={styles.makeWill}>deploying a will...</div>;
  }
  //if a will contract has been deployed for this address
  if (!willContract) {
    return (
      <div>
        <div className={styles.makeWill}>
          <div>
            <Heading as={"h1"} style={{ fontSize: "3rem" }}>
              Make a Will
            </Heading>
            <Card bg="black" color="white" maxWidth={"300px"}>
              <Text>{block}</Text>
            </Card>
            <button onClick={getBlock}>Get Balance</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            Heir Name
            <Input
              style={{ marginBottom: "10px" }}
              type="text"
              name="Heir Name"
              required={true}
              placeholder="Heir Name ..."
              onChange = {onNameChange}
            />
            Heir Address
            <Input
              style={{ marginBottom: "10px" }}
              type="text"
              name="Heir Address"
              required={true}
              placeholder="Heir Address ..."
              onChange = {onAddrChange}

            />
            Heir Share
            <Input
              style={{ marginBottom: "10px" }}
              type="text"
              name="Heir Share"
              required={true}
              placeholder="Heir Share % (1 to 100) ..."
              onChange = {onShareChange}
            />
            <button className={styles.btn} onClick={onAddHeir}>Add Heir</button>
          </div>
        </div>
        {(() => {
          if (heirs.length > 0) {
            return <HeirList props={heirs}/>
          }
        })}
        <ToastContainer />
      </div>
    );
  }
  return (
    //get the current user's/ address' contract
    <div>
      <h1>Your will address is {willContract}</h1>
      <div className={styles.makeWill}>
        <Input
          style={{ marginBottom: "10px" }}
          type="text"
          name="Heir Name"
          required={true}
          placeholder="Heir Name and Address..."
        />
        <Button size={"large"}>Add Heir</Button>
        <Input
          style={{ marginBottom: "10px" }}
          type="text"
          name="Heir Address"
          required={true}
          placeholder="Heir Name ..."
        />
        <Button size={"large"}>Remove Heir</Button>
        <Input
          style={{ marginBottom: "10px" }}
          type="text"
          name="Heir Share"
          required={true}
          placeholder="Heir Share % (1 to 100) ..."
        />
        <Button className={styles.btn} size={"large"}>Set Share</Button>
      </div>
    </div>
  );
}

export default MakeWill;
