const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("Deploying GMONAD contract to Monad testnet...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MON");

  // Deploy the contract
  const GMONAD = await hre.ethers.getContractFactory("GMONAD");
  
  // Base URI for metadata (can be updated later)
  const baseURI = "https://api.gmonad.xyz/metadata/";
  
  const gmonad = await GMONAD.deploy(deployer.address, baseURI);
  
  await gmonad.waitForDeployment();
  
  const contractAddress = await gmonad.getAddress();
  console.log("GMONAD contract deployed to:", contractAddress);
  
  // Verify deployment
  console.log("Verifying deployment...");
  const owner = await gmonad.owner();
  const mintPrice = await gmonad.MINT_PRICE();
  const nextTokenId = await gmonad.getNextTokenId();
  
  console.log("Contract owner:", owner);
  console.log("Mint price:", hre.ethers.formatEther(mintPrice), "MON");
  console.log("Next token ID:", nextTokenId.toString());
  
  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Monad Testnet");
  console.log("Explorer:", `https://testnet.monadexplorer.com/address/${contractAddress}`);
  console.log("Owner:", owner);
  console.log("Mint Price: 1 MON");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "monadTestnet",
    chainId: 10143,
    owner: owner,
    mintPrice: "1000000000000000000", // 1 ether in wei
    deployedAt: new Date().toISOString(),
    explorerUrl: `https://testnet.monadexplorer.com/address/${contractAddress}`
  };
  
  fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

