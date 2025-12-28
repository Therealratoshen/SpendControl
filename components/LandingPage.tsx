'use client';

import { Wallet } from '@coinbase/onchainkit/wallet';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
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
            <Wallet />
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Master Your On-Chain Spending
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto">
              Track USDC transactions, optimize gas, and analyze spending trends on Base
            </p>
            <p className="text-lg text-gray-500">
              Built for Base blockchain
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="glass-strong rounded-2xl p-8 hover-lift border border-blue-500/20">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl mb-6 mx-auto">
                💰
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Track Spending</h3>
              <p className="text-gray-400 text-center">
                See exactly how much USDC you&apos;ve spent in the last 30 days with detailed breakdowns
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 hover-lift border border-cyan-500/20">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl mb-6 mx-auto">
                ⚡
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Gas Optimization</h3>
              <p className="text-gray-400 text-center">
                Monitor gas costs and identify expensive transactions to optimize your spending
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 hover-lift border border-purple-500/20">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl mb-6 mx-auto">
                📊
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Spending Trends</h3>
              <p className="text-gray-400 text-center">
                Track how your spending changes over time and compare to other Base users
              </p>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="text-center mb-12">
            <p className="text-gray-500 mb-3">Works with any Base wallet</p>
            <p>
              Don&apos;t have a wallet?{' '}
              <a
                href="https://www.coinbase.com/wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                Get Coinbase Wallet →
              </a>
            </p>
          </div>

          {/* Demo Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="glass-strong rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">Want to see a demo?</h3>
                  <p className="text-gray-400 mb-4">
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
          <div className="max-w-4xl mx-auto">
            <div className="glass-strong rounded-2xl p-10 border border-gray-700/50 text-center">
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  SpendControl is Free Forever
                </span>
              </h3>
              <p className="text-xl text-gray-400 mb-2">
                Built by an indie dev in Indonesia 🇮🇩
              </p>
              <p className="text-gray-500">
                If SpendControl helps you, consider buying me a coffee ☕
              </p>
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
