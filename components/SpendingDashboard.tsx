'use client';

import { useState, useEffect } from 'react';
import { SpendingDashboardProps, SpendingData, ProcessedTransaction } from '@/lib/types';
import { fetchTransactions, fetchUSDCTransfers } from '@/lib/basescan';
import { analyzeSpending, processTransactions } from '@/lib/analyzer';
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
          <h1 className="text-4xl font-bold mb-2">SpendControl</h1>
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
          <h1 className="text-4xl font-bold mb-2">SpendControl</h1>
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
    <div className="w-full py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Your Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Spending insights for the last 30 days</p>
        {address && (
          <p className="text-gray-500 text-sm mt-2 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-strong rounded-2xl p-6 border border-blue-500/20 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
              💵
            </div>
            {monthlyTrend && (
              <div className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                monthlyTrend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {monthlyTrend.isPositive ? '↓' : '↑'} {Math.abs(monthlyTrend.value).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-2">Total USDC Spent</p>
          <p className="text-3xl font-bold text-white mb-1">
            ${spendingData.totalUSDC.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-cyan-500/20 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
              ⛽
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">Gas Costs</p>
          <p className="text-3xl font-bold text-white mb-1">
            ${spendingData.totalGas.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-purple-500/20 hover-lift">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">Transactions</p>
          <p className="text-3xl font-bold text-white mb-1">
            {spendingData.transactionCount.toString()}
          </p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
      </div>

      {/* Spending Breakdown */}
      {spendingData.topSpending.length > 0 && (
        <div className="glass-strong rounded-2xl p-8 mb-10 border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Spending Breakdown
          </h2>
          <div className="space-y-4">
            {spendingData.topSpending.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-colors">
                <div>
                  <span className="text-white font-medium">{item.category}</span>
                  <span className="text-gray-500 text-sm ml-3">
                    {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                </div>
                <span className="font-bold text-xl text-blue-400">${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Payments Alert */}
      {spendingData.recurringPayments.length > 0 && (
        <div className="glass-strong rounded-2xl p-8 mb-10 border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            Recurring Payments Detected
          </h3>
          <p className="text-gray-300 mb-6">
            Found {spendingData.recurringPayments.length} recurring payment
            {spendingData.recurringPayments.length === 1 ? '' : 's'}
          </p>
          <div className="space-y-4">
            {spendingData.recurringPayments.slice(0, 3).map((payment, index) => (
              <div key={index} className="bg-gray-900/60 rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white mb-1">{payment.recipientShort}</p>
                    <p className="text-sm text-gray-400">
                      {payment.count} payments • Every ~{Math.round(payment.avgIntervalDays)} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-orange-400">${payment.avgAmount.toFixed(2)}/payment</p>
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
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            showTransactions
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
              : 'glass border border-gray-700 hover:border-blue-500/50 text-gray-300 hover:text-white'
          }`}
        >
          {showTransactions ? 'Hide' : 'Show'} Transactions
        </button>
        <button
          onClick={() => {
            setShowGasAnalytics(!showGasAnalytics);
            setShowTransactions(false);
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            showGasAnalytics
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
              : 'glass border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white'
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
