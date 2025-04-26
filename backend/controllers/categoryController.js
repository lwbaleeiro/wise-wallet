// backend/controllers/categoryController.js
const pool = require('../config/db'); 

// --- Criar Categoria ---
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
            [name, userId] 
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar categoria:', err);
        if (err.code === '23505' && err.constraint === 'categories_user_id_name_unique') {
            return res.status(409).json({ error: 'Já existe uma categoria com este nome para este usuário.' });
        }
        res.status(500).json({ error: 'Erro interno ao criar categoria.' });
    }
};

// --- Buscar Todas as Categorias Ativas de um Usuário ---
exports.getActiveCategoriesByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1 AND is_active = true ORDER BY name ASC',
            [userId] 
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        res.status(500).json({ error: 'Erro interno ao buscar categorias.' });
    }
};

// --- Buscar Categoria por ID ---
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada ou não pertence a este usuário.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar categoria por ID:', err);
        res.status(500).json({ error: 'Erro interno ao buscar categoria.' });
    }
};

// --- Atualizar Categoria ---
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const userId = req.user.id;

    // Permite atualizar nome ou status ou ambos
    if (name === undefined && isActive === undefined) {
         return res.status(400).json({ error: 'Pelo menos um campo (name ou isActive) deve ser fornecido para atualização.' });
    }

    const fields = [];
    const values = [];
    let query = 'UPDATE categories SET ';

     if (name !== undefined) {
        fields.push(`name = $${values.length + 1}`);
        values.push(name);
    }
    if (isActive !== undefined) {
        fields.push(`is_active = $${values.length + 1}`);
        values.push(isActive);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`); 

    query += fields.join(', ');
    query += ` WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING *`;
    values.push(id, userId); 

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada ou não pertence a este usuário.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar categoria:', err);
        if (err.code === '23505' && err.constraint === 'categories_user_id_name_unique') {
            return res.status(409).json({ error: 'Já existe outra categoria com este nome para este usuário.' });
        }
        res.status(500).json({ error: 'Erro interno ao atualizar categoria.' });
    }
};

// --- Desativar Categoria (Soft Delete) ---
exports.deactivateCategory = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId] 
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada ou não pertence a este usuário.' });
        }
        res.status(200).json({ message: 'Categoria desativada com sucesso.' });
    } catch (err) {
        console.error('Erro ao desativar categoria:', err);
        res.status(500).json({ error: 'Erro interno ao desativar categoria.' });
    }
};