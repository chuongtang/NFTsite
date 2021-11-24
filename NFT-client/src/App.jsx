import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './assets/MyEpicNFT.json';


// styling package
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.61/dist/');
import { SlButton, SlBadge } from '@shoelace-style/shoelace/dist/react';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
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
      setCurrentAccount(account)
    } else {
      console.log("%cNo authorized account found", "color:red")
    }
  }

  // Connect Wallet to site
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("%cConnected","color:blue", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  // Call the smart contract to mint NFT
  const mintNFTfromContract = async () => {
    const CONTRACT_ADDRESS = "0x15D27439B6ae743af3B5B7F27EDc1E7b2A1aCBa0";
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
          console.log("%cGoing to pop wallet now to pay gas...", "color: brown")
          let nftTxn = await connectedContract.makeAnNFT();
  
          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
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
        <h2 className="sub-text">
          Each unique. Each beautiful. Discover your NFT today.
        </h2>

         {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <SlButton onClick={mintNFTfromContract} size="large" type="warning" outline>
              Mint NFT
            </SlButton>
          )}

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