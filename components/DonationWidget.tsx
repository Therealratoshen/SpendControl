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
    <div className="w-full max-w-2xl mx-auto">
      {!showWidget ? (
        <button
          onClick={() => setShowWidget(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">☕</span>
            <span>Support SpendControl</span>
          </div>
        </button>
      ) : (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Support SpendControl</h3>
              <p className="text-gray-400 text-sm">
                SpendControl is free forever, built by an indie dev in Indonesia 🇮🇩
              </p>
            </div>
            <button
              onClick={() => setShowWidget(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Donation Tiers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {DONATION_TIERS.map((t, index) => (
              <button
                key={t.name}
                onClick={() => setSelectedTier(index)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTier === index
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{t.emoji}</div>
                <div className="font-semibold">${t.amountUSD}</div>
                <div className="text-xs text-gray-400 mt-1">{t.name}</div>
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Payment Method</label>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod('ETH')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'ETH'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold">ETH</div>
                <div className="text-sm text-gray-400">{tier.amountETH} ETH</div>
              </button>
              <button
                onClick={() => setPaymentMethod('USDC')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'USDC'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold">USDC</div>
                <div className="text-sm text-gray-400">${tier.amountUSDC}</div>
              </button>
            </div>
          </div>

          {/* Selected Tier Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  {tier.emoji} {tier.description}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Unlock {tier.name} badge
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              />
              <TransactionStatus className="mt-4" />
            </Transaction>
          ) : (
            <div className="text-center py-4 text-gray-400">
              Connect your wallet to donate
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>100% of donations go directly to the creator</p>
            <p className="mt-1">Your support helps keep SpendControl free for everyone</p>
          </div>
        </div>
      )}
    </div>
  );
}
