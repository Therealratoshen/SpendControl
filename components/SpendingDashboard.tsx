'use client';

import { useState, useEffect } from 'react';
import { SpendingDashboardProps, SpendingData, ProcessedTransaction } from '@/lib/types';
import { fetchTransactions, fetchUSDCTransfers } from '@/lib/basescan';
import { analyzeSpending, processTransactions } from '@/lib/analyzer';
import { StatCard } from './StatCard';
import { TransactionList } from './TransactionList';
import { GasAnalytics } from './GasAnalytics';

export function SpendingDashboard({ address }: SpendingDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null);
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showGasAnalytics, setShowGasAnalytics] = useState(false);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function loadData(addr: string) {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from Basescan
        const [txs, usdcTransfers] = await Promise.all([
          fetchTransactions(addr),
          fetchUSDCTransfers(addr),
        ]);

        // Analyze spending
        const analysis = await analyzeSpending(txs, usdcTransfers, addr);
        setSpendingData(analysis);

        // Process transactions for display
        const processed = processTransactions(txs, usdcTransfers, addr, 20);
        setTransactions(processed);

        setLoading(false);
      } catch (err) {
        console.error('Error loading spending data:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load spending data. Please check your API key and try again.'
        );
        setLoading(false);
      }
    }

    loadData(address);
  }, [address]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SpendSystem</h1>
          <p className="text-gray-400">Your Base spending insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SpendSystem</h1>
          <p className="text-gray-400">Your Base spending insights</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-red-400">Error Loading Data</h3>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!spendingData) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SpendSystem</h1>
          <p className="text-gray-400">Your Base spending insights</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const monthlyTrend = spendingData.monthlyComparison
    ? {
        value: spendingData.monthlyComparison.percentChange,
        isPositive: spendingData.monthlyComparison.trend === 'down', // Lower spending is positive
      }
    : undefined;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SpendSystem</h1>
        <p className="text-gray-400">Your Base spending insights</p>
        {address && (
          <p className="text-gray-500 text-sm mt-1">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total USDC Spent"
          value={`$${spendingData.totalUSDC.toFixed(2)}`}
          subtitle="Last 30 days"
          trend={monthlyTrend}
        />
        <StatCard
          label="Gas Costs"
          value={`$${spendingData.totalGas.toFixed(2)}`}
          subtitle="Last 30 days"
        />
        <StatCard
          label="Transactions"
          value={spendingData.transactionCount.toString()}
          subtitle="Last 30 days"
        />
      </div>

      {/* Spending Breakdown */}
      {spendingData.topSpending.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
          <div className="space-y-3">
            {spendingData.topSpending.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="text-gray-300">{item.category}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({item.count} {item.count === 1 ? 'transaction' : 'transactions'})
                  </span>
                </div>
                <span className="font-semibold">${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Payments Alert */}
      {spendingData.recurringPayments.length > 0 && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">⚠️ Recurring Payments Detected</h3>
          <p className="text-gray-300 mb-4">
            You have {spendingData.recurringPayments.length} recurring payment
            {spendingData.recurringPayments.length === 1 ? '' : 's'}
          </p>
          <div className="space-y-2">
            {spendingData.recurringPayments.slice(0, 3).map((payment, index) => (
              <div key={index} className="bg-blue-900/20 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{payment.recipientShort}</p>
                    <p className="text-sm text-gray-400">
                      {payment.count} payments • Every ~{Math.round(payment.avgIntervalDays)} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.avgAmount.toFixed(2)}/payment</p>
                    <p className="text-sm text-gray-400">
                      ${payment.totalAmount.toFixed(2)} total
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Options */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setShowTransactions(!showTransactions);
            setShowGasAnalytics(false);
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showTransactions
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {showTransactions ? 'Hide' : 'Show'} Transactions
        </button>
        <button
          onClick={() => {
            setShowGasAnalytics(!showGasAnalytics);
            setShowTransactions(false);
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showGasAnalytics
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          {showGasAnalytics ? 'Hide' : 'Show'} Gas Analytics
        </button>
      </div>

      {/* Transaction List */}
      {showTransactions && <TransactionList transactions={transactions} />}

      {/* Gas Analytics */}
      {showGasAnalytics && <GasAnalytics transactions={transactions} />}
    </div>
  );
}
