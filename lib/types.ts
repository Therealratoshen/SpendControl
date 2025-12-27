// Transaction types from Basescan API
export interface BasescanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface BasescanTokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface BasescanResponse<T> {
  status: string;
  message: string;
  result: T;
}

// Analyzed spending data
export interface SpendingData {
  totalUSDC: number;
  totalGas: number;
  transactionCount: number;
  topSpending: CategorySpending[];
  recurringPayments: RecurringPayment[];
  monthlyComparison?: MonthlyComparison;
  lastUpdated: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  count: number;
}

export interface RecurringPayment {
  recipient: string;
  recipientShort: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
  avgIntervalDays: number;
  lastPayment: number;
}

export interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  percentChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProcessedTransaction {
  hash: string;
  timestamp: number;
  type: string;
  amount: number;
  gasInUSD: number;
  to: string;
  toShort: string;
  status: 'success' | 'failed';
}

// Cache types
export interface CachedData<T> {
  data: T;
  timestamp: number;
}

// Component props
export interface SpendingDashboardProps {
  address?: string;
}

export interface TransactionListProps {
  transactions: ProcessedTransaction[];
}

export interface GasAnalyticsProps {
  transactions: ProcessedTransaction[];
}

export interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
