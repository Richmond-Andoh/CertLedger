const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting deployment of CertificateVerification contract...");
  
  // Get contract factory
  const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
  
  // Deploy contract
  console.log("Deploying CertificateVerification contract...");
  const certificateVerification = await CertificateVerification.deploy();
  
  // Wait for deployment to complete
  await certificateVerification.deployed();
  
  console.log("✅ CertificateVerification contract deployed successfully!");
  console.log("Contract address:", certificateVerification.address);
  console.log("Transaction hash:", certificateVerification.deployTransaction.hash);
  
  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: certificateVerification.address,
    transactionHash: certificateVerification.deployTransaction.hash,
    network: network.name,
    chainId: network.chainId.toString(),
    deployTime: new Date().toISOString()
  };
  
  // Write deployment info to file
  fs.writeFileSync(
    './deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
  
  // Example: Authorize first issuer (for testing)
  if (network.name !== "hardhat") {
    console.log("\n📝 Next steps:");
    console.log("1. Verify contract on Etherscan:");
    console.log(`   npx hardhat verify --network ${network.name} ${certificateVerification.address}`);
    console.log("2. Authorize university admins using authorizeIssuer() function");
    console.log("3. Update your backend with the contract address");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
