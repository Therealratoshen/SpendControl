// Donation system types and utilities

export enum BadgeTier {
  None = 0,
  Bronze = 1,
  Silver = 2,
  Gold = 3,
  Diamond = 4,
}

export interface DonationTier {
  name: string;
  emoji: string;
  amountUSD: number;
  amountETH: string;
  amountUSDC: string;
  badge: BadgeTier;
  description: string;
}

export interface Donor {
  address: string;
  totalDonatedUSD: number;
  badge: BadgeTier;
  donationCount: number;
  lastDonationTime: number;
}

export interface DonationStats {
  totalDonationsUSD: number;
  totalDonors: number;
}

export const DONATION_TIERS: DonationTier[] = [
  {
    name: 'Coffee',
    emoji: '☕',
    amountUSD: 5,
    amountETH: '0.00167',
    amountUSDC: '5',
    badge: BadgeTier.Bronze,
    description: 'Buy me a coffee',
  },
  {
    name: 'Pizza',
    emoji: '🍕',
    amountUSD: 15,
    amountETH: '0.005',
    amountUSDC: '15',
    badge: BadgeTier.Silver,
    description: 'Buy me a pizza',
  },
  {
    name: 'Gift',
    emoji: '🎁',
    amountUSD: 30,
    amountETH: '0.01',
    amountUSDC: '30',
    badge: BadgeTier.Gold,
    description: 'Send me a gift',
  },
  {
    name: 'Diamond',
    emoji: '💎',
    amountUSD: 100,
    amountETH: '0.0333',
    amountUSDC: '100',
    badge: BadgeTier.Diamond,
    description: 'Be a diamond supporter',
  },
];

export const BADGE_INFO = {
  [BadgeTier.None]: {
    name: 'No Badge',
    emoji: '',
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
  },
  [BadgeTier.Bronze]: {
    name: 'Bronze Supporter',
    emoji: '🥉',
    color: 'text-amber-600',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-600/50',
  },
  [BadgeTier.Silver]: {
    name: 'Silver Supporter',
    emoji: '🥈',
    color: 'text-gray-300',
    bgColor: 'bg-gray-700/20',
    borderColor: 'border-gray-400/50',
  },
  [BadgeTier.Gold]: {
    name: 'Gold Supporter',
    emoji: '🥇',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/50',
  },
  [BadgeTier.Diamond]: {
    name: 'Diamond Supporter',
    emoji: '💎',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/20',
    borderColor: 'border-cyan-500/50',
  },
};

// Contract ABI (minimal, only what we need)
export const DONATION_CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_usdcAddress', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'donor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amountUSD', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'isETH', type: 'bool' },
      { indexed: false, internalType: 'uint8', name: 'newBadge', type: 'uint8' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'DonationReceived',
    type: 'event',
  },
  {
    inputs: [],
    name: 'donateETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'donateUSDC',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'donor', type: 'address' }],
    name: 'getDonor',
    outputs: [
      { internalType: 'uint256', name: 'totalDonatedUSD', type: 'uint256' },
      { internalType: 'uint8', name: 'badge', type: 'uint8' },
      { internalType: 'uint256', name: 'donationCount', type: 'uint256' },
      { internalType: 'uint256', name: 'lastDonationTime', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'limit', type: 'uint256' }],
    name: 'getTopDonors',
    outputs: [
      { internalType: 'address[]', name: 'addresses', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'uint8[]', name: 'badges', type: 'uint8[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDonationsUSD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDonors',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// USDC Contract ABI (minimal - approve and transfer)
export const USDC_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function formatUSD(amountInSmallestUnit: bigint | number): string {
  const num = typeof amountInSmallestUnit === 'bigint'
    ? Number(amountInSmallestUnit) / 1e6
    : amountInSmallestUnit / 1e6;
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getBadgeForAmount(amountUSD: number): BadgeTier {
  if (amountUSD >= 100) return BadgeTier.Diamond;
  if (amountUSD >= 30) return BadgeTier.Gold;
  if (amountUSD >= 15) return BadgeTier.Silver;
  if (amountUSD >= 5) return BadgeTier.Bronze;
  return BadgeTier.None;
}
