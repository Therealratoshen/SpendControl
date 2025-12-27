# SpendSystem - Base Blockchain Spending Analytics

A production-ready spending analytics dashboard for Base blockchain users. Track USDC transactions, monitor gas costs, and discover recurring payments with a beautiful, responsive interface.

## Features

- **Real-time Wallet Connection** - Connect your Base wallet using OnchainKit
- **USDC Spending Analytics** - Track all USDC transactions over the last 30 days
- **Gas Cost Analysis** - Monitor gas costs and identify expensive transactions
- **Recurring Payment Detection** - Automatically detect subscriptions and regular payments
- **Monthly Comparisons** - See how your spending trends month-over-month
- **Transaction History** - View detailed transaction list with Basescan links
- **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **OnchainKit** - Coinbase's toolkit for onchain apps
- **Wagmi** - React hooks for Ethereum
- **Tailwind CSS** - Utility-first CSS framework
- **Basescan API** - Blockchain data from Base network

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Basescan API key (free tier works)
- Base wallet address to analyze

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env.local
```

3. Get your Basescan API key:
   - Go to https://basescan.org/myapikey
   - Sign up/login and create an API key
   - Copy your API key

4. Update `.env.local`:

```bash
NEXT_PUBLIC_BASESCAN_API_KEY=your_actual_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet** - Click the wallet button in the top right to connect your Base wallet
2. **View Analytics** - Once connected, your spending data will load automatically
3. **Explore Features**:
   - View total USDC spent and gas costs
   - See spending breakdown by category
   - Check for recurring payments
   - Toggle transaction list and gas analytics

## Demo Mode

Want to try it without connecting a wallet? Use this example address:

```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

Note: You'll need to modify the code to accept a manual address input for demo mode.

## Project Structure

```
SpendControl/
├── app/
│   ├── layout.tsx          # Root layout with OnchainKit providers
│   └── page.tsx            # Home page with wallet connection
├── components/
│   ├── SpendingDashboard.tsx  # Main dashboard component
│   ├── StatCard.tsx           # Stat card component
│   ├── TransactionList.tsx    # Transaction list view
│   └── GasAnalytics.tsx       # Gas analytics view
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── basescan.ts         # Basescan API integration
│   └── analyzer.ts         # Spending analysis logic
└── .env.local              # Environment variables (not in git)
```

## How It Works

### Data Flow

1. User connects wallet via OnchainKit
2. App fetches transaction data from Basescan API
3. Analyzer processes transactions:
   - Filters last 30 days
   - Calculates USDC spending
   - Computes gas costs
   - Detects patterns
4. Dashboard displays analytics with caching

### Caching

- API responses cached for 5 minutes in localStorage
- Reduces API calls and improves performance
- Respects Basescan rate limits (5 calls/second)

### Recurring Payment Detection

The system detects recurring payments by:
- Finding recipients with 3+ transactions
- Calculating average time intervals
- Checking for regular patterns (within 3 days variance)
- Displaying average amounts and frequencies

## API Rate Limits

Basescan free tier: 5 calls/second, 100,000 calls/day

The app implements:
- Rate limiting (200ms between calls)
- Response caching (5 minutes)
- Efficient batch requests

## Key Constants

```typescript
USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
BASE_CHAIN_ID = 8453
ETH_PRICE_ESTIMATE = $3000 (for gas calculations)
CACHE_DURATION = 5 minutes
```

## Customization

### Change Analysis Period

Edit `lib/analyzer.ts`:

```typescript
const recentTxs = getRecentTransactions(transactions, 30); // Change 30 to desired days
```

### Adjust ETH Price

Edit `lib/basescan.ts`:

```typescript
export function calculateGasCosts(
  transactions: BasescanTransaction[],
  ethPriceUSD: number = 3000 // Update this value
)
```

### Modify Recurring Payment Detection

Edit `lib/analyzer.ts`:

```typescript
const maxVariance = 3; // Change days variance tolerance
if (txs.length < 3) return; // Change minimum transaction count
```

## Troubleshooting

### "API key not configured" error
- Make sure `.env.local` exists and has your API key
- Restart the dev server after adding the key

### "No transactions found"
- Ensure the wallet has Base transaction history
- Check that you're using a Base mainnet address
- Verify the address has USDC transactions

### Slow loading
- First load takes time to fetch all transactions
- Subsequent loads use cache (5min)
- Consider reducing date range for faster analysis

## Future Enhancements

- [ ] Export data to CSV
- [ ] Custom date range selection
- [ ] Support for more tokens (ETH, WETH, etc.)
- [ ] Spending limits and alerts
- [ ] Weekly/monthly email reports
- [ ] Budget tracking
- [ ] Category customization
- [ ] Multi-wallet support

## Contributing

This is a production-ready app. Feel free to fork and customize for your needs.

## License

MIT

## Support

For issues or questions:
- Check existing issues
- Create new issue with details
- Include error messages and screenshots

---

Built with ❤️ for the Base ecosystem
