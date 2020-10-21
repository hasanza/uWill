import React, {useState } from "react";
import { ethers } from "ethers";
import styles from "./MakeWill.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MakeWill() {

  const abi = [
    {
      "constant": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "heirAddress",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "share",
              "type": "uint8"
            }
          ],
          "internalType": "struct uWillInterface.Heir[]",
          "name": "_heirs",
          "type": "tuple[]"
        },
        {
          "internalType": "address payable",
          "name": "CethAddr",
          "type": "address"
        }
      ],
      "name": "createWill",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "contract uWill",
          "name": "will",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "willIndex",
          "type": "uint256"
        }
      ],
      "name": "WillCreated",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "wills",
      "outputs": [
        {
          "internalType": "contract uWill",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const uWillFactory = "0x7e770cDcf1bd93e551797945c681F77E3BAbce77";
  const cEthAddress = "0x20572e4c090f15667cf7378e16fad2ea0e2f3eff";
  
  let provider;
  window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
  const signer = provider.getSigner();


const factory = new ethers.Contract(uWillFactory, abi, signer);


  const [willContract, setWillContract] = useState(null);
  const [deployed, setDeployed] = useState(false);
  const [loading, setLoading] = useState(false);

  const makeWill = async () => {
      //call create Will function of factory
      console.log('calling factory with inputs');
      setLoading(true);
      const txCreatingWill = await factory.createWill(["Hasan", "0x2fbD5a00723DbFf461dc1B1Ba6A021FDd2a2Cd7a", 25], cEthAddress);
      setLoading(false);
      console.log('tx hash:, ', txCreatingWill.hash);
  }

  factory.on("WillCreated", (will, willIndex) => {
    setWillContract(will);
    console.log(`This is the ${willIndex}th will contract.`);
  })

  if(loading) {
    return <div className={styles.makeWill}>deploying a will...</div>
  }
  if (!deployed) {
    return (
      <div >
        <div className={styles.makeWill}>
          <h1 style={{ fontSize: "3rem" }}>Make a Will</h1>
          <button className={styles.btn} onClick={makeWill}>
            Deploy Contract
            </button>
        </div>
      </div>
    );
  }
  return (
    //get the current user's/ address' contract 
    <div>
      <h1>Your will address is {willContract}</h1>
    </div>
  )
  
}

export default MakeWill;
