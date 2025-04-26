import { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import EditSubcategoryModal from '../components/subcategories/EditSubcategoryModal';
import DeleteSubcategoryModal from '../components/subcategories/DeleteSubcategoryModal';
import CreateSubcategoryModal from '../components/subcategories/CreateSubcategoryModal';

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/subcategories');
        setSubcategories(response.data);
      } catch (err) {
        console.error('Erro ao carregar subcategorias:', err);
        setError('Erro ao carregar subcategorias. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [isModalOpen, isDeleteModalOpen, isEditModalOpen]);

  const handleSubcategoryCreated = () => {
    // When a subcategory is created, we close the modal and refetch subcategories
    setIsModalOpen(false);
  };

  const handleSubcategoryDeleted = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteClick = (subcategory) => {
    setSubcategoryToDelete(subcategory);
    setIsModalOpen(false);
    setIsDeleteModalOpen(true)
  };

  const handleEditClick = (subcategory) => {
    setSubcategoryToEdit(subcategory);
    setIsEditModalOpen(true);
  };

  const handleSubcategoryEdited = () => {
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-10">Carregando subcategorias...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Subcategorias</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Subcategoria
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {subcategory.name}
                    </div>
                    <div className="ml-4 text-sm text-gray-500">
                      {subcategory.description}
                    </div>
                    {subcategory.category && (
                      <div className="ml-4 text-sm text-gray-500">
                        Categoria: {subcategory.category.name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleEditClick(subcategory)} className="text-indigo-500 hover:text-indigo-700 mr-2">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(subcategory)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <CreateSubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubcategoryCreated={handleSubcategoryCreated}
      />

      <DeleteSubcategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubcategoryDeleted={handleSubcategoryDeleted}
        subcategory={subcategoryToDelete}
      />
      
      {subcategoryToEdit && (
        <EditSubcategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubcategoryEdited={handleSubcategoryEdited}
          subcategory={subcategoryToEdit}
        />)}
    </div>
  );
}