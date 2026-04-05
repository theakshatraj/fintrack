import React from 'react';
import { Search, Plus, Download, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { FilterType, SortKey, SortDir } from '../../types';

interface TransactionControlsProps {
  onAdd: () => void;
}

const TransactionControls: React.FC<TransactionControlsProps> = ({ onAdd }) => {
  const { 
    transactions,
    role, 
    typeFilter, setTypeFilter, 
    sortKey, setSortKey, 
    sortDir, setSortDir, 
    searchQuery, setSearchQuery 
  } = useStore();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fintrack_transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search descriptions or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-bg2 border border-border rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-bg2 p-1 rounded-xl border border-border shadow-sm">
          {(['all', 'income', 'expense'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                typeFilter === type 
                  ? 'bg-accent text-bg shadow-md' 
                  : 'text-muted hover:text-text'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative group">
          <select
            value={`${sortKey}-${sortDir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split('-') as [SortKey, SortDir];
              setSortKey(key);
              setSortDir(dir);
            }}
            className="appearance-none pl-10 pr-10 py-2.5 bg-bg2 border border-border rounded-xl text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm cursor-pointer"
          >
            <option value="date-desc">Date ↓</option>
            <option value="date-asc">Date ↑</option>
            <option value="amount-desc">Amount ↓</option>
            <option value="amount-asc">Amount ↑</option>
          </select>
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-text hover:bg-bg2 transition-all shadow-sm"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export JSON</span>
        </button>

        {role === 'admin' && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionControls;
