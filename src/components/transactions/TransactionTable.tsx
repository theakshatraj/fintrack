import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatINR } from '../../utils/helpers';
import { useStore } from '../../store/useStore';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit }) => {
  const { role, deleteTransaction } = useStore();

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg3/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Amount</th>
              {role === 'admin' && (
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-bg3/30 transition-colors group">
                  <td className="px-6 py-4 text-sm mono text-muted whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text">{t.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-bg3 border border-border rounded-full text-[10px] font-semibold text-muted uppercase tracking-wider">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-green' : 'bg-red'}`} />
                      <span className={`text-xs font-medium capitalize ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                        {t.type}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm mono font-semibold text-right whitespace-nowrap ${t.type === 'income' ? 'text-green' : 'text-red'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(t)}
                          className="p-1.5 text-muted hover:text-accent hover:bg-bg3 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this transaction?')) deleteTransaction(t.id);
                          }}
                          className="p-1.5 text-muted hover:text-red hover:bg-red/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-12 text-center text-muted italic">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
