# Sepolia Testnet Deployment Details

**Date:** May 15, 2026
**Network:** Sepolia Testnet (Chain ID: 11155111)
**Contract Name:** CertificateVerification

### Deployment Information
- **Contract Address:** `0x215dCa1d96B46de59c7cCF2BF1dAe38faE5bC9C9`
- **Transaction Hash:** `0x93b21043de5a9b30fdc0b6bdb3ff6e152b2c53d191c4871cb9f18fdee8fadcbf`

### Environment Adjustments Made
- Created `hardhat.config.js` to configure the Sepolia network.
- Migrated standard imports in `CertificateVerification.sol` to standard NPM module format for Hardhat.
- Re-installed missing `@nomicfoundation` plugins to `package.json`.
- Updated `deploy.js` with `ethers` v6 syntax (`waitForDeployment()`, `target`, `deploymentTransaction()`).

### Next Steps for Integration
1. **Verification on Etherscan**: 
   Once an Etherscan API key is provided in the `.env` file under `ETHERSCAN_API_KEY`, run the following command to verify the source code:
   ```bash
   npx hardhat verify --network sepolia 0x215dCa1d96B46de59c7cCF2BF1dAe38faE5bC9C9
   ```
2. **Backend Update**:
   Update the backend's `.env` configuration or blockchain connection setup to point to `0x215dCa1d96B46de59c7cCF2BF1dAe38faE5bC9C9`.
