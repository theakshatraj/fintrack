import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getMonthlyData, getMonthLabel } from '../../utils/helpers';
import type { Transaction } from '../../types';

interface MonthlyBarChartProps {
  transactions: Transaction[];
  months: string[];
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ transactions, months }) => {
  const data = getMonthlyData(transactions, months);

  return (
    <div className="card p-6 h-[400px]">
      <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">Income vs Expenses</h3>
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={12}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              tickFormatter={(val) => getMonthLabel(val).split(' ')[0]}
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
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
              cursor={{ fill: 'var(--bg3)', opacity: 0.4 }}
            />
            <Bar dataKey="income" fill="var(--green)" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="expense" fill="var(--red)" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
