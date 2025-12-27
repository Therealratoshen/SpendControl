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
      <div className="glass-strong rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-bold mb-6">Top Supporters</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-800/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!topDonors || !topDonors[0] || topDonors[0].length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-8 border border-gray-700/50">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Top Supporters
        </h3>
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg font-medium">Be the first to support SpendControl!</p>
        </div>
      </div>
    );
  }

  const [addresses, amounts, badges] = topDonors;

  return (
    <div className="glass-strong rounded-2xl p-8 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Top Supporters
        </h3>
        {stats && (
          <div className="text-sm font-semibold px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            Total: {formatUSD(stats)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {addresses.map((address, index) => {
          const badge = badges[index] as BadgeTier;
          const amount = amounts[index];
          const isTop3 = index < 3;

          return (
            <div
              key={address}
              className={`flex items-center justify-between p-4 rounded-xl transition-all hover-lift ${
                isTop3
                  ? 'bg-gradient-to-r from-yellow-500/20 via-yellow-600/10 to-transparent border-2 border-yellow-500/40'
                  : 'bg-gray-900/50 border border-gray-700 hover:border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-lg ${
                  isTop3 ? 'bg-yellow-500/20 border-2 border-yellow-500/50' : 'bg-gray-800 text-gray-400'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div>
                  <div className="font-mono text-sm flex items-center gap-2">
                    <span className="font-semibold">{address.slice(0, 6)}...{address.slice(-4)}</span>
                    <SupporterBadgeSimple badge={badge} />
                  </div>
                </div>
              </div>
              <div className={`font-bold text-lg ${isTop3 ? 'text-yellow-400' : 'text-blue-400'}`}>
                {formatUSD(amount)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
        <p className="text-gray-400 font-medium">Thank you to all our supporters! 🙏</p>
      </div>
    </div>
  );
}
