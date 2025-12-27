'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { BadgeTier, BADGE_INFO, DONATION_CONTRACT_ABI, formatUSD } from '@/lib/donationTypes';

const DONATION_CONTRACT = process.env.NEXT_PUBLIC_DONATION_CONTRACT || '';

export function SupporterBadge() {
  const { address } = useAccount();
  const [badgeInfo, setBadgeInfo] = useState<{
    badge: BadgeTier;
    totalDonated: bigint;
    donationCount: bigint;
  } | null>(null);

  const { data: donorData } = useReadContract({
    address: DONATION_CONTRACT as `0x${string}`,
    abi: DONATION_CONTRACT_ABI,
    functionName: 'getDonor',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!DONATION_CONTRACT,
    },
  });

  useEffect(() => {
    if (donorData) {
      const [totalDonatedUSD, badge, donationCount] = donorData;
      if (Number(totalDonatedUSD) > 0) {
        setBadgeInfo({
          badge: badge as BadgeTier,
          totalDonated: totalDonatedUSD,
          donationCount,
        });
      }
    }
  }, [donorData]);

  if (!badgeInfo || badgeInfo.badge === BadgeTier.None) {
    return null;
  }

  const badge = BADGE_INFO[badgeInfo.badge];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${badge.bgColor} ${badge.borderColor}`}>
      <span className="text-lg">{badge.emoji}</span>
      <div className="text-sm">
        <div className={`font-semibold ${badge.color}`}>{badge.name}</div>
        {badgeInfo.totalDonated && (
          <div className="text-xs text-gray-400">
            {formatUSD(badgeInfo.totalDonated)} donated
          </div>
        )}
      </div>
    </div>
  );
}

export function SupporterBadgeSimple({ badge }: { badge: BadgeTier }) {
  if (badge === BadgeTier.None) {
    return null;
  }

  const badgeInfo = BADGE_INFO[badge];

  return (
    <span className="text-sm" title={badgeInfo.name}>
      {badgeInfo.emoji}
    </span>
  );
}
