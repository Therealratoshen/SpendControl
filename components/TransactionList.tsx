'use client';

import { TransactionListProps } from '@/lib/types';

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{tx.type}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    tx.status === 'success'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                To: {tx.toShort}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {tx.type.includes('Sent') ? '-' : '+'}${tx.amount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                Gas: ${tx.gasInUSD.toFixed(4)}
              </div>
              <a
                href={`https://basescan.org/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
              >
                View on Basescan →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
