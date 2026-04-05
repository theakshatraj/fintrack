import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '../../types';

interface SpendingPieChartProps {
  transactions: Transaction[];
}

const COLORS = ['#c8f075', '#7b8cde', '#ff6b6b', '#6bffb4', '#ffc96b', '#8a8799'];

const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ transactions }) => {
  const expenseTxns = transactions.filter((t) => t.type === 'expense');
  const categoryTotals = expenseTxns.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="card p-6 h-[400px]">
      <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">Spending Distribution</h3>
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingPieChart;
