'use client';

import { SpendingDashboard } from '@/components/SpendingDashboard';
import { DonationWidget } from '@/components/DonationWidget';
import { DonorLeaderboard } from '@/components/DonorLeaderboard';
import { SupporterBadge } from '@/components/SupporterBadge';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Header with Wallet Connection */}
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
                  <p className="text-gray-400 text-sm">Base blockchain analytics</p>
                </div>
              </div>
              {isConnected && <SupporterBadge />}
            </div>
            <Wallet />
          </div>
        </div>

        {/* Main Content */}
        {isConnected && address ? (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SpendingDashboard address={address} />

            {/* Donation Section */}
            <div className="w-full mt-16 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonationWidget />
                <DonorLeaderboard />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center py-20">
              <div className="mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                  <svg
                    className="w-24 h-24 mx-auto text-blue-500/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Master Your On-Chain Spending
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
                Track USDC transactions, analyze gas costs, and discover recurring payments
              </p>
              <p className="text-lg text-gray-500 mb-12">
                Built for Base blockchain
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                <div className="glass-strong rounded-2xl p-8 hover-lift border border-blue-500/20">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl mb-4 mx-auto">
                    💰
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Track Spending</h3>
                  <p className="text-gray-400">
                    See exactly how much USDC you&apos;ve spent in the last 30 days with detailed breakdowns
                  </p>
                </div>
                <div className="glass-strong rounded-2xl p-8 hover-lift border border-cyan-500/20">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl mb-4 mx-auto">
                    ⛽
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Gas Analytics</h3>
                  <p className="text-gray-400">
                    Monitor gas costs and identify expensive transactions to optimize your spending
                  </p>
                </div>
                <div className="glass-strong rounded-2xl p-8 hover-lift border border-purple-500/20">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl mb-4 mx-auto">
                    🔄
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Recurring Payments</h3>
                  <p className="text-gray-400">
                    Automatically detect subscriptions and regular payments you might have missed
                  </p>
                </div>
              </div>

              <div className="text-gray-500 mb-8">
                <p className="mb-3">Works with any Base wallet address</p>
                <p>
                  Don&apos;t have a wallet?{' '}
                  <a
                    href="https://www.coinbase.com/wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Get Coinbase Wallet →
                  </a>
                </p>
              </div>
            </div>

            {/* Demo Section */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="glass-strong rounded-2xl p-8 border border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-blue-300">Want to see a demo?</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Try it with this example Base address that has transaction history:
                    </p>
                    <code className="bg-gray-950/50 px-4 py-3 rounded-lg text-sm text-cyan-300 block font-mono border border-cyan-500/20">
                      0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                    </code>
                    <p className="text-gray-500 text-xs mt-3">
                      Note: Demo mode shows read-only analytics. Connect your own wallet for full features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="glass-strong rounded-2xl p-10 border border-gray-700/50">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      SpendControl is Free Forever
                    </span>
                  </h3>
                  <p className="text-gray-400 text-lg mb-2">
                    Built by an indie dev in Indonesia 🇮🇩
                  </p>
                  <p className="text-gray-500">
                    If SpendControl helps you, consider buying me a coffee ☕
                  </p>
                </div>
                <DonorLeaderboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
