'use client';

import { GasAnalyticsProps } from '@/lib/types';

export function GasAnalytics({ transactions }: GasAnalyticsProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-400">No gas data available</p>
      </div>
    );
  }

  const totalGas = transactions.reduce((sum, tx) => sum + tx.gasInUSD, 0);
  const avgGas = totalGas / transactions.length;
  const maxGas = Math.max(...transactions.map(tx => tx.gasInUSD));

  // Find transactions with highest gas
  const highGasThreshold = avgGas * 2;
  const gasSpikes = transactions.filter(tx => tx.gasInUSD > highGasThreshold);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Gas Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Gas Spent</p>
          <p className="text-2xl font-bold">${totalGas.toFixed(4)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Average per TX</p>
          <p className="text-2xl font-bold">${avgGas.toFixed(4)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Highest Gas</p>
          <p className="text-2xl font-bold">${maxGas.toFixed(4)}</p>
        </div>
      </div>

      {gasSpikes.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-yellow-400">
            ⚡ {gasSpikes.length} Gas Spikes Detected
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            These transactions had gas costs significantly higher than average
          </p>
          <div className="space-y-2">
            {gasSpikes.slice(0, 3).map(tx => (
              <div
                key={tx.hash}
                className="flex justify-between items-center text-sm bg-gray-800/50 rounded p-2"
              >
                <span className="text-gray-300">{tx.type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-yellow-400">
                    ${tx.gasInUSD.toFixed(4)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((tx.gasInUSD / avgGas - 1) * 100).toFixed(0)}% above avg)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
