// src/pages/Categories.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import CreateCategoryModal from '../components/categories/CreateCategoryModal';
import EditCategoryModal from '../components/categories/EditCategoryModal';
import DeleteCategoryModal from '../components/categories/DeleteCategoryModal';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isCreateModalOpen, isDeleteModalOpen, isEditModalOpen]);

  const handleCategoryCreated = () => {
    // When a category is created, we close the modal and refetch categories
    setIsCreateModalOpen(false);
  };

  const handleCategoryDeleted = (deletedCategoryId) => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryEdited = (editedCategory) => {
    // When a category is edited, we close the modal and refetch categories
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-10">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {category.description}
                  </div>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleEditClick(category)} className="text-indigo-500 hover:text-indigo-700 mr-2">
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDeleteClick(category)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />

        {categoryToEdit && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onCategoryEdited={handleCategoryEdited}
          category={categoryToEdit}
        />)}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCategoryDeleted={handleCategoryDeleted}
        category={categoryToDelete}
      />
    </div>
  );
}