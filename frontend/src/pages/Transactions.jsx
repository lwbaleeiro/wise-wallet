// src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import TransactionModal from '../components/transactions/TransactionModal';
import TransactionsList from '../components/transactions/TransactionsList';
import UploadCSVModal from '../components/transactions/UploadCSVModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = '/transactions';
      const params = new URLSearchParams();
      
      if (filter.type !== 'all') params.append('type', filter.type);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.search) params.append('search', filter.search);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.get(url);
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      await api.post('/transactions', transactionData);
      fetchTransactions();
      setShowTransactionModal(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await api.put(`/transactions/${id}`, transactionData);
      fetchTransactions();
      setShowTransactionModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchTransactions();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Nova Transação
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
            Importar CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filter.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filter.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Descrição, notas..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <TransactionsList
        transactions={transactions}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteTransaction}
      />

      {/* Modal de Transação */}
      {showTransactionModal && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setEditingTransaction(null);
          }}
          onSave={editingTransaction ? 
            (data) => handleUpdateTransaction(editingTransaction.id, data) : 
            handleAddTransaction}
          transaction={editingTransaction}
        />
      )}

      {/* Modal de Upload CSV */}
      {showUploadModal && (
        <UploadCSVModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}  