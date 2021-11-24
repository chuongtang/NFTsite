const colors= require('colors');

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:".bgGreen, nftContract.address.green);

  // Call the function.
  let txn = await nftContract.makeAnNFT()
  
  // Wait for it to be mined.
  await txn.wait()
 
  // Mint another NFT for fun.
  txn = await nftContract.makeAnNFT()
  
  // Wait for it to be mined.
  await txn.wait()
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error.bgRed);
    process.exit(1);
  }
};

runMain();