// backend/routes/subCategoryRoutes.js
const express = require('express');
const subCategoryController = require('../controllers/subCategoryController');

const router = express.Router();

// Rota para criar uma nova sub categoria
// POST /api/subcategories
router.post('/', subCategoryController.createSubCategory);

// Rota para buscar todas as subcategorias (ativas) de um usuário
// GET /api/subcategories?userId=uuid-do-usuario
router.get('/', subCategoryController.getActiveSubCategoriesByUser);

// Rota para buscar uma subcategoria específica pelo ID
// GET /api/categories/:id?userId=uuid-do-usuario
router.get('/:id', subCategoryController.getSubCategoryById);

// Rota para buscar uma subcategoria especifica pelo ID da categoria
// GET /api/subcategories/:categoryId?userId=uuid-do-usuario
router.get('/:categoryId', subCategoryController.getSubCategoryByCategoryId);

// Rota para atualizar uma subcategoria
// PUT /api/subcategories/:id
router.put('/:id', subCategoryController.updateSubCategory);

// Rota para desativar (soft delete) uma subcategoria
// DELETE /api/subcategories/:id?userId=uuid-do-usuario
router.delete('/:id', subCategoryController.deactivateSubCategory);

module.exports = router;