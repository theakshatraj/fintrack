import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDailyBalance } from '../../utils/helpers';
import type { Transaction } from '../../types';

interface BalanceTrendChartProps {
  transactions: Transaction[];
}

const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({ transactions }) => {
  const data = getDailyBalance(transactions);

  return (
    <div className="card p-6 h-[400px]">
      <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">Balance Trend</h3>
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(date) => date.split('-').slice(1).join('/')}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg2)',
                borderColor: 'var(--border)',
                borderRadius: '12px',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Balance']}
              labelStyle={{ color: 'var(--muted)', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--accent2)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: 'var(--accent2)', stroke: 'var(--bg)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrendChart;
