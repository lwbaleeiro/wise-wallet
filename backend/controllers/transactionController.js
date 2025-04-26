// backend/controllers/transactionController.js
const pool = require('../config/db');
const { validate: uuidValidate } = require('uuid');

// Helper function para validar Categoria/Subcategoria (propriedade e vínculo)
const validateCategorySubcategory = async (userId, categoryId, subcategoryId) => {
    if (categoryId && !uuidValidate(categoryId)) {
        return { valid: false, message: 'Formato inválido para categoryId.' };
    }
    if (subcategoryId && !uuidValidate(subcategoryId)) {
        return { valid: false, message: 'Formato inválido para subcategoryId.' };
    }

    if (categoryId) {
        const catResult = await pool.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
        if (catResult.rows.length === 0) {
            return { valid: false, message: 'Categoria não encontrada ou não pertence a este usuário.' };
        }
    }

    if (subcategoryId) {
        const subCatResult = await pool.query('SELECT id, category_id FROM subcategories WHERE id = $1 AND user_id = $2', [subcategoryId, userId]);
        if (subCatResult.rows.length === 0) {
            return { valid: false, message: 'Subcategoria não encontrada ou não pertence a este usuário.' };
        }
        // Se categoryId e subcategoryId foram fornecidos, verifica se a subcategoria pertence à categoria
        if (categoryId && subCatResult.rows[0].category_id !== categoryId) {
            return { valid: false, message: 'Subcategoria não pertence à categoria informada.' };
        }
    }

    return { valid: true };
};


// --- Criar Transação ---
exports.createTransaction = async (req, res) => {
    const userId = req.user.id;
    const { description, amount, date, type, category_id, subcategory_id, notes } = req.body;

    // Validações básicas
    if (!description || amount === undefined || !date || !type) {
        return res.status(400).json({ error: 'Campos obrigatórios: description, amount, date, type.' });
    }
    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'O campo type deve ser "income" ou "expense".' });
    }
    if (isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'O campo amount deve ser um número.' });
    }
    // Validação simples de data (YYYY-MM-DD) - pode ser melhorada
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'O campo date deve estar no formato YYYY-MM-DD.' });
    }

    try {
        // Validação de propriedade de Categoria/Subcategoria
        const validation = await validateCategorySubcategory(userId, category_id, subcategory_id);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const result = await pool.query(
            `INSERT INTO transactions (user_id, description, amount, date, type, category_id, subcategory_id, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [userId, description, parseFloat(amount), date, type, category_id || null, subcategory_id || null, notes || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar transação:', err);
        res.status(500).json({ error: 'Erro interno ao criar transação.' });
    }
};

// --- Listar Transações do Usuário (com join e filtros básicos) ---
exports.getTransactionsByUser = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate, type } = req.query;

    let query = `
        SELECT 
            t.*, 
            c.name as category_name, 
            sc.name as subcategory_name 
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN subcategories sc ON t.subcategory_id = sc.id
        WHERE t.user_id = $1 
    `;
    const queryParams = [userId];
    let paramIndex = 2; // Próximo índice de parâmetro

    if (startDate) {
        query += ` AND t.date >= $${paramIndex++}`;
        queryParams.push(startDate);
    }
    if (endDate) {
        query += ` AND t.date <= $${paramIndex++}`;
        queryParams.push(endDate);
    }
    if (type && (type === 'income' || type === 'expense')) {
        query += ` AND t.type = $${paramIndex++}`;
        queryParams.push(type);
    }

    query += ' ORDER BY t.date DESC, t.created_at DESC'; // Ordena por data e depois por criação

    try {
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar transações:', err);
        res.status(500).json({ error: 'Erro interno ao buscar transações.' });
    }
};

// --- Buscar Transação por ID ---
exports.getTransactionById = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

     if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'Formato de ID inválido.' });
    }

    try {
        const result = await pool.query(
             `SELECT 
                t.*, 
                c.name as category_name, 
                sc.name as subcategory_name 
              FROM transactions t
              LEFT JOIN categories c ON t.category_id = c.id
              LEFT JOIN subcategories sc ON t.subcategory_id = sc.id
              WHERE t.id = $1 AND t.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transação não encontrada ou não pertence a este usuário.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar transação por ID:', err);
        res.status(500).json({ error: 'Erro interno ao buscar transação.' });
    }
};

// --- Atualizar Transação ---
exports.updateTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { description, amount, date, type, category_id, subcategory_id, notes } = req.body;

    if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'Formato de ID inválido.' });
    }

    // Validações dos campos que podem ser atualizados
    if (type && type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'O campo type deve ser "income" ou "expense".' });
    }
    if (amount !== undefined && isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'O campo amount deve ser um número.' });
    }
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'O campo date deve estar no formato YYYY-MM-DD.' });
    }

    try {
        // Valida Categoria/Subcategoria ANTES de tentar atualizar
        const validation = await validateCategorySubcategory(userId, category_id, subcategory_id);
         if (!validation.valid) {
             return res.status(400).json({ error: validation.message });
         }

        // Busca a transação original para comparar e construir a query
        const originalTx = await pool.query('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
        if (originalTx.rows.length === 0) {
             return res.status(404).json({ error: 'Transação não encontrada ou não pertence a este usuário.' });
        }

        // Constrói a query de update dinamicamente
        const fieldsToUpdate = {};
        if (description !== undefined) fieldsToUpdate.description = description;
        if (amount !== undefined) fieldsToUpdate.amount = parseFloat(amount);
        if (date !== undefined) fieldsToUpdate.date = date;
        if (type !== undefined) fieldsToUpdate.type = type;
        // Permite setar categoria/subcategoria como null
        if (category_id !== undefined) fieldsToUpdate.category_id = category_id; 
        if (subcategory_id !== undefined) fieldsToUpdate.subcategory_id = subcategory_id;
        if (notes !== undefined) fieldsToUpdate.notes = notes;
         
        // Adiciona updated_at (o trigger também faz isso)
        fieldsToUpdate.updated_at = 'CURRENT_TIMESTAMP'; 

        const fieldNames = Object.keys(fieldsToUpdate);
        if (fieldNames.length === 0) {
             return res.status(400).json({ error: 'Nenhum campo válido fornecido para atualização.' });
        }

        const setClauses = fieldNames.map((field, index) => `"${field}" = $${index + 1}`);
        const values = fieldNames.map(field => fieldsToUpdate[field]);

        const query = `UPDATE transactions SET ${setClauses.join(', ')} WHERE id = $${fieldNames.length + 1} AND user_id = $${fieldNames.length + 2} RETURNING *`;
        values.push(id, userId);

        const result = await pool.query(query, values);

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Erro ao atualizar transação:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar transação.' });
    }
};

// --- Deletar Transação ---
exports.deleteTransaction = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

     if (!uuidValidate(id)) {
        return res.status(400).json({ error: 'Formato de ID inválido.' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transação não encontrada ou não pertence a este usuário.' });
        }
        // HTTP 204 No Content é semanticamente bom para DELETE bem-sucedido
        res.status(204).send(); 
    } catch (err) {
        console.error('Erro ao deletar transação:', err);
        res.status(500).json({ error: 'Erro interno ao deletar transação.' });
    }
};