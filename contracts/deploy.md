# Smart Contract Deployment Guide

## Prerequisites

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Install OpenZeppelin contracts:
```bash
npm install @openzeppelin/contracts
```

## Setup Hardhat

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY,
      "base-sepolia": process.env.BASESCAN_API_KEY,
    },
  },
};
```

## Deployment Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying SpendControlDonations...");

  // Base mainnet USDC address
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  const SpendControlDonations = await hre.ethers.getContractFactory(
    "SpendControlDonations"
  );
  const contract = await SpendControlDonations.deploy(USDC_ADDRESS);

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SpendControlDonations deployed to:", address);
  console.log("Creator address:", await contract.creator());
  console.log("USDC address:", await contract.usdc());

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);

  // Verify contract on Basescan
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [USDC_ADDRESS],
    });
    console.log("Contract verified!");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Deploy to Base Mainnet

1. Add your private key to `.env.local`:
```bash
PRIVATE_KEY=your_wallet_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

2. Make sure you have ETH on Base for gas

3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network base
```

## Deploy to Base Sepolia (Testnet)

For testing first:

```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

Get test ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## After Deployment

1. Copy the deployed contract address
2. Update `.env.local`:
```bash
NEXT_PUBLIC_DONATION_CONTRACT=0x...
```

3. Update contract ABI in your frontend if needed

## Contract Addresses

- Base Mainnet USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Creator Address: `0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67`

## Security Notes

- Contract uses ReentrancyGuard
- All donations sent directly to creator (no funds held in contract)
- Only creator can update ETH price
- Contract is immutable after deployment
