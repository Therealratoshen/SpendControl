import {
  BasescanResponse,
  BasescanTransaction,
  BasescanTokenTransfer,
  CachedData,
} from './types';

const BASESCAN_API_URL = 'https://api.basescan.org/api';
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache utilities
function getCacheKey(address: string, type: string): string {
  return `basescan_${type}_${address.toLowerCase()}`;
}

function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const data: CachedData<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// API call with rate limiting
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 200; // 5 calls per second = 200ms between calls

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;

  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall));
  }

  lastCallTime = Date.now();
  return fetch(url);
}

/**
 * Fetch all transactions for a given address
 */
export async function fetchTransactions(
  address: string
): Promise<BasescanTransaction[]> {
  const cacheKey = getCacheKey(address, 'transactions');
  const cached = getCache<BasescanTransaction[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  if (!apiKey) {
    throw new Error('Basescan API key not configured');
  }

  const url = `${BASESCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

  try {
    const response = await rateLimitedFetch(url);
    const data: BasescanResponse<BasescanTransaction[]> = await response.json();

    if (data.status !== '1') {
      throw new Error(data.message || 'Failed to fetch transactions');
    }

    const transactions = data.result;
    setCache(cacheKey, transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

/**
 * Fetch USDC token transfers for a given address
 */
export async function fetchUSDCTransfers(
  address: string
): Promise<BasescanTokenTransfer[]> {
  const cacheKey = getCacheKey(address, 'usdc_transfers');
  const cached = getCache<BasescanTokenTransfer[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  if (!apiKey) {
    throw new Error('Basescan API key not configured');
  }

  const url = `${BASESCAN_API_URL}?module=account&action=tokentx&contractaddress=${USDC_CONTRACT}&address=${address}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await rateLimitedFetch(url);
    const data: BasescanResponse<BasescanTokenTransfer[]> = await response.json();

    if (data.status !== '1') {
      // If no transactions found, return empty array instead of throwing
      if (data.message === 'No transactions found') {
        return [];
      }
      throw new Error(data.message || 'Failed to fetch USDC transfers');
    }

    const transfers = data.result;
    setCache(cacheKey, transfers);
    return transfers;
  } catch (error) {
    console.error('Error fetching USDC transfers:', error);
    throw error;
  }
}

/**
 * Calculate total gas costs in USD for transactions
 * @param transactions - Array of transactions
 * @param ethPriceUSD - Current ETH price in USD (default: 3000)
 */
export function calculateGasCosts(
  transactions: BasescanTransaction[],
  ethPriceUSD: number = 3000
): number {
  const totalGasWei = transactions.reduce((sum, tx) => {
    const gasUsed = BigInt(tx.gasUsed);
    const gasPrice = BigInt(tx.gasPrice);
    const gasCost = gasUsed * gasPrice;
    return sum + gasCost;
  }, BigInt(0));

  // Convert Wei to ETH (1 ETH = 10^18 Wei)
  const totalGasETH = Number(totalGasWei) / 1e18;

  // Convert ETH to USD
  return totalGasETH * ethPriceUSD;
}

/**
 * Get transactions from the last N days
 */
export function getRecentTransactions(
  transactions: BasescanTransaction[],
  days: number = 30
): BasescanTransaction[] {
  const cutoffTime = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
  return transactions.filter(tx => parseInt(tx.timeStamp) >= cutoffTime);
}

/**
 * Get USDC transfers from the last N days
 */
export function getRecentUSDCTransfers(
  transfers: BasescanTokenTransfer[],
  days: number = 30
): BasescanTokenTransfer[] {
  const cutoffTime = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
  return transfers.filter(tx => parseInt(tx.timeStamp) >= cutoffTime);
}

/**
 * Check if a transaction is a USDC transfer
 */
export function isUSDCTransfer(tx: BasescanTransaction): boolean {
  return (
    tx.to?.toLowerCase() === USDC_CONTRACT.toLowerCase() &&
    tx.input.startsWith('0xa9059cbb')
  );
}

/**
 * Calculate total USDC spent (outgoing transfers only)
 * USDC has 6 decimals
 */
export function calculateUSDCSpent(
  transfers: BasescanTokenTransfer[],
  userAddress: string
): number {
  const spent = transfers
    .filter(tx => tx.from.toLowerCase() === userAddress.toLowerCase())
    .reduce((sum, tx) => {
      const amount = BigInt(tx.value);
      return sum + amount;
    }, BigInt(0));

  // Convert from USDC smallest unit (6 decimals) to USDC
  return Number(spent) / 1e6;
}
