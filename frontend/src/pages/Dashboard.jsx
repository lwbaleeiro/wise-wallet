// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BanknotesIcon, 
  ScaleIcon 
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = dateRange;
        const response = await api.get(`/dashboard/summary?startDate=${startDate}&endDate=${endDate}`);
        setSummary(response.data);
      } catch (error) {
        console.error('Erro ao carregar resumo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [dateRange]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="text-center py-10">Carregando dados...</div>;
  }

  const stats = [
    {
      name: 'Saldo Total',
      value: summary?.balance ? `R$ ${summary.balance.toFixed(2)}` : 'R$ 0,00',
      icon: BanknotesIcon,
      change: summary?.balanceChange || 0,
      changeType: summary?.balanceChange >= 0 ? 'increase' : 'decrease'
    },
    {
      name: 'Receitas',
      value: summary?.totalIncome ? `R$ ${summary.totalIncome.toFixed(2)}` : 'R$ 0,00',
      icon: ArrowUpIcon,
      change: summary?.incomeChange || 0,
      changeType: 'increase'
    },
    {
      name: 'Despesas',
      value: summary?.totalExpenses ? `R$ ${summary.totalExpenses.toFixed(2)}` : 'R$ 0,00',
      icon: ArrowDownIcon,
      change: summary?.expenseChange || 0,
      changeType: 'decrease'
    },
    {
      name: 'Economia',
      value: summary?.savingsRate ? `${(summary.savingsRate * 100).toFixed(0)}%` : '0%',
      icon: ScaleIcon,
      change: summary?.savingsRateChange ? (summary.savingsRateChange * 100).toFixed(0) : 0,
      changeType: summary?.savingsRateChange >= 0 ? 'increase' : 'decrease'
    }
  ];

  // Preparar dados para o gráfico
  const chartData = summary?.dailyBalance?.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR'),
    receitas: item.income,
    despesas: item.expense,
    saldo: item.balance
  })) || [];

  return (
    <div>
      {/* Seletor de data */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="flex items-center">
                  {stat.change !== 0 ? (
                    <>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon
                          className="h-4 w-4 flex-shrink-0 self-center text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowDownIcon
                          className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`ml-1 ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {Math.abs(stat.change)}% em relação ao período anterior
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">Sem alteração</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução Financeira</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="receitas" stroke="#10B981" name="Receitas" />
              <Line type="monotone" dataKey="despesas" stroke="#EF4444" name="Despesas" />
              <Line type="monotone" dataKey="saldo" stroke="#3B82F6" name="Saldo" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categorias principais */}
      {summary?.topCategories && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Principais Categorias de Despesas</h2>
            <div className="space-y-4">
              {summary.topCategories.expenses.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-medium text-gray-700">
                        R$ {category.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Principais Categorias de Receitas</h2>
            <div className="space-y-4">
              {summary.topCategories.income.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-medium text-gray-700">
                        R$ {category.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}