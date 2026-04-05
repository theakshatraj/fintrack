import React from 'react';
import { useStore } from '../store/useStore';
import { 
  getTopCategory, 
  getSavingsRate, 
  formatINR, 
  calcSummary,
  getFiltered
} from '../utils/helpers';
import InsightCard from '../components/insights/InsightCard';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import { PieChart, TrendingUp, Target, Zap, Calendar, Wallet } from 'lucide-react';

const InsightsPage: React.FC = () => {
  const { transactions } = useStore();

  const topCategory = getTopCategory(transactions);
  const savingsRate = getSavingsRate(transactions);
  
  // Current month (March 2026) vs Previous month (Feb 2026)
  const currentSummary = calcSummary(getFiltered(transactions, '2026-03'));
  const prevSummary = calcSummary(getFiltered(transactions, '2026-02'));
  const expenseChange = prevSummary.expense === 0 
    ? 0 
    : Math.round(((currentSummary.expense - prevSummary.expense) / prevSummary.expense) * 100);

  const expenseTxns = transactions.filter(t => t.type === 'expense');
  const uniqueDays = new Set(expenseTxns.map(t => t.date)).size;
  const avgDailySpend = uniqueDays === 0 ? 0 : Math.round(calcSummary(expenseTxns).expense / uniqueDays);

  const dailyExpenses = expenseTxns.reduce((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  let maxDay = { date: 'N/A', amount: 0 };
  Object.entries(dailyExpenses).forEach(([date, amount]) => {
    if (amount > maxDay.amount) maxDay = { date, amount };
  });

  const incomeStreams = new Set(transactions.filter(t => t.type === 'income').map(t => t.category)).size;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-text">Financial Insights</h1>
        <p className="text-muted mt-1">Deep dive into your spending habits and savings performance.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard
          title="Highest Spending"
          value={topCategory.category}
          subValue={formatINR(topCategory.amount)}
          icon={PieChart}
          color="text-accent2"
        />
        <InsightCard
          title="Expense Trend"
          value={`${expenseChange > 0 ? '+' : ''}${expenseChange}%`}
          subValue="vs previous month"
          icon={TrendingUp}
          color={expenseChange > 0 ? 'text-red' : 'text-green'}
        />
        <InsightCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          subValue={savingsRate >= 20 ? 'Excellent progress' : 'Keep saving!'}
          icon={Target}
          color="text-accent"
        />
        <InsightCard
          title="Avg. Daily Spend"
          value={formatINR(avgDailySpend)}
          subValue="Across active days"
          icon={Wallet}
          color="text-periwinkle"
        />
        <InsightCard
          title="Peak Expense Day"
          value={maxDay.date}
          subValue={formatINR(maxDay.amount)}
          icon={Calendar}
          color="text-amber"
        />
        <InsightCard
          title="Income Streams"
          value={incomeStreams.toString()}
          subValue="Unique sources"
          icon={Zap}
          color="text-green"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text">Monthly Growth</h2>
        <MonthlyBarChart transactions={transactions} months={['2026-01', '2026-02', '2026-03']} />
      </div>
    </div>
  );
};

export default InsightsPage;
