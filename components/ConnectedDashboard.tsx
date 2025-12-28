'use client';

import { useState, useEffect } from 'react';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { fetchTransactions, fetchUSDCTransfers } from '@/lib/basescan';
import { analyzeGas, type GasAnalysis } from '@/lib/gasAnalyzer';
import { analyzeTrends, type TrendAnalysis } from '@/lib/trendAnalyzer';
import { BasescanTransaction, BasescanTokenTransfer } from '@/lib/types';
import { DonationWidget } from './DonationWidget';
import { DonorLeaderboard } from './DonorLeaderboard';
import { SupporterBadge } from './SupporterBadge';

interface ConnectedDashboardProps {
  address: string;
}

export default function ConnectedDashboard({ address }: ConnectedDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<BasescanTransaction[]>([]);
  const [_usdcTransfers, setUsdcTransfers] = useState<BasescanTokenTransfer[]>([]);
  const [gasAnalysis, setGasAnalysis] = useState<GasAnalysis | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from Basescan
        const [txs, usdc] = await Promise.all([
          fetchTransactions(address),
          fetchUSDCTransfers(address)
        ]);

        setTransactions(txs);
        setUsdcTransfers(usdc);

        // Analyze data
        const gas = analyzeGas(txs);
        const trends = analyzeTrends(txs, usdc);

        setGasAnalysis(gas);
        setTrendAnalysis(trends);

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load data. Please check your API key and try again.'
        );
        setLoading(false);
      }
    }

    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-800 animate-pulse"></div>
              <div>
                <div className="h-6 w-40 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-strong rounded-2xl p-6 border border-gray-700/50 animate-pulse">
                <div className="h-12 w-12 bg-gray-800 rounded-xl mb-4"></div>
                <div className="h-4 w-24 bg-gray-800 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4 text-red-400">Error Loading Data</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalUSDC = trendAnalysis?.thisMonth.totalSpent || 0;
  const totalGas = gasAnalysis?.totalGasSpent || 0;
  const txCount = transactions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                  $
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    SpendControl
                  </h1>
                  <p className="text-gray-400 text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
                </div>
              </div>
              <SupporterBadge />
            </div>
            <Wallet />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total USDC */}
            <div className="glass-strong rounded-2xl p-6 border border-blue-500/20 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                  💵
                </div>
                {trendAnalysis && (
                  <div className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                    trendAnalysis.percentChange.spending < 0
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trendAnalysis.percentChange.spending < 0 ? '↓' : '↑'} {Math.abs(trendAnalysis.percentChange.spending).toFixed(1)}%
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">Total USDC Spent</p>
              <p className="text-3xl font-bold text-white mb-1">
                ${totalUSDC.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>

            {/* Gas Costs */}
            <div className="glass-strong rounded-2xl p-6 border border-cyan-500/20 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
                  ⛽
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">Gas Costs</p>
              <p className="text-3xl font-bold text-white mb-1">
                ${totalGas.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>

            {/* Transactions */}
            <div className="glass-strong rounded-2xl p-6 border border-purple-500/20 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                  📊
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">Transactions</p>
              <p className="text-3xl font-bold text-white mb-1">
                {txCount}
              </p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>

          {/* Gas Efficiency & Insights */}
          {gasAnalysis && (
            <div className="glass-strong rounded-2xl p-8 mb-10 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Gas Optimization
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Efficiency Rating</span>
                    <span className={`text-2xl font-bold ${
                      gasAnalysis.efficiency.rating === 'excellent' ? 'text-green-400' :
                      gasAnalysis.efficiency.rating === 'good' ? 'text-blue-400' :
                      gasAnalysis.efficiency.rating === 'average' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {gasAnalysis.efficiency.rating.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    You&apos;re in the top {gasAnalysis.efficiency.percentile}% for gas optimization
                  </div>
                  <div className="text-sm text-gray-500">
                    Average gas: {gasAnalysis.avgGasInGwei.toFixed(2)} Gwei
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 mb-2">Potential Monthly Savings</div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ${gasAnalysis.savingsPotential.monthly.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {gasAnalysis.highGasTxs.count} high-gas transactions detected
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-400 mb-3">💡 Optimization Tips:</h3>
                <ul className="space-y-2">
                  {gasAnalysis.savingsPotential.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Spending Trends */}
          {trendAnalysis && (
            <div className="glass-strong rounded-2xl p-8 mb-10 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Spending Trends
              </h2>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-6">
                <p className="text-lg text-blue-300 mb-2">
                  💡 Insight
                </p>
                <p className="text-white font-medium">
                  {trendAnalysis.insight}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">vs Average User</div>
                  <div className="text-lg font-semibold text-white mb-1">
                    Gas: {trendAnalysis.vsAverage.gasEfficiency.rating.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Top {trendAnalysis.vsAverage.gasEfficiency.percentile}%
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Spending Volume</div>
                  <div className="text-lg font-semibold text-white">
                    {trendAnalysis.vsAverage.spendingVolume.rating.toUpperCase()}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Activity Level</div>
                  <div className="text-lg font-semibold text-white">
                    {trendAnalysis.vsAverage.activityLevel.rating.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Value Delivered Section */}
          {gasAnalysis && trendAnalysis && (
            <div className="glass-strong rounded-2xl p-8 mb-10 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">💎</span>
                Value Delivered by SpendControl
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Money Saved */}
                <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-xl p-6 border border-green-500/20">
                  <div className="text-green-400 text-sm font-semibold mb-2">💰 Money Saved</div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${gasAnalysis.savingsPotential.monthly.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Potential monthly savings from gas optimization
                  </div>
                </div>

                {/* Time Saved */}
                <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
                  <div className="text-blue-400 text-sm font-semibold mb-2">⏱️ Time Saved</div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ~{Math.ceil(gasAnalysis.highGasTxs.count / 4)} hrs
                  </div>
                  <div className="text-sm text-gray-400">
                    Time saved by avoiding high-gas transactions
                  </div>
                </div>

                {/* Insights Provided */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl p-6 border border-cyan-500/20">
                  <div className="text-cyan-400 text-sm font-semibold mb-2">💡 Insights</div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {gasAnalysis.savingsPotential.tips.length + 1}
                  </div>
                  <div className="text-sm text-gray-400">
                    Actionable insights to optimize spending
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-green-500/20">
                <h3 className="text-lg font-semibold text-green-300 mb-3">
                  🎯 How SpendControl Helped You
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Identified {gasAnalysis.highGasTxs.count} high-gas transactions worth ${gasAnalysis.highGasTxs.totalWasted.toFixed(2)} in wasted fees</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Provided {gasAnalysis.savingsPotential.tips.length} specific optimization tips for your spending patterns</span>
                  </li>
                  <li className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Tracked your efficiency ranking: Top {gasAnalysis.efficiency.percentile}% of Base users</span>
                  </li>
                  {trendAnalysis.percentChange.spending < 0 && (
                    <li className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Helped you reduce spending by {Math.abs(trendAnalysis.percentChange.spending).toFixed(1)}% vs last month</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Donation Section */}
          <div className="w-full mt-16 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonationWidget />
              <DonorLeaderboard />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2024 SpendControl. Built on Base 🔵
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a
                href="https://basescan.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Basescan ↗
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
