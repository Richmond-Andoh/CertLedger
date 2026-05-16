const { ethers } = require("hardhat");
require("dotenv").config({ path: "./backend/.env" }); // Try to get backend env if needed, but hardhat config uses root .env

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Authorizing issuer with account:", deployer.address);

  const contractAddress = "0x215dCa1d96B46de59c7cCF2BF1dAe38faE5bC9C9";
  const CertificateVerification = await ethers.getContractFactory("contracts/CertificateVerification.sol:CertificateVerification");
  const contract = CertificateVerification.attach(contractAddress);

  // Check if already authorized
  const isAuth = await contract.isAuthorizedIssuer(deployer.address);
  if (isAuth) {
    console.log("Account is already authorized!");
    return;
  }

  console.log("Sending authorization transaction...");
  const tx = await contract.authorizeIssuer(deployer.address, "Global Academic Ledger");
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Successfully authorized the backend wallet as an issuer.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Authorization failed:", error);
    process.exit(1);
  });
