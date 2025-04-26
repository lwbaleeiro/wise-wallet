// backend/routes/subCategoryRoutes.js
const express = require('express');
const subCategoryController = require('../controllers/subCategoryController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Aplica o middleware isAuthenticated a TODAS as rotas abaixo neste router
router.use(isAuthenticated);

// POST /api/subcategories
router.post('/', subCategoryController.createSubCategory);

// GET /api/subcategories
router.get('/', subCategoryController.getActiveSubCategoriesByUser);

// GET /api/categories/:id
router.get('/:id', subCategoryController.getSubCategoryById);

// GET /api/subcategories/:categoryId
router.get('/:categoryId', subCategoryController.getSubCategoryByCategoryId);

// PUT /api/subcategories/:id
router.put('/:id', subCategoryController.updateSubCategory);

// DELETE /api/subcategories/:id
router.delete('/:id', subCategoryController.deactivateSubCategory);

module.exports = router;