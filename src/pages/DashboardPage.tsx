import React from 'react';
import { useStore } from '../store/useStore';
import { getFiltered, getMonthLabel, formatINR } from '../utils/helpers';
import SummaryGrid from '../components/cards/SummaryGrid';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';
import { Calendar, ChevronDown } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { transactions, monthFilter, setMonthFilter } = useStore();

  const filteredTxns = getFiltered(transactions, monthFilter);
  const recentTxns = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const months = ['all', '2026-01', '2026-02', '2026-03'];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text">Financial Overview</h1>
          <p className="text-muted flex items-center gap-2">
            <Calendar size={14} />
            {getMonthLabel(monthFilter)}
          </p>
        </div>

        <div className="relative group min-w-[180px]">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-bg2 border border-border rounded-xl text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>{getMonthLabel(m)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
        </div>
      </header>

      <SummaryGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceTrendChart transactions={filteredTxns} />
        </div>
        <div className="lg:col-span-1">
          <SpendingPieChart transactions={filteredTxns} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Recent Activity</h2>
          <button className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">
            View All
          </button>
        </div>
        
        <div className="card divide-y divide-border">
          {recentTxns.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4 hover:bg-bg3/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-green' : 'bg-red'}`} />
                <div>
                  <p className="text-sm font-medium text-text">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-bg3 border border-border rounded-full text-[10px] font-semibold text-muted uppercase tracking-wider">
                      {t.category}
                    </span>
                    <span className="text-[10px] mono text-muted">{t.date}</span>
                  </div>
                </div>
              </div>
              <p className={`text-sm mono font-bold ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
