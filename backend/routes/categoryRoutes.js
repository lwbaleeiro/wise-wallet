// backend/routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Aplica o middleware isAuthenticated a TODAS as rotas abaixo neste router
router.use(isAuthenticated); 

// POST /api/categories
router.post('/', categoryController.createCategory);

// GET /api/categories/
router.get('/', categoryController.getActiveCategoriesByUser);

// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', categoryController.deactivateCategory); // Usando DELETE para desativar

module.exports = router;