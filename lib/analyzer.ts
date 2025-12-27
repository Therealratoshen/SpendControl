import {
  BasescanTransaction,
  BasescanTokenTransfer,
  SpendingData,
  CategorySpending,
  RecurringPayment,
  ProcessedTransaction,
  MonthlyComparison,
} from './types';
import {
  calculateGasCosts,
  calculateUSDCSpent,
  getRecentTransactions,
  getRecentUSDCTransfers,
} from './basescan';

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Categorize a transaction based on its properties
 */
export function categorizeTransaction(
  tx: BasescanTransaction | BasescanTokenTransfer
): string {
  const input = tx.input || '';
  const value = BigInt(tx.value || '0');

  // Check if it's a USDC transfer
  if ('contractAddress' in tx && 'tokenSymbol' in tx && tx.tokenSymbol === 'USDC') {
    // Check for common DeFi protocols by analyzing the recipient
    const to = tx.to.toLowerCase();

    // Common DeFi protocol patterns
    if (to.includes('swap') || to.includes('router') || to.includes('pool')) {
      return 'DeFi Protocols';
    }

    // NFT marketplaces
    if (to.includes('opensea') || to.includes('blur') || to.includes('marketplace')) {
      return 'NFT Purchases';
    }

    // Check for contract interactions
    if (input.length > 10) {
      return 'Contract Interactions';
    }

    // Simple transfers
    return 'Transfers';
  }

  // ETH transactions
  if (value > BigInt(0)) {
    if (input.length > 10) {
      return 'Contract Interactions';
    }
    return 'ETH Transfers';
  }

  // Contract calls without value
  if (input.length > 10) {
    return 'Contract Calls';
  }

  return 'Other';
}

/**
 * Detect recurring payments
 */
export function detectRecurringPayments(
  transfers: BasescanTokenTransfer[],
  userAddress: string
): RecurringPayment[] {
  const userAddr = userAddress.toLowerCase();

  // Filter outgoing transfers only
  const outgoing = transfers.filter(tx => tx.from.toLowerCase() === userAddr);

  // Group by recipient
  const byRecipient: { [key: string]: BasescanTokenTransfer[] } = {};

  outgoing.forEach(tx => {
    const recipient = tx.to.toLowerCase();
    if (!byRecipient[recipient]) {
      byRecipient[recipient] = [];
    }
    byRecipient[recipient].push(tx);
  });

  const recurring: RecurringPayment[] = [];

  // Analyze each recipient
  Object.entries(byRecipient).forEach(([recipient, txs]) => {
    // Need at least 3 transactions to consider it recurring
    if (txs.length < 3) return;

    // Sort by timestamp
    const sorted = [...txs].sort((a, b) =>
      parseInt(a.timeStamp) - parseInt(b.timeStamp)
    );

    // Calculate intervals between payments
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff = parseInt(sorted[i].timeStamp) - parseInt(sorted[i - 1].timeStamp);
      intervals.push(diff / (24 * 60 * 60)); // Convert to days
    }

    // Calculate average interval
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;

    // Check if intervals are regular (within 3 days variance)
    const maxVariance = 3;
    const isRegular = intervals.every(interval =>
      Math.abs(interval - avgInterval) <= maxVariance
    );

    if (isRegular) {
      // Calculate total and average amount
      const totalAmount = sorted.reduce((sum, tx) => {
        return sum + Number(tx.value) / 1e6; // USDC has 6 decimals
      }, 0);

      const avgAmount = totalAmount / sorted.length;

      recurring.push({
        recipient,
        recipientShort: shortenAddress(recipient),
        count: sorted.length,
        totalAmount,
        avgAmount,
        avgIntervalDays: avgInterval,
        lastPayment: parseInt(sorted[sorted.length - 1].timeStamp),
      });
    }
  });

  // Sort by total amount descending
  return recurring.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Analyze spending by category
 */
export function analyzeSpendingByCategory(
  transfers: BasescanTokenTransfer[],
  userAddress: string
): CategorySpending[] {
  const userAddr = userAddress.toLowerCase();

  // Filter outgoing transfers only
  const outgoing = transfers.filter(tx => tx.from.toLowerCase() === userAddr);

  // Group by category
  const byCategory: { [key: string]: { amount: number; count: number } } = {};

  outgoing.forEach(tx => {
    const category = categorizeTransaction(tx);
    const amount = Number(tx.value) / 1e6; // USDC has 6 decimals

    if (!byCategory[category]) {
      byCategory[category] = { amount: 0, count: 0 };
    }

    byCategory[category].amount += amount;
    byCategory[category].count += 1;
  });

  // Convert to array and sort by amount
  const categories: CategorySpending[] = Object.entries(byCategory).map(
    ([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
    })
  );

  return categories.sort((a, b) => b.amount - a.amount);
}

/**
 * Process transactions for display
 */
export function processTransactions(
  transactions: BasescanTransaction[],
  transfers: BasescanTokenTransfer[],
  userAddress: string,
  limit: number = 20
): ProcessedTransaction[] {
  const processed: ProcessedTransaction[] = [];

  // Process USDC transfers
  transfers.slice(0, limit).forEach(tx => {
    const amount = Number(tx.value) / 1e6;
    const gasInUSD = (Number(tx.gasUsed) * Number(tx.gasPrice)) / 1e18 * 3000; // Assume ETH = $3000

    processed.push({
      hash: tx.hash,
      timestamp: parseInt(tx.timeStamp),
      type: 'USDC ' + (tx.from.toLowerCase() === userAddress.toLowerCase() ? 'Sent' : 'Received'),
      amount,
      gasInUSD,
      to: tx.to,
      toShort: shortenAddress(tx.to),
      status: 'success',
    });
  });

  return processed.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

/**
 * Calculate monthly comparison
 */
export function calculateMonthlyComparison(
  transfers: BasescanTokenTransfer[],
  userAddress: string
): MonthlyComparison | undefined {
  const userAddr = userAddress.toLowerCase();
  const now = Math.floor(Date.now() / 1000);

  // Calculate current month (last 30 days)
  const currentMonthStart = now - (30 * 24 * 60 * 60);
  const currentMonthTransfers = transfers.filter(tx =>
    tx.from.toLowerCase() === userAddr &&
    parseInt(tx.timeStamp) >= currentMonthStart
  );

  // Calculate previous month (30-60 days ago)
  const previousMonthStart = now - (60 * 24 * 60 * 60);
  const previousMonthEnd = currentMonthStart;
  const previousMonthTransfers = transfers.filter(tx =>
    tx.from.toLowerCase() === userAddr &&
    parseInt(tx.timeStamp) >= previousMonthStart &&
    parseInt(tx.timeStamp) < previousMonthEnd
  );

  const currentMonth = calculateUSDCSpent(currentMonthTransfers, userAddress);
  const previousMonth = calculateUSDCSpent(previousMonthTransfers, userAddress);

  if (previousMonth === 0) {
    return undefined;
  }

  const percentChange = ((currentMonth - previousMonth) / previousMonth) * 100;

  let trend: 'up' | 'down' | 'stable';
  if (Math.abs(percentChange) < 5) {
    trend = 'stable';
  } else if (percentChange > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return {
    currentMonth,
    previousMonth,
    percentChange,
    trend,
  };
}

/**
 * Main analysis function - combines all data
 */
export async function analyzeSpending(
  transactions: BasescanTransaction[],
  usdcTransfers: BasescanTokenTransfer[],
  userAddress: string
): Promise<SpendingData> {
  // Get last 30 days only
  const recentTxs = getRecentTransactions(transactions, 30);
  const recentTransfers = getRecentUSDCTransfers(usdcTransfers, 30);

  // Calculate metrics
  const totalUSDC = calculateUSDCSpent(recentTransfers, userAddress);
  const totalGas = calculateGasCosts(recentTxs, 3000); // Assume ETH = $3000
  const transactionCount = recentTxs.length;
  const topSpending = analyzeSpendingByCategory(recentTransfers, userAddress).slice(0, 3);
  const recurringPayments = detectRecurringPayments(usdcTransfers, userAddress);
  const monthlyComparison = calculateMonthlyComparison(usdcTransfers, userAddress);

  return {
    totalUSDC,
    totalGas,
    transactionCount,
    topSpending,
    recurringPayments,
    monthlyComparison,
    lastUpdated: Date.now(),
  };
}
