// backend/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Aplica autenticação a todas as rotas do dashboard
router.use(isAuthenticated);

// Rota principal para buscar o resumo do dashboard
// GET /api/dashboard/summary?period=month|year[&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD]
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;