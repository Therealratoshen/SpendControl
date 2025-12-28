import { BasescanTransaction } from './types';

export interface GasAnalysis {
  totalGasSpent: number;
  avgGasPerTx: number;
  totalGasInGwei: number;
  avgGasInGwei: number;
  efficiency: {
    percentile: number;
    rating: 'excellent' | 'good' | 'average' | 'poor';
  };
  highGasTxs: {
    count: number;
    totalWasted: number;
    transactions: BasescanTransaction[];
  };
  savingsPotential: {
    monthly: number;
    tips: string[];
  };
}

const ETH_PRICE = 3000;
const OPTIMAL_GAS_GWEI = 0.5; // Base is very cheap
const HIGH_GAS_THRESHOLD = 1.0; // Anything above 1 Gwei is high for Base

export function analyzeGas(transactions: BasescanTransaction[]): GasAnalysis {
  if (transactions.length === 0) {
    return {
      totalGasSpent: 0,
      avgGasPerTx: 0,
      totalGasInGwei: 0,
      avgGasInGwei: 0,
      efficiency: { percentile: 0, rating: 'average' },
      highGasTxs: { count: 0, totalWasted: 0, transactions: [] },
      savingsPotential: { monthly: 0, tips: [] }
    };
  }

  // Calculate total gas spent in USD
  const totalGasSpent = transactions.reduce((total, tx) => {
    const gasUsed = parseInt(tx.gasUsed);
    const gasPrice = parseInt(tx.gasPrice);
    const gasCostETH = (gasUsed * gasPrice) / 1e18;
    return total + (gasCostETH * ETH_PRICE);
  }, 0);

  const avgGasPerTx = totalGasSpent / transactions.length;

  // Calculate average gas in Gwei
  const totalGasGwei = transactions.reduce((total, tx) => {
    const gasPriceGwei = parseInt(tx.gasPrice) / 1e9;
    return total + gasPriceGwei;
  }, 0);

  const avgGasInGwei = totalGasGwei / transactions.length;

  // Calculate efficiency percentile
  const percentile = calculateGasPercentile(avgGasInGwei);
  const rating = getRating(percentile);

  // Detect high gas transactions
  const highGasTxs = transactions.filter(tx => {
    const gasPriceGwei = parseInt(tx.gasPrice) / 1e9;
    return gasPriceGwei > HIGH_GAS_THRESHOLD;
  });

  // Calculate potential savings
  const totalWasted = highGasTxs.reduce((total, tx) => {
    const actualGasGwei = parseInt(tx.gasPrice) / 1e9;
    const gasUsed = parseInt(tx.gasUsed);
    const actualCost = (gasUsed * actualGasGwei * 1e9 / 1e18) * ETH_PRICE;
    const optimalCost = (gasUsed * OPTIMAL_GAS_GWEI * 1e9 / 1e18) * ETH_PRICE;
    return total + (actualCost - optimalCost);
  }, 0);

  // Calculate monthly savings potential
  const monthlySavings = totalWasted;

  // Generate tips
  const tips = generateGasTips(avgGasInGwei, highGasTxs.length);

  return {
    totalGasSpent,
    avgGasPerTx,
    totalGasInGwei: totalGasGwei,
    avgGasInGwei,
    efficiency: { percentile, rating },
    highGasTxs: {
      count: highGasTxs.length,
      totalWasted,
      transactions: highGasTxs.slice(0, 5) // Top 5 highest
    },
    savingsPotential: {
      monthly: monthlySavings,
      tips
    }
  };
}

function calculateGasPercentile(avgGasGwei: number): number {
  // Base has very low gas, adjust thresholds
  if (avgGasGwei < 0.3) return 95;
  if (avgGasGwei < 0.5) return 85;
  if (avgGasGwei < 0.8) return 70;
  if (avgGasGwei < 1.0) return 50;
  if (avgGasGwei < 1.5) return 30;
  return 10;
}

function getRating(percentile: number): 'excellent' | 'good' | 'average' | 'poor' {
  if (percentile >= 80) return 'excellent';
  if (percentile >= 60) return 'good';
  if (percentile >= 40) return 'average';
  return 'poor';
}

function generateGasTips(avgGas: number, highGasCount: number): string[] {
  const tips: string[] = [];

  if (avgGas > 1.0) {
    tips.push('Wait for gas < 0.5 Gwei on Base (save ~50%)');
  }

  if (highGasCount > 5) {
    tips.push('Enable gas alerts to get notified of low gas periods');
  }

  tips.push('Best time to transact on Base: 2-6am UTC (lowest activity)');

  if (avgGas > 0.8) {
    tips.push('Batch transactions when possible to save on gas');
  }

  tips.push('Use gasless transactions when available');

  return tips;
}
