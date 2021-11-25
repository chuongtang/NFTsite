import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './assets/MyEpicNFT.json';


// styling package
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.61/dist/');
import { SlButton, SlBadge, } from '@shoelace-style/shoelace/dist/react';

import Alert from './components/Alert';
import Loader from './components/Loader.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const CONTRACT_ADDRESS = "0xcc6199f2Eaf2995376B9D37C855ec96CA3380d20";
  const [currentAccount, setCurrentAccount] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  const [alertType, setAlertType] = useState("primary");
  const [alertText, setAlertText] = useState("Information Only");
  const [alertIconName, setAlertIconName] = useState("info-circle");

  // Setup our listener.
  const setupEventListener = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);


        // This line ⇩ will "capture" our event when our contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      setShowAlert(true)
      setAlertType("warning");
      setAlertText("Please install Metamask Wallet");
      setAlertIconName("exclamation-triangle");

      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    //Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    //User can have multiple authorized accounts, we grab the first one if its there!

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("%cFound an authorized account:", "color:green", account);
      setCurrentAccount(account);
      setShowAlert(true)
      setAlertType("success");
      setAlertText(`Successfully connect to account: ${account}`);
      setAlertIconName("check2-circle");

      // Check if user connected to the correct network
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        setShowAlert(true)
        setAlertType("danger");
        setAlertText("You are not connected to the Rinkeby Test Network!");
        setAlertIconName("exclamation-octagon");
      }

      // User ALREADY had the wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("%cNo authorized account found", "color:red");
      setShowAlert(true)
      setAlertType("primary");
      setAlertText("No authorized account found, please connect!");
      setAlertIconName("info-circle");
    }
  }

  // Connect Wallet to site
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        setShowAlert(true)
        setAlertType("warning");
        setAlertText("Please install Metamask Wallet");
        setAlertIconName("exclamation-triangle");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("%cConnected", "color:blue", accounts[0]);
      setCurrentAccount(accounts[0]);

      // users connect their wallet for the first time.
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Call the smart contract to mint NFT
  const mintNFTfromContract = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("%cGoing to pop wallet now to pay gas...", "color: brown")
        setShowAlert(true)
        setAlertType("neutral");
        setAlertText("Going to pop wallet now to pay gas...");
        setAlertIconName("gear");
        let nftTxn = await connectedContract.makeAnNFT();

        console.log("Mining...please wait.")
        setShowAlert(true)
        setAlertType("primary");
        setAlertText("Mining transaction on blockchain...please wait.");
        setAlertIconName("boxes");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setShowAlert(true)
        setAlertType("success");
        setAlertText(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setAlertIconName("hand-thumbs-up");

      } else {
        console.log("%cEthereum object doesn't exist!", "color:red");
      }
    } catch (error) {
      console.log(error)
    }
  }



  // Render Methods
  const renderNotConnectedContainer = () => (
    <SlButton type="warning" size="large">
      Connect to Wallet
    </SlButton>
  );


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="-container">
        <header >
          <h1>My <span style={{ "color": "#D97706" }}>NFT</span> Collection</h1>
        </header>
        <h2>
          Each unique. Each beautiful. Discover your NFT today.
        </h2>

        {showAlert && <Alert type={alertType} iconName={alertIconName} text={alertText} />}
        {currentAccount === "" ? (
          renderNotConnectedContainer()
        ) : (
          <SlButton onClick={mintNFTfromContract} size="large" type="warning" outline>
            Mint NFT
          </SlButton>
        )}
        {loading &&  <object type="image/svg+xml" data={Loader} alt="Loading Animation" className="loader"></object> }
        <div className="badge-pulse ftr">
          <SlBadge type="warning" pill pulse>
            <sl-icon name="twitter"></sl-icon>

            <a
              className="sl-color-neutral-0"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`   Happily built on @${TWITTER_HANDLE}`}</a>
          </SlBadge>
        </div>
      </div>
    </div>
  );
};

export default App;