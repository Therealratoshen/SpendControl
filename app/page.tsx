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
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-950 text-white">
      {/* Header with Wallet Connection */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">SpendControl</h1>
              <p className="text-gray-400 text-sm">Base blockchain analytics</p>
            </div>
            {isConnected && <SupporterBadge />}
          </div>
          <Wallet />
        </div>
      </div>

      {/* Main Content */}
      {isConnected && address ? (
        <>
          <SpendingDashboard address={address} />

          {/* Donation Section */}
          <div className="w-full max-w-6xl mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonationWidget />
              <DonorLeaderboard />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-700"
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
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Connect your Base wallet to see detailed spending analytics, track USDC
              transactions, and discover recurring payments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">Track Spending</h3>
                <p className="text-sm text-gray-400">
                  See exactly how much USDC you&apos;ve spent in the last 30 days
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-2">⛽</div>
                <h3 className="font-semibold mb-2">Gas Analytics</h3>
                <p className="text-sm text-gray-400">
                  Monitor gas costs and identify expensive transactions
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-semibold mb-2">Recurring Payments</h3>
                <p className="text-sm text-gray-400">
                  Automatically detect subscriptions and regular payments
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p className="mb-2">Works with any Base wallet address</p>
              <p>
                Don&apos;t have a wallet?{' '}
                <a
                  href="https://www.coinbase.com/wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Get Coinbase Wallet →
                </a>
              </p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-blue-300">Want to see a demo?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try it with this example Base address that has transaction history:
            </p>
            <code className="bg-gray-800 px-3 py-2 rounded text-sm text-blue-300 block">
              0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
            </code>
            <p className="text-gray-500 text-xs mt-2">
              Note: Demo mode will show read-only analytics. Connect your own wallet for full features.
            </p>
          </div>

          {/* Support Section (when not connected) */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">SpendControl is Free Forever</h3>
                <p className="text-gray-400">
                  Built by an indie dev in Indonesia 🇮🇩
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  If SpendControl helps you, consider buying me a coffee ☕
                </p>
              </div>
              <DonorLeaderboard />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
