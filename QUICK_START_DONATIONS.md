# Donation System Quick Start

Get your donation system up and running in 5 minutes!

## 🚀 Quick Deploy (Production)

```bash
# 1. Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts viem

# 2. Add your keys to .env.local
echo "PRIVATE_KEY=your_private_key" >> .env.local
echo "BASESCAN_API_KEY=your_basescan_key" >> .env.local

# 3. Create hardhat.config.js (copy from DONATION_SETUP.md)

# 4. Create scripts/deploy-donations.js (copy from DONATION_SETUP.md)

# 5. Deploy!
npx hardhat run scripts/deploy-donations.js --network base

# 6. Add contract address to .env.local
echo "NEXT_PUBLIC_DONATION_CONTRACT=0x..." >> .env.local

# 7. Restart dev server
npm run dev

# 8. Test at http://localhost:3000
```

## 📋 Files Created

### Smart Contract
- ✅ [contracts/SpendControlDonations.sol](contracts/SpendControlDonations.sol) - Main donation contract

### Frontend Components
- ✅ [components/DonationWidget.tsx](components/DonationWidget.tsx) - Donation interface
- ✅ [components/SupporterBadge.tsx](components/SupporterBadge.tsx) - Badge display
- ✅ [components/DonorLeaderboard.tsx](components/DonorLeaderboard.tsx) - Top donors

### Types & Utils
- ✅ [lib/donationTypes.ts](lib/donationTypes.ts) - TypeScript types & ABI

### Documentation
- ✅ [DONATION_SETUP.md](DONATION_SETUP.md) - Full setup guide
- ✅ [contracts/deploy.md](contracts/deploy.md) - Deployment instructions

## 💰 Donation Tiers

| Tier | Amount | Badge |
|------|--------|-------|
| ☕ Coffee | $5 | Bronze 🥉 |
| 🍕 Pizza | $15 | Silver 🥈 |
| 🎁 Gift | $30 | Gold 🥇 |
| 💎 Diamond | $100 | Diamond 💎 |

## 🎯 What Users See

### Before Donation
- Donation widget with 4 tiers
- ETH/USDC payment options
- "SpendControl is Free Forever" message

### After Donation
- Badge appears in header
- Name on leaderboard (if top 10)
- Success confetti animation
- "Thank you" message

## 🔧 Key Configuration

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_BASESCAN_API_KEY=...     # For analytics
NEXT_PUBLIC_DONATION_CONTRACT=...    # After deployment
PRIVATE_KEY=...                       # For deployment only
BASESCAN_API_KEY=...                 # For verification
```

### Important Addresses
- **Creator**: `0x105d1701d2B6ca218EfbceC3B2AE9088bE58aD67`
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Base Chain ID**: `8453`

## ✨ Features

- 🔒 **Secure**: OpenZeppelin contracts, ReentrancyGuard
- 💸 **Direct**: Funds go directly to creator, no escrow
- 🏅 **Gamified**: Badges for supporters
- 🏆 **Social**: Public leaderboard
- 📱 **Mobile**: Responsive design
- ⚡ **Fast**: Base blockchain, low gas fees

## 🧪 Testing Checklist

- [ ] Deploy to Base Sepolia testnet first
- [ ] Test ETH donation
- [ ] Test USDC donation
- [ ] Verify badge appears
- [ ] Check leaderboard updates
- [ ] Confirm funds arrive
- [ ] Test on mobile
- [ ] Deploy to mainnet

## 🚨 Before Going Live

1. ✅ Test on Sepolia testnet
2. ✅ Verify contract on Basescan
3. ✅ Test all donation tiers
4. ✅ Check mobile responsiveness
5. ✅ Remove PRIVATE_KEY from .env.local
6. ✅ Deploy frontend
7. ✅ Monitor first donations

## 💡 Pro Tips

- Keep ETH price updated every few months
- Thank donors publicly on Twitter
- Monitor Basescan for donations
- Test with small amounts first
- Gas is cheap on Base (~$0.01)

## 🆘 Need Help?

Check [DONATION_SETUP.md](DONATION_SETUP.md) for:
- Detailed deployment steps
- Troubleshooting guide
- Security best practices
- Contract interaction examples

---

**Ready to accept donations in 5 minutes!** ☕
