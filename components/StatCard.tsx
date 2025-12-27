import { StatCardProps } from '@/lib/types';

export function StatCard({ label, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold mb-1">{value}</p>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}
