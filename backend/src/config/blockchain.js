const { ethers } = require('ethers');

// Blockchain configuration
const contractConfig = {
  address: process.env.CONTRACT_ADDRESS || '0x215dCa1d96B46de59c7cCF2BF1dAe38faE5bC9C9',
  abi: [
    {
      "inputs": [
        {"name": "issuer", "type": "address"},
        {"name": "institution", "type": "string"}
      ],
      "name": "authorizeIssuer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "certificateId", "type": "string"},
        {"name": "hash", "type": "string"},
        {"name": "institution", "type": "string"}
      ],
      "name": "issueCertificate",
      "outputs": [{"name": "success", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "certificateId", "type": "string"},
        {"name": "hash", "type": "string"}
      ],
      "name": "verifyCertificate",
      "outputs": [
        {"name": "isValid", "type": "bool"},
        {"name": "timestamp", "type": "uint256"},
        {"name": "institution", "type": "string"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "hash", "type": "string"}
      ],
      "name": "checkDuplicateHash",
      "outputs": [{"name": "exists", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "certificateId", "type": "string"}
      ],
      "name": "getCertificateDetails",
      "outputs": [
        {"name": "hash", "type": "string"},
        {"name": "issuer", "type": "address"},
        {"name": "timestamp", "type": "uint256"},
        {"name": "isActive", "type": "bool"},
        {"name": "institution", "type": "string"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalCertificates",
      "outputs": [{"name": "count", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "issuer", "type": "address"}
      ],
      "name": "isAuthorizedIssuer",
      "outputs": [{"name": "isAuthorized", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Initialize provider and contract
let provider;
let contract;

const initializeBlockchain = () => {
  try {
    // Use RPC provider for Sepolia testnet
    const rpcUrl = process.env.SEPOLIA_URL || 'https://sepolia.drpc.org';
    provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Create contract instance
    if (process.env.CONTRACT_ADDRESS) {
      contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
      console.log('✅ Blockchain contract initialized');
      console.log(`📍 Contract: ${contractConfig.address}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Blockchain initialization error:', error.message);
    return false;
  }
};

// Get contract instance
const getContract = () => {
  if (!contract) {
    throw new Error('Contract not initialized. Call initializeBlockchain() first.');
  }
  return contract;
};

// Get provider
const getProvider = () => {
  if (!provider) {
    throw new Error('Provider not initialized. Call initializeBlockchain() first.');
  }
  return provider;
};

// Create wallet for transaction signing
const createWallet = (privateKey) => {
  try {
    return new ethers.Wallet(privateKey, provider);
  } catch (error) {
    console.error('❌ Wallet creation error:', error.message);
    throw error;
  }
};

// Wait for transaction confirmation
const waitForTransaction = async (txHash, timeout = 60000) => {
  try {
    const receipt = await provider.waitForTransaction(txHash, 1, timeout);
    return receipt;
  } catch (error) {
    console.error('❌ Transaction confirmation error:', error.message);
    throw error;
  }
};

// Get transaction status
const getTransactionStatus = async (txHash) => {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    return {
      success: receipt && receipt.status === 1,
      blockNumber: receipt ? receipt.blockNumber : null,
      gasUsed: receipt ? receipt.gasUsed.toString() : null
    };
  } catch (error) {
    console.error('❌ Transaction status error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  contractConfig,
  initializeBlockchain,
  getContract,
  getProvider,
  createWallet,
  waitForTransaction,
  getTransactionStatus
};
