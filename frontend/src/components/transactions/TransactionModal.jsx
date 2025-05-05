import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import api from '../../services/api'; // Certifique-se que o caminho está correto

export default function TransactionModal({ isOpen, onClose, onSave, transaction }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      type: 'expense',
      category_id: '', // Usar string vazia como padrão
      subcategory_id: '', // Usar string vazia como padrão
      notes: ''
    }
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Novo estado para controlar carga inicial
  
  // Observa o valor ATUAL do campo category_id no formulário
  const selectedCategoryId = watch('category_id');

  // 1. Efeito para carregar categorias da API
  useEffect(() => {
    setIsLoadingCategories(true);
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 2. Efeito para carregar e filtrar subcategorias com base na categoria selecionada
  // Este efeito será responsável por buscar TODAS as subcategorias no caso de uma edição
  useEffect(() => {
    // Função para buscar todas as subcategorias (sem filtro por categoria)
    const fetchAllSubcategories = async () => {
      try {
        const response = await api.get('/subcategories');
        return response.data || [];
      } catch (error) {
        console.error('Erro ao carregar todas as subcategorias:', error);
        return [];
      }
    };

    // Função para buscar subcategorias filtradas por categoria
    const fetchFilteredSubcategories = async (categoryId) => {
      try {
        // Idealmente, filtre no backend. Se não for possível, busque todas e filtre no frontend:
        const response = await api.get('/subcategories');
        return (response.data || []).filter(sub => 
          String(sub.category_id) === String(categoryId)
        );
      } catch (error) {
        console.error('Erro ao carregar subcategorias:', error);
        return [];
      }
    };

    // Caso especial: carga inicial com transaction existente
    // Necessitamos de TODAS as subcategorias para encontrar a correta
    if (isInitialLoad && transaction && transaction.subcategory_id) {
      // Busca todas as subcategorias para poder encontrar a que corresponde à transação
      fetchAllSubcategories().then(allSubs => {
        // Encontra a subcategoria da transação
        const transactionSubcategory = allSubs.find(
          sub => String(sub.id) === String(transaction.subcategory_id)
        );
        
        if (transactionSubcategory) {
          // Define o valor da categoria correspondente à subcategoria
          setValue('category_id', String(transactionSubcategory.category_id), { shouldDirty: false });
          
          // Filtra as subcategorias para essa categoria
          const filteredSubs = allSubs.filter(
            sub => String(sub.category_id) === String(transactionSubcategory.category_id)
          );
          setSubcategories(filteredSubs);
          
          // Define o valor da subcategoria
          setValue('subcategory_id', String(transaction.subcategory_id), { shouldDirty: false });
          
          console.log("Ajustando subcategoria inicial:", {
            subcategory_id: transaction.subcategory_id,
            category_id: transactionSubcategory.category_id,
            availableSubs: filteredSubs.map(s => ({ id: s.id, name: s.name }))
          });
        }
        
        // Marca o fim da carga inicial
        setIsInitialLoad(false);
      });
      
      return; // Interrompe a execução do efeito para não executar o código abaixo
    }
    
    // Comportamento normal: filtrar subcategorias com base na categoria selecionada
    if (!selectedCategoryId) {
      setSubcategories([]);
      if (getValues('subcategory_id') !== '') {
        setValue('subcategory_id', '', { shouldDirty: false });
      }
      return;
    }

    let isMounted = true;
    fetchFilteredSubcategories(selectedCategoryId).then(filtered => {
      if (isMounted) {
        setSubcategories(filtered);
        
        // Lógica de Reset ao Mudar Categoria
        const currentFormSubcategoryId = String(getValues('subcategory_id') || '');
        if (currentFormSubcategoryId && !filtered.some(sub => String(sub.id) === currentFormSubcategoryId)) {
          setValue('subcategory_id', '', { shouldDirty: true });
        }
      }
    });

    // Marca o fim da carga inicial caso ainda não tenha sido marcado
    setIsInitialLoad(false);

    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, setValue, getValues, transaction, isInitialLoad]);

  // 3. Efeito para inicializar/resetar o formulário com dados da transação
  useEffect(() => {
    if (!isLoadingCategories && transaction) {
      reset({
        description: transaction.description || '',
        amount: String(transaction.amount || ''),
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        type: transaction.type || 'expense',
        // NÃO definimos category_id e subcategory_id aqui, isso é feito no efeito específico acima
        notes: transaction.notes || ''
      });
      
      // *** IMPORTANTE: Para debug ***
      console.log("Valores do formulário após reset inicial:", {
        formValues: getValues(),
        transaction: transaction
      });
    } else if (!isLoadingCategories) {
      reset({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category_id: '',
        subcategory_id: '',
        notes: ''
      });
      setIsInitialLoad(false); // Garante que o modo inicial seja desligado para uma nova transação
    }
  }, [transaction, reset, isLoadingCategories, getValues]);

  // Função chamada ao submeter o formulário
  const onSubmit = (data) => {
    data.amount = parseFloat(data.amount) || 0;
    data.category_id = data.category_id || null;
    data.subcategory_id = data.subcategory_id || null;
    onSave(data);
  };

  // Não renderiza nada se o modal não estiver aberto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Centraliza o conteúdo do modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Conteúdo do Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {transaction ? 'Editar Transação' : 'Nova Transação'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="space-y-4">

                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="description"
                    {...register('description', { required: 'Descrição é obrigatória' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Valor e Tipo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Valor
                    </label>
                    <input
                      type="number"
                      id="amount"
                      step="0.01"
                      min="-9999999999"
                      max="9999999999"
                      {...register('amount', {
                        required: 'Valor é obrigatório',
                        valueAsNumber: false,
                        validate: {
                          isNumber: value => !isNaN(parseFloat(value)) || 'Valor inválido',
                          notZero: value => parseFloat(value) !== 0 || 'O valor não pode ser zero'
                        }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      id="type"
                      {...register('type', { required: 'Tipo é obrigatório' })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                </div>

                {/* Data */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    {...register('date', { required: 'Data é obrigatória' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                    Categoria
                  </label>
                  <select
                    id="category_id"
                    {...register('category_id')}
                    disabled={isLoadingCategories}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    {isLoadingCategories ? (
                      <option value="">Carregando categorias...</option>
                    ) : (
                      <>
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={String(category.id)}>
                            {category.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Subcategoria */}
                <div>
                  <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
                    Subcategoria
                  </label>
                  <select
                    id="subcategory_id"
                    {...register('subcategory_id')}
                    disabled={!selectedCategoryId || subcategories.length === 0}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    {!selectedCategoryId ? (
                      <option value="">Selecione uma categoria primeiro</option>
                    ) : subcategories.length === 0 ? (
                      <option value="">Nenhuma subcategoria encontrada</option>
                    ) : (
                      <>
                        <option value="">Selecione uma subcategoria</option>
                        {subcategories.map(sub => (
                          <option key={sub.id} value={String(sub.id)}>
                            {sub.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Notas */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    {...register('notes')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Adicione observações sobre a transação..."
                  ></textarea>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                >
                  {transaction ? 'Salvar Alterações' : 'Adicionar Transação'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}