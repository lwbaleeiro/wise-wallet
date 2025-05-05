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
    getValues, // Adicionado para ler valores atuais do form
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
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Estado para rastrear carregamento de categorias
  // Observa o valor ATUAL do campo category_id no formulário
  const selectedCategoryId = watch('category_id');

  // 1. Efeito para carregar categorias da API
  useEffect(() => {
    setIsLoadingCategories(true); // Marca início do carregamento
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data || []); // Garante que seja um array
        console.log("Categorias carregadas:", response.data); // DEBUG
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategories([]); // Define como vazio em caso de erro
      } finally {
        setIsLoadingCategories(false); // Marca fim do carregamento (sucesso ou erro)
      }
    };

    fetchCategories();
  }, []); // Array de dependências vazio: executa apenas uma vez no mount

  // 2. Efeito para INICIALIZAR/RESETAR o formulário com dados da transação (ou padrões)
  //    Este efeito AGORA DEPENDE do fim do carregamento das categorias
  useEffect(() => {
    // Só tenta resetar se as categorias JÁ foram carregadas (ou a tentativa falhou)
    if (!isLoadingCategories) {
      if (transaction) {
        // Modo Edição: preenche com dados da transação
        console.log("Tentando aplicar reset com transaction:", transaction, "- Categorias carregadas:", !isLoadingCategories); // DEBUG
        reset({
          description: transaction.description || '',
          // Garante que o valor seja tratado como string para o input type="number" funcionar bem inicialmente
          amount: String(transaction.amount || ''),
          // Garante que a data esteja no formato YYYY-MM-DD
          date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
          type: transaction.type || 'expense',
          // GARANTIR que IDs sejam STRINGS para correspondência com <option value="...">
          category_id: transaction.category_id ? String(transaction.category_id) : '',
          subcategory_id: transaction.subcategory_id ? String(transaction.subcategory_id) : '',
          notes: transaction.notes || ''
        });
        // Verifica os valores logo após o reset (pode precisar de um pequeno delay para refletir no watch)
        setTimeout(() => console.log("Valores FORM APÓS reset (via getValues):", getValues()), 0); // DEBUG
      } else {
        // Modo Novo: reseta para os valores padrão definidos em useForm
        console.log("Aplicando reset para nova transação."); // DEBUG
        reset({
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category_id: '',
          subcategory_id: '',
          notes: ''
        });
      }
    }
  }, [transaction, reset, isLoadingCategories, getValues]); // Depende da transaction, da função reset E do estado de carregamento das categorias

  // 3. Efeito para carregar e filtrar SUBCATEGORIAS baseado na CATEGORIA selecionada no formulário
  useEffect(() => {
    // Só executa se category_id tiver um valor selecionado (não ser string vazia)
    if (!selectedCategoryId) {
      setSubcategories([]); // Limpa as opções de subcategoria
      // Se uma categoria foi des-selecionada, limpa também o valor no formulário
      // Verifica se o valor atual não é já vazio para evitar chamadas desnecessárias
       if (getValues('subcategory_id') !== '') {
            setValue('subcategory_id', '', { shouldDirty: false }); // Reseta silenciosamente
       }
      return; // Para a execução se não há categoria
    }

    let isMounted = true; // Flag para evitar atualização de estado em componente desmontado
    const fetchSubcategories = async () => {
      console.log("Buscando subcategorias para category_id:", selectedCategoryId); // DEBUG
      try {
        // Idealmente, filtre no backend: await api.get(`/subcategories?categoryId=${selectedCategoryId}`);
        // Se não for possível, busque todas e filtre no frontend:
        const response = await api.get('/subcategories');
        const filtered = (response.data || []).filter(sub =>
            // Comparação segura como strings
            String(sub.category_id) === String(selectedCategoryId)
        );

        if (isMounted) {
            console.log('Subcategorias filtradas:', filtered); // DEBUG
            setSubcategories(filtered); // Atualiza as opções do select de subcategoria

            // --- Lógica de Reset ao Mudar Categoria ---
            // Pega o valor ATUAL do campo subcategory_id no formulário
            const currentFormSubcategoryId = String(getValues('subcategory_id') || '');

            // Verifica se um valor de subcategoria existe no formulário E
            // se esse valor NÃO está presente na nova lista filtrada
            if (currentFormSubcategoryId && !filtered.some(sub => String(sub.id) === currentFormSubcategoryId)) {
                 console.log(`Resetando subcategoria ${currentFormSubcategoryId} pois não pertence mais à categoria ${selectedCategoryId}`); // DEBUG
                 setValue('subcategory_id', '', { shouldDirty: true }); // Reseta o valor no formulário
             } else if (currentFormSubcategoryId){
                 console.log(`Subcategoria ${currentFormSubcategoryId} mantida pois pertence à categoria ${selectedCategoryId}.`); //DEBUG
             } else {
                 console.log(`Nenhuma subcategoria estava selecionada ou a lista foi limpa.`); // DEBUG
             }
        }

      } catch (error) {
        console.error('Erro ao carregar subcategorias:', error);
        if (isMounted) {
          setSubcategories([]); // Limpa opções em caso de erro
          // Também reseta o valor selecionado no formulário em caso de erro
          setValue('subcategory_id', '', { shouldDirty: true });
        }
      }
    };

    fetchSubcategories();

    // Função de cleanup que será executada quando o componente for desmontado
    // ou antes da próxima execução do efeito
    return () => {
      isMounted = false; // Marca como desmontado para evitar setar estado
    };
  // Depende APENAS da categoria selecionada (selectedCategoryId)
  // setValue e getValues são estáveis e não precisam causar re-execução por si só, mas são listados por linting.
  }, [selectedCategoryId, setValue, getValues]);

  // Função chamada ao submeter o formulário
  const onSubmit = (data) => {
    // Converte amount para número de ponto flutuante
    data.amount = parseFloat(data.amount) || 0; // Garante que seja número, ou 0 se falhar

    // Garante que IDs vazios ("") sejam enviados como `null` para o backend
    // Adapte se seu backend espera "" ou omissão do campo
    data.category_id = data.category_id || null;
    data.subcategory_id = data.subcategory_id || null;

    console.log("Dados para salvar:", data); // DEBUG
    onSave(data); // Chama a função passada por props para salvar
  };

  // Não renderiza nada se o modal não estiver aberto
  if (!isOpen) return null;

  // DEBUG: Log para ver os valores do formulário antes da renderização do JSX
  // console.log("Valores do formulário ANTES do RENDER:", getValues());

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
                type="button" // Boa prática para botões que não submetem forms
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
                      type="number" // Mantém type number para validação e teclado numérico
                      id="amount"
                      step="0.01" // Permite centavos
                      min="-9999999999" // Ajuste os limites conforme necessário
                      max="9999999999"
                      {...register('amount', {
                        required: 'Valor é obrigatório',
                        valueAsNumber: false, // Trata como string inicialmente devido ao reset
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
                    {/* Não há erro de validação explícito aqui, mas 'required' cobre */}
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
                    {...register('category_id')} // Adicione validação required se necessário
                    // Desabilita enquanto carrega categorias para evitar seleção prematura
                    disabled={isLoadingCategories}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    {isLoadingCategories ? (
                      <option value="">Carregando categorias...</option>
                    ) : (
                      <>
                        <option value="">Selecione uma categoria</option>
                        {/* Mapeia as categorias carregadas */}
                        {categories.map(category => (
                          // GARANTIR STRING NO VALUE para correspondência correta
                          <option key={category.id} value={String(category.id)}>
                            {category.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {/* Adicione {errors.category_id && <p>...</p>} se for obrigatório */}
                </div>

                {/* Subcategoria */}
                <div>
                  <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
                    Subcategoria
                  </label>
                  <select
                    id="subcategory_id"
                    {...register('subcategory_id')} // Não obrigatório por padrão
                    // Desabilita se:
                    // 1. Categoria não selecionada
                    // 2. OU Categoria está selecionada MAS não há subcategorias filtradas (ou ainda não carregaram)
                    disabled={!selectedCategoryId || subcategories.length === 0}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  >
                    {/* Opção padrão dinâmica */}
                    {!selectedCategoryId ? (
                      <option value="">Selecione uma categoria primeiro</option>
                    ) : subcategories.length === 0 ? (
                      // Se a categoria está selecionada mas não há subcategorias
                      <option value="">Nenhuma subcategoria encontrada</option>
                      // Poderia ter um estado de loading para subcategorias também
                    ) : (
                      // Se categoria selecionada E há subcategorias
                      <option value="">Selecione uma subcategoria</option>
                    )}

                    {/* Mapeia as subcategorias filtradas */}
                    {subcategories.map(sub => (
                      // GARANTIR STRING NO VALUE
                      <option key={sub.id} value={String(sub.id)}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  {/* Adicione {errors.subcategory_id && <p>...</p>} se for obrigatório */}
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
                  {/* Não há erro de validação aqui */}
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
                  type="button" // Garante que não submete o formulário
                  onClick={onClose} // Chama a função para fechar o modal
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