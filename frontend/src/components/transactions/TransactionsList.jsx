// src/components/transactions/TransactionsList.jsx
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TransactionsList({ transactions, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
        <p className="mt-2 text-gray-600">Carregando transações...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className="font-medium">
                      {transaction.type === 'income' ? '+' : '-'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.category?.name || 'Sem categoria'} 
                      {transaction.subcategory && ` > ${transaction.subcategory.name}`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  {transaction.notes && (
                    <span className="truncate">
                      {transaction.notes}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
