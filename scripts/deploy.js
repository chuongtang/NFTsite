const colors= require('colors');

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:".bgMagenta, nftContract.address.magenta);

  // Call the function.
  let txn = await nftContract.makeAnNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #1 with tokenID 0".red)

  // txn = await nftContract.makeAnNFT()
  // // Wait for it to be mined.
  // await txn.wait()
  // console.log("Minted NFT #2".red)
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