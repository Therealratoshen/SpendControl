'use client';

import { useReadContract } from 'wagmi';
import { BadgeTier, DONATION_CONTRACT_ABI, formatUSD } from '@/lib/donationTypes';
import { SupporterBadgeSimple } from './SupporterBadge';

const DONATION_CONTRACT = process.env.NEXT_PUBLIC_DONATION_CONTRACT || '';

export function DonorLeaderboard() {
  const { data: topDonors, isLoading } = useReadContract({
    address: DONATION_CONTRACT as `0x${string}`,
    abi: DONATION_CONTRACT_ABI,
    functionName: 'getTopDonors',
    args: [BigInt(10)],
    query: {
      enabled: !!DONATION_CONTRACT,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  });

  const { data: stats } = useReadContract({
    address: DONATION_CONTRACT as `0x${string}`,
    abi: DONATION_CONTRACT_ABI,
    functionName: 'totalDonationsUSD',
    query: {
      enabled: !!DONATION_CONTRACT,
      refetchInterval: 30000,
    },
  });

  if (!DONATION_CONTRACT) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Supporters</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!topDonors || !topDonors[0] || topDonors[0].length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Supporters</h3>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🏆</div>
          <p>Be the first to support SpendSystem!</p>
        </div>
      </div>
    );
  }

  const [addresses, amounts, badges] = topDonors;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Supporters</h3>
        {stats && (
          <div className="text-sm text-gray-400">
            Total: {formatUSD(stats)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {addresses.map((address, index) => {
          const badge = badges[index] as BadgeTier;
          const amount = amounts[index];
          const isTop3 = index < 3;

          return (
            <div
              key={address}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isTop3 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/30' : 'bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  isTop3 ? 'bg-yellow-600/20 text-yellow-400 font-bold' : 'bg-gray-700 text-gray-400'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div>
                  <div className="font-mono text-sm flex items-center gap-2">
                    {address.slice(0, 6)}...{address.slice(-4)}
                    <SupporterBadgeSimple badge={badge} />
                  </div>
                </div>
              </div>
              <div className="font-semibold">
                {formatUSD(amount)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>Thank you to all our supporters! 🙏</p>
      </div>
    </div>
  );
}
