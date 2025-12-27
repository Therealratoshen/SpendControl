'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Transaction, TransactionButton, TransactionStatus } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { DONATION_TIERS, DONATION_CONTRACT_ABI, USDC_ABI } from '@/lib/donationTypes';
import { parseEther, parseUnits } from 'viem';

const DONATION_CONTRACT = process.env.NEXT_PUBLIC_DONATION_CONTRACT || '';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export function DonationWidget() {
  const { isConnected } = useAccount();
  const [selectedTier, setSelectedTier] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'USDC'>('ETH');
  const [showWidget, setShowWidget] = useState(false);

  if (!DONATION_CONTRACT) {
    return null; // Contract not deployed yet
  }

  const tier = DONATION_TIERS[selectedTier];

  const handleOnStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      console.log('Donation successful!', status);
      // Could add confetti or success animation here
    }
  };

  const contracts = paymentMethod === 'ETH'
    ? [
        {
          address: DONATION_CONTRACT as `0x${string}`,
          abi: DONATION_CONTRACT_ABI,
          functionName: 'donateETH',
          args: [],
          value: parseEther(tier.amountETH),
        },
      ]
    : [
        // First approve USDC
        {
          address: USDC_ADDRESS as `0x${string}`,
          abi: USDC_ABI,
          functionName: 'approve',
          args: [DONATION_CONTRACT as `0x${string}`, parseUnits(tier.amountUSDC, 6)],
        },
        // Then donate
        {
          address: DONATION_CONTRACT as `0x${string}`,
          abi: DONATION_CONTRACT_ABI,
          functionName: 'donateUSDC',
          args: [parseUnits(tier.amountUSDC, 6)],
        },
      ];

  return (
    <div className="w-full">
      {!showWidget ? (
        <button
          onClick={() => setShowWidget(true)}
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 animate-gradient"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">☕</span>
            <span className="text-xl">Support SpendControl</span>
          </div>
        </button>
      ) : (
        <div className="glass-strong rounded-2xl p-8 border border-blue-500/30 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Support SpendControl
              </h3>
              <p className="text-gray-400">
                SpendControl is free forever, built by an indie dev in Indonesia 🇮🇩
              </p>
            </div>
            <button
              onClick={() => setShowWidget(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Donation Tiers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {DONATION_TIERS.map((t, index) => (
              <button
                key={t.name}
                onClick={() => setSelectedTier(index)}
                className={`p-5 rounded-xl border-2 transition-all duration-200 hover-lift ${
                  selectedTier === index
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-blue-500/50'
                }`}
              >
                <div className="text-4xl mb-3">{t.emoji}</div>
                <div className="font-bold text-lg">${t.amountUSD}</div>
                <div className="text-sm text-gray-400 mt-1">{t.name}</div>
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-400 mb-3 block">Payment Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod('ETH')}
                className={`flex-1 py-4 px-5 rounded-xl border-2 transition-all ${
                  paymentMethod === 'ETH'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-transparent shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-blue-500/50'
                }`}
              >
                <div className="font-bold text-lg">ETH</div>
                <div className="text-sm text-gray-400 mt-1">{tier.amountETH} ETH</div>
              </button>
              <button
                onClick={() => setPaymentMethod('USDC')}
                className={`flex-1 py-4 px-5 rounded-xl border-2 transition-all ${
                  paymentMethod === 'USDC'
                    ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-transparent shadow-lg shadow-cyan-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-cyan-500/50'
                }`}
              >
                <div className="font-bold text-lg">USDC</div>
                <div className="text-sm text-gray-400 mt-1">${tier.amountUSDC}</div>
              </button>
            </div>
          </div>

          {/* Selected Tier Info */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 mb-8 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold flex items-center gap-2 mb-2">
                  <span className="text-3xl">{tier.emoji}</span>
                  {tier.description}
                </div>
                <div className="text-sm text-gray-400">
                  Unlock {tier.name} badge
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${tier.amountUSD}
              </div>
            </div>
          </div>

          {/* Donate Button */}
          {isConnected ? (
            <Transaction
              chainId={8453}
              calls={contracts}
              onStatus={handleOnStatus}
            >
              <TransactionButton
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              />
              <TransactionStatus className="mt-6" />
            </Transaction>
          ) : (
            <div className="text-center py-6 px-6 bg-gray-900/50 rounded-xl border border-gray-700">
              <p className="text-gray-400 font-medium">Connect your wallet to donate</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center text-sm text-gray-400">
            <p className="font-medium mb-2">100% of donations go directly to the creator</p>
            <p className="text-gray-500">Your support helps keep SpendControl free for everyone</p>
          </div>
        </div>
      )}
    </div>
  );
}
