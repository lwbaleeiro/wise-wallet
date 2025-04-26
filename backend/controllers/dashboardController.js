// backend/controllers/dashboardController.js
const pool = require('../config/db');
const { 
    startOfMonth, endOfMonth, startOfYear, endOfYear, 
    format, isValid, parseISO 
} = require('date-fns');

exports.getDashboardSummary = async (req, res) => {
    const userId = req.user.id;
    const { period, startDate: queryStartDate, endDate: queryEndDate } = req.query;

    let startDate, endDate;
    const now = new Date(); // Data atual do servidor

    // Determina o intervalo de datas baseado nos query parameters
    try {
        if (queryStartDate && queryEndDate) {
            startDate = parseISO(queryStartDate);
            endDate = parseISO(queryEndDate);
            if (!isValid(startDate) || !isValid(endDate)) {
                throw new Error('Datas de início ou fim inválidas.');
            }
        } else if (period === 'year') {
            startDate = startOfYear(now);
            endDate = endOfYear(now);
        } else { // Default para 'month' ou se nenhum período for especificado
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
        }
        
        // Formata para YYYY-MM-DD para usar no SQL
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        // --- Executa as consultas SQL em paralelo ---
        const promises = [
            // 1. Total de Receitas (Income)
            pool.query(
                `SELECT COALESCE(SUM(amount), 0) as total 
                 FROM transactions 
                 WHERE user_id = $1 AND type = 'income' AND date BETWEEN $2 AND $3`,
                [userId, formattedStartDate, formattedEndDate]
            ),
            // 2. Total de Despesas (Expense) - Valor será negativo ou zero
            pool.query(
                `SELECT COALESCE(SUM(amount), 0) as total 
                 FROM transactions 
                 WHERE user_id = $1 AND type = 'expense' AND date BETWEEN $2 AND $3`,
                [userId, formattedStartDate, formattedEndDate]
            ),
            // 3. Gastos por Categoria (Apenas despesas)
            pool.query(
                `SELECT 
                     c.id as "categoryId", 
                     c.name as "categoryName", 
                     COALESCE(SUM(t.amount), 0) as "totalAmount" 
                 FROM transactions t 
                 JOIN categories c ON t.category_id = c.id 
                 WHERE t.user_id = $1 AND t.type = 'expense' AND t.date BETWEEN $2 AND $3 
                 GROUP BY c.id, c.name 
                 ORDER BY "totalAmount" ASC`, // Mais negativo (maior gasto) primeiro
                 [userId, formattedStartDate, formattedEndDate]
            ),
             // 4. Transações Recentes (sem filtro de data, apenas as últimas 5)
            pool.query(
                `SELECT t.*, c.name as category_name, sc.name as subcategory_name 
                 FROM transactions t
                 LEFT JOIN categories c ON t.category_id = c.id
                 LEFT JOIN subcategories sc ON t.subcategory_id = sc.id
                 WHERE t.user_id = $1 
                 ORDER BY t.date DESC, t.created_at DESC 
                 LIMIT 5`,
                [userId]
            )
        ];

        const [
            incomeResult, 
            expenseResult, 
            spendingByCategoryResult, 
            recentTransactionsResult
        ] = await Promise.all(promises);

        const totalIncome = parseFloat(incomeResult.rows[0].total);
        // O total de despesas já vem negativo ou zero do banco
        const totalExpenses = parseFloat(expenseResult.rows[0].total); 
        // O saldo é a soma algébrica (receitas positivas, despesas negativas)
        const balance = totalIncome + totalExpenses; 

        // Formata o resultado final
        const summary = {
            period: {
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            },
            totalIncome: totalIncome,
             // Retorna o valor absoluto para exibição mais clara, mas o cálculo do saldo usa o valor original
            totalExpensesDisplay: Math.abs(totalExpenses), 
            balance: balance,
            // Mapeia os resultados dos gastos, pegando o valor absoluto para exibição
            spendingByCategory: spendingByCategoryResult.rows.map(row => ({
                 ...row,
                 totalAmount: Math.abs(parseFloat(row.totalAmount)) // Valor absoluto para exibição
             })),
            recentTransactions: recentTransactionsResult.rows,
        };

        res.status(200).json(summary);

    } catch (err) {
        console.error('Erro ao buscar resumo do dashboard:', err);
         if (err.message.includes('Datas de início ou fim inválidas')) {
             res.status(400).json({ error: err.message });
         } else {
             res.status(500).json({ error: 'Erro interno ao buscar resumo do dashboard.' });
         }
    }
};