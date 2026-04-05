import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Transaction } from '../../types';
import { useStore } from '../../store/useStore';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
];

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { addTransaction, updateTransaction } = useStore();
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: 'Food',
    type: 'expense',
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        date: transactionToEdit.date,
        description: transactionToEdit.description,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        type: transactionToEdit.type,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        category: 'Food',
        type: 'expense',
      });
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionToEdit) {
      updateTransaction({ ...formData, id: transactionToEdit.id });
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-bg2 border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-bg3/50">
          <h2 className="text-xl font-bold text-text m-0">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Weekly Groceries"
              className="w-full px-4 py-3 bg-bg3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-bg3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all mono font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-bg3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all mono font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-bg3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                className="w-full px-4 py-3 bg-bg3 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border rounded-xl text-text font-bold hover:bg-bg3 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-accent text-bg rounded-xl font-bold shadow-lg shadow-accent/20 hover:opacity-90 transition-all"
            >
              {transactionToEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
