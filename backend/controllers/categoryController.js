// backend/routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Rota para criar uma nova categoria
// POST /api/categories
router.post('/', categoryController.createCategory);

// Rota para buscar todas as categorias (ativas) de um usuário
// GET /api/categories?userId=uuid-do-usuario
router.get('/', categoryController.getActiveCategoriesByUser);

// Rota para buscar uma categoria específica pelo ID
// GET /api/categories/:id?userId=uuid-do-usuario
router.get('/:id', categoryController.getCategoryById);

// Rota para atualizar uma categoria
// PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// Rota para desativar (soft delete) uma categoria
// DELETE /api/categories/:id?userId=uuid-do-usuario
router.delete('/:id', categoryController.deactivateCategory); // Usando DELETE para desativar

module.exports = router;