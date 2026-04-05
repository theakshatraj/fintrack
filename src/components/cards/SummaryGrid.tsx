import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { calcSummary, getFiltered, formatINR, getSavingsRate, getPrevMonth } from '../../utils/helpers';
import SummaryCard from './SummaryCard';

const SummaryGrid: React.FC = () => {
  const { transactions, monthFilter } = useStore();

  const filteredTxns = getFiltered(transactions, monthFilter);
  const { income, expense, balance } = calcSummary(filteredTxns);
  
  // Previous month comparison
  const prevMonth = monthFilter === 'all' ? null : getPrevMonth(monthFilter);
  const prevTxns = prevMonth ? getFiltered(transactions, prevMonth) : [];
  const prevSummary = calcSummary(prevTxns);

  const calculateDelta = (current: number, previous: number) => {
    if (monthFilter === 'all' || previous === 0) return null;
    const diff = ((current - previous) / previous) * 100;
    return {
      percent: Math.round(Math.abs(diff)),
      isPositive: diff >= 0,
      label: `${diff >= 0 ? '+' : '-'}${Math.round(Math.abs(diff))}%`
    };
  };

  const balanceDelta = calculateDelta(balance, prevSummary.balance);
  const incomeDelta = calculateDelta(income, prevSummary.income);
  const expenseDelta = calculateDelta(expense, prevSummary.expense);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SummaryCard
        label="Total Balance"
        value={formatINR(balance)}
        subValue={balanceDelta ? `${balanceDelta.label} vs last month` : 'No comparison data'}
        subValueColor={balanceDelta ? (balanceDelta.isPositive ? 'text-green' : 'text-red') : 'text-muted'}
        icon={Wallet}
      />
      <SummaryCard
        label="Total Income"
        value={formatINR(income)}
        subValue={incomeDelta ? `${incomeDelta.label} vs last month` : 'No comparison data'}
        subValueColor={incomeDelta ? (incomeDelta.isPositive ? 'text-green' : 'text-red') : 'text-muted'}
        icon={TrendingUp}
      />
      <SummaryCard
        label="Total Expenses"
        value={formatINR(expense)}
        subValue={expenseDelta ? `${expenseDelta.label} vs last month` : 'No comparison data'}
        subValueColor={expenseDelta ? (expenseDelta.isPositive ? 'text-red' : 'text-green') : 'text-muted'}
        icon={TrendingDown}
      />
      <SummaryCard
        label="Savings Rate"
        value={`${getSavingsRate(filteredTxns)}%`}
        subValue={getSavingsRate(filteredTxns) >= 20 ? 'Excellent' : getSavingsRate(filteredTxns) >= 10 ? 'Moderate' : 'Low'}
        subValueColor={getSavingsRate(filteredTxns) >= 10 ? 'text-green' : 'text-amber'}
        icon={Target}
      />
    </div>
  );
};

export default SummaryGrid;
