import { BasescanTransaction, BasescanTokenTransfer } from './types';

export interface TrendAnalysis {
  thisMonth: {
    totalSpent: number;
    gasSpent: number;
    txCount: number;
  };
  lastMonth: {
    totalSpent: number;
    gasSpent: number;
    txCount: number;
  };
  percentChange: {
    spending: number;
    gas: number;
    transactions: number;
  };
  vsAverage: {
    gasEfficiency: {
      percentile: number;
      rating: 'better' | 'average' | 'worse';
    };
    spendingVolume: {
      rating: 'above' | 'average' | 'below';
    };
    activityLevel: {
      rating: 'more' | 'average' | 'less';
    };
  };
  insight: string;
}

const ETH_PRICE = 3000;
const AVERAGE_GAS_GWEI = 0.5; // Base average
const AVERAGE_MONTHLY_SPENDING = 500;
const AVERAGE_TX_COUNT = 40;

export function analyzeTrends(
  transactions: BasescanTransaction[],
  usdcTransfers: BasescanTokenTransfer[]
): TrendAnalysis {
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60);

  // Split into two periods
  const thisMonthTxs = transactions.filter(tx =>
    parseInt(tx.timeStamp) > thirtyDaysAgo
  );

  const lastMonthTxs = transactions.filter(tx =>
    parseInt(tx.timeStamp) > sixtyDaysAgo &&
    parseInt(tx.timeStamp) <= thirtyDaysAgo
  );

  const thisMonthUSDC = usdcTransfers.filter(tx =>
    parseInt(tx.timeStamp) > thirtyDaysAgo
  );

  const lastMonthUSDC = usdcTransfers.filter(tx =>
    parseInt(tx.timeStamp) > sixtyDaysAgo &&
    parseInt(tx.timeStamp) <= thirtyDaysAgo
  );

  // Calculate metrics
  const thisMonth = calculatePeriodMetrics(thisMonthTxs, thisMonthUSDC);
  const lastMonth = calculatePeriodMetrics(lastMonthTxs, lastMonthUSDC);

  // Calculate percent changes
  const percentChange = {
    spending: calculatePercentChange(thisMonth.totalSpent, lastMonth.totalSpent),
    gas: calculatePercentChange(thisMonth.gasSpent, lastMonth.gasSpent),
    transactions: calculatePercentChange(thisMonth.txCount, lastMonth.txCount)
  };

  // Compare to average
  const vsAverage = compareToAverage(thisMonth, thisMonthTxs);

  // Generate insight
  const insight = generateInsight(percentChange, vsAverage);

  return {
    thisMonth,
    lastMonth,
    percentChange,
    vsAverage,
    insight
  };
}

function calculatePeriodMetrics(
  transactions: BasescanTransaction[],
  usdcTransfers: BasescanTokenTransfer[]
) {
  // Calculate USDC spent
  const totalSpent = usdcTransfers.reduce((total, tx) => {
    const value = parseInt(tx.value) / 1e6; // USDC has 6 decimals
    return total + value;
  }, 0);

  // Calculate gas spent
  const gasSpent = transactions.reduce((total, tx) => {
    const gasUsed = parseInt(tx.gasUsed);
    const gasPrice = parseInt(tx.gasPrice);
    const gasCostETH = (gasUsed * gasPrice) / 1e18;
    return total + (gasCostETH * ETH_PRICE);
  }, 0);

  return {
    totalSpent,
    gasSpent,
    txCount: transactions.length
  };
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function compareToAverage(userData: { totalSpent: number; gasSpent: number; txCount: number }, transactions: BasescanTransaction[]) {
  const userGasGwei = transactions.length > 0
    ? transactions.reduce((total, tx) => {
        return total + (parseInt(tx.gasPrice) / 1e9);
      }, 0) / transactions.length
    : 0;

  const gasPercentile = calculateGasPercentile(userGasGwei);

  return {
    gasEfficiency: {
      percentile: gasPercentile,
      rating: userGasGwei < AVERAGE_GAS_GWEI ? 'better' as const :
              userGasGwei < AVERAGE_GAS_GWEI * 1.2 ? 'average' as const : 'worse' as const
    },
    spendingVolume: {
      rating: userData.totalSpent > AVERAGE_MONTHLY_SPENDING * 1.2 ? 'above' as const :
              userData.totalSpent > AVERAGE_MONTHLY_SPENDING * 0.8 ? 'average' as const : 'below' as const
    },
    activityLevel: {
      rating: userData.txCount > AVERAGE_TX_COUNT * 1.2 ? 'more' as const :
              userData.txCount > AVERAGE_TX_COUNT * 0.8 ? 'average' as const : 'less' as const
    }
  };
}

function calculateGasPercentile(avgGasGwei: number): number {
  if (avgGasGwei < 0.3) return 95;
  if (avgGasGwei < 0.5) return 85;
  if (avgGasGwei < 0.8) return 70;
  if (avgGasGwei < 1.0) return 50;
  if (avgGasGwei < 1.5) return 30;
  return 10;
}

function generateInsight(
  percentChange: { spending: number; gas: number; transactions: number },
  vsAverage: TrendAnalysis['vsAverage']
): string {
  const spendingUp = percentChange.spending > 5;
  const spendingDown = percentChange.spending < -5;
  const gasDown = percentChange.gas < -5;
  const gasEfficient = vsAverage.gasEfficiency.rating === 'better';

  if (spendingUp && gasDown) {
    return "You're spending more this month but using gas more efficiently than before!";
  }

  if (spendingUp && gasEfficient) {
    return "Your spending increased, but you're still more gas-efficient than most users!";
  }

  if (spendingDown && gasEfficient) {
    return "Great job! Spending is down and you're optimizing gas costs!";
  }

  if (gasEfficient) {
    return "Excellent! You're in the top tier for gas optimization on Base.";
  }

  if (gasDown) {
    return "You're improving! Gas costs are down vs last month.";
  }

  if (spendingDown) {
    return "Good control! Your spending is trending down this month.";
  }

  return "Keep tracking to identify optimization opportunities!";
}
