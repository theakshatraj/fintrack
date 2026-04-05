import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Transaction } from '../types';
import TransactionControls from '../components/transactions/TransactionControls';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';

const TransactionsPage: React.FC = () => {
  const { transactions, searchQuery, typeFilter, sortKey, sortDir } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredAndSortedTxns = useMemo(() => {
    let result = [...transactions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sortKey === 'amount') {
        comparison = a.amount - b.amount;
      } else {
        comparison = a[sortKey].localeCompare(b[sortKey]);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchQuery, typeFilter, sortKey, sortDir]);

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-text">Transactions</h1>
        <p className="text-muted mt-1">Manage and track your detailed financial history.</p>
      </header>

      <TransactionControls onAdd={handleAdd} />
      
      <TransactionTable 
        transactions={filteredAndSortedTxns} 
        onEdit={handleEdit} 
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
