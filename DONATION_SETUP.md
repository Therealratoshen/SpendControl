# Donation System Setup Guide

Complete guide to deploy and configure the SpendControl donation system on Base blockchain.

## 🎯 Overview

The donation system allows users to support SpendControl by donating ETH or USDC. Features include:

- ☕ **4 Donation Tiers**: Coffee ($5), Pizza ($15), Gift ($30), Diamond ($100)
- 🏅 **Badge System**: Bronze, Silver, Gold, Diamond badges for donors
- 🏆 **Leaderboard**: Top 10 donors displayed publicly
- 💰 **Direct Payments**: All donations sent immediately to creator (no escrow)
- 🔒 **Secure**: Uses OpenZeppelin contracts, audited patterns

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Wallet with ETH on Base** (~$5-10 for deployment gas)
3. **Basescan API key** (free from https://basescan.org/myapikey)
4. **Private key** of deployment wallet (0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67)

## 🚀 Step 1: Install Dependencies

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts

# Install viem for frontend
npm install viem
```

## ⚙️ Step 2: Configure Hardhat

Create `hardhat.config.js` in the root directory:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
      gasPrice: "auto",
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
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};
```

## 📝 Step 3: Create Deployment Script

Create `scripts/deploy-donations.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying SpendControlDonations to Base...");

  // Base mainnet USDC address
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  // Get deployer info
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const SpendControlDonations = await hre.ethers.getContractFactory(
    "SpendControlDonations"
  );

  console.log("Deploying contract...");
  const contract = await SpendControlDonations.deploy(USDC_ADDRESS);

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ SpendControlDonations deployed to:", address);
  console.log("Creator address:", await contract.creator());
  console.log("USDC address:", await contract.usdc());

  // Wait for confirmations
  console.log("\n⏳ Waiting for 5 block confirmations...");
  await contract.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!");

  // Verify contract
  console.log("\n🔍 Verifying contract on Basescan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [USDC_ADDRESS],
      network: "base",
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!");
    } else {
      console.log("❌ Verification failed:", error.message);
      console.log("You can verify manually later with:");
      console.log(`npx hardhat verify --network base ${address} ${USDC_ADDRESS}`);
    }
  }

  console.log("\n📋 Next steps:");
  console.log("1. Add to .env.local:");
  console.log(`   NEXT_PUBLIC_DONATION_CONTRACT=${address}`);
  console.log("2. Restart your dev server: npm run dev");
  console.log("3. Test donation on http://localhost:3000");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 🔐 Step 4: Configure Environment

Update `.env.local`:

```bash
# Your Basescan API key (for frontend + deployment)
NEXT_PUBLIC_BASESCAN_API_KEY=your_basescan_api_key

# Your wallet private key (for deployment only)
# WARNING: Keep this secret! Never commit to git!
PRIVATE_KEY=your_private_key_here

# Basescan API key for contract verification
BASESCAN_API_KEY=your_basescan_api_key

# This will be filled after deployment
NEXT_PUBLIC_DONATION_CONTRACT=
```

**⚠️ SECURITY WARNING:**
- Never commit `.env.local` to git
- Use a deployment wallet with only deployment funds
- Remove `PRIVATE_KEY` after deployment

## 🚢 Step 5: Deploy Contract

### Test on Base Sepolia (Recommended First)

```bash
# Get test ETH from faucet
# Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# Deploy to testnet
npx hardhat run scripts/deploy-donations.js --network base-sepolia
```

### Deploy to Base Mainnet

```bash
# Make sure you have real ETH on Base mainnet
npx hardhat run scripts/deploy-donations.js --network base
```

Expected output:
```
Deploying SpendControlDonations to Base...
Deploying with account: 0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67
Account balance: 0.01 ETH
Deploying contract...

✅ SpendControlDonations deployed to: 0x...
Creator address: 0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67
USDC address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

⏳ Waiting for 5 block confirmations...
✅ Confirmed!

🔍 Verifying contract on Basescan...
✅ Contract verified!

📋 Next steps:
1. Add to .env.local:
   NEXT_PUBLIC_DONATION_CONTRACT=0x...
2. Restart your dev server: npm run dev
3. Test donation on http://localhost:3000

🎉 Deployment complete!
```

## 🔧 Step 6: Configure Frontend

1. Copy the deployed contract address
2. Update `.env.local`:

```bash
NEXT_PUBLIC_DONATION_CONTRACT=0x_your_deployed_contract_address
```

3. Restart dev server:

```bash
npm run dev
```

## ✅ Step 7: Test Everything

1. **Open app**: http://localhost:3000
2. **Connect wallet** with test funds
3. **Click "Support SpendControl"** button
4. **Select tier**: Choose Coffee ($5)
5. **Select payment**: ETH or USDC
6. **Donate**: Click donate button
7. **Verify**:
   - Transaction succeeds
   - Badge appears in header
   - You appear on leaderboard
   - Funds arrive at creator wallet

## 📊 Contract Information

### Deployed Addresses

- **Base USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Creator Wallet**: `0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67`
- **Donation Contract**: (deploy yours)

### Donation Tiers

| Tier | USD | ETH | USDC | Badge |
|------|-----|-----|------|-------|
| Coffee | $5 | 0.00167 | 5 | Bronze 🥉 |
| Pizza | $15 | 0.005 | 15 | Silver 🥈 |
| Gift | $30 | 0.01 | 30 | Gold 🥇 |
| Diamond | $100 | 0.0333 | 100 | Diamond 💎 |

*ETH amounts based on $3000/ETH*

### Smart Contract Features

- ✅ **Secure**: ReentrancyGuard, no funds stored
- ✅ **Direct**: Donations sent immediately to creator
- ✅ **Transparent**: All transactions on-chain
- ✅ **Trackable**: Events emitted for all donations
- ✅ **Updatable**: Creator can update ETH price

## 🔄 Updating ETH Price

If ETH price changes significantly, update the contract:

```javascript
// In your frontend or via Etherscan
const newPrice = 3500; // New ETH price in USD
await contract.updateETHPrice(newPrice);
```

Only the creator (0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67) can call this.

## 🐛 Troubleshooting

### "Contract not deployed yet"
- Widget doesn't show → `NEXT_PUBLIC_DONATION_CONTRACT` not set
- Solution: Add contract address to `.env.local` and restart

### "Insufficient funds"
- Transaction fails → Not enough ETH/USDC
- Solution: Add funds to wallet

### "USDC transfer failed"
- USDC donation fails → Need to approve USDC first
- Solution: System auto-approves, but check allowance

### "Only creator can update price"
- Can't update ETH price → Not the creator wallet
- Solution: Use creator wallet (0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67)

### Verification Failed
- Contract not verified → Basescan API issue
- Solution: Verify manually:

```bash
npx hardhat verify --network base CONTRACT_ADDRESS 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## 📱 Frontend Components

### DonationWidget
- Shows donation tiers
- ETH/USDC selection
- Transaction handling
- Success/error states

### SupporterBadge
- Shows in header when connected
- Displays user's badge tier
- Shows total donated

### DonorLeaderboard
- Top 10 donors
- Total donations
- Badge display

## 🔒 Security Best Practices

1. **Private Keys**: Never commit to git, use separate deployment wallet
2. **Testing**: Always test on Sepolia first
3. **Verification**: Verify contract on Basescan for transparency
4. **Monitoring**: Watch creator wallet for donation arrivals
5. **Backup**: Save contract address and deployment info

## 📈 Analytics

View donation stats:
- **Basescan**: https://basescan.org/address/YOUR_CONTRACT
- **Contract calls**: All donations visible on-chain
- **Leaderboard**: Built into app
- **Total stats**: Query contract directly

## 🎉 Launch Checklist

- [ ] Contract deployed to Base mainnet
- [ ] Contract verified on Basescan
- [ ] `.env.local` updated with contract address
- [ ] Tested donation with ETH
- [ ] Tested donation with USDC
- [ ] Badge shows correctly
- [ ] Leaderboard updates
- [ ] Donations arrive at creator wallet
- [ ] Frontend deployed
- [ ] Announced to users

## 💡 Tips

- Start with small test donations
- Monitor gas prices (Base is cheap!)
- Update ETH price every few months
- Engage with top donors
- Thank supporters publicly

## 🆘 Support

Issues? Check:
1. Contract on Basescan
2. Browser console for errors
3. Wallet connection
4. Network (must be Base)
5. Env variables set correctly

---

Built with ❤️ for SpendControl
