// backend/routes/transactionRoutes.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Reutiliza o middleware de autenticação

const router = express.Router();

// Aplica autenticação a todas as rotas de transação
router.use(isAuthenticated);

// --- Rotas Protegidas ---

// Criar nova transação
// POST /api/transactions
router.post('/', transactionController.createTransaction);

// Listar transações do usuário (com filtros básicos opcionais)
// GET /api/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&type=income|expense
router.get('/', transactionController.getTransactionsByUser);

// Buscar uma transação específica por ID
// GET /api/transactions/:id
router.get('/:id', transactionController.getTransactionById);

// Atualizar uma transação
// PUT /api/transactions/:id
router.put('/:id', transactionController.updateTransaction);

// Deletar uma transação (Hard Delete)
// DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;