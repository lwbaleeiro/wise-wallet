// backend/controllers/subCategoryController.js
const pool = require('../config/db');

// --- Criar subCategoria ---
exports.createSubCategory = async (req, res) => {
    // !!! ATENÇÃO: user_id virá da autenticação no futuro. Por agora, pegamos do body. !!!
    const { name, categoryId, userId } = req.body; 

    if (!name || !userId) {
        return res.status(400).json({ error: 'Nome da categoria e userId são obrigatórios.' });
    }

    if (!categoryId) { 
        return res.status(400).json({ error: 'categoryId é obrigatório.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO subcategories (name, category_id, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, categoryId, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar subcategoria:', err);
        // Verifica erro de constraint única (nome duplicado para o mesmo usuário)
        if (err.code === '23505' && err.constraint === 'subcategories_user_id_name_unique') {
            return res.status(409).json({ error: 'Já existe uma subcategoria com este nome para este usuário.' });
        }
        res.status(500).json({ error: 'Erro interno ao criar subcategoria.' });
    }
};

// --- Buscar Todas as SubCategorias Ativas de um Usuário ---
exports.getActiveSubCategoriesByUser = async (req, res) => {
    // !!! ATENÇÃO: user_id virá da autenticação no futuro. Por agora, pegamos da query string. !!!
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório como query parameter.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM subcategories WHERE user_id = $1 AND is_active = true ORDER BY name ASC',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar subcategorias:', err);
        res.status(500).json({ error: 'Erro interno ao buscar subcategorias.' });
    }
};

// --- Buscar SubCategoria por ID ---
exports.getSubCategoryById = async (req, res) => {
    const { id } = req.params;
    // !!! ATENÇÃO: user_id virá da autenticação no futuro. Por agora, pegamos da query string. !!!
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório como query parameter.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM subcategories WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SubCategoria não encontrada ou pertence a outro usuário.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar Subcategoria por ID:', err);
        res.status(500).json({ error: 'Erro interno ao buscar categoria.' });
    }
};

// --- Buscar SubCategoria por Categoria ID ---
exports.getSubCategoryByCategoryId = async (req, res) => {

    const { categoryId } = req.body; 
    const { userId } = req.query; 

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório como query parameter.' });
    }

    if (!categoryId) { 
        return res.status(400).json({ error: 'categoryId é obrigatório.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM subcategories WHERE category_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SubCategoria não encontrada para o ID da categoria informado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar Subcategoria por categoria ID:', err);
        res.status(500).json({ error: 'Erro interno ao buscar categoria.' });
    }
};

// --- Atualizar SubCategoria ---
exports.updateSubCategory = async (req, res) => {
    
    const { id } = req.params;
    const { name, isActive, userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório no corpo da requisição.' });
    }

    // Permite atualizar nome ou status ou ambos
    if (name === undefined && isActive === undefined) {
         return res.status(400).json({ error: 'Pelo menos um campo (name ou isActive) deve ser fornecido para atualização.' });
    }

    // Constrói a query dinamicamente para atualizar apenas os campos fornecidos
    const fields = [];
    const values = [];
    let query = 'UPDATE sub subcategories SET ';

    if (name !== undefined) {
        fields.push(`name = $${fields.length + 1}`);
        values.push(name);
    }
    if (isActive !== undefined) {
        fields.push(`is_active = $${fields.length + 1}`);
        values.push(isActive);
    }
    
    // Adiciona updated_at (trigger deve fazer isso, mas garantimos aqui também)
    fields.push(`updated_at = CURRENT_TIMESTAMP`); 

    query += fields.join(', ');
    query += ` WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`;
    values.push(id, userId);

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'SubCategoria não encontrada ou pertence a outro usuário.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar subcategoria:', err);
         // Verifica erro de constraint única (nome duplicado para o mesmo usuário)
        if (err.code === '23505' && err.constraint === 'subcategories_user_id_name_unique') {
            return res.status(409).json({ error: 'Já existe outra subcategoria com este nome para este usuário.' });
        }
        res.status(500).json({ error: 'Erro interno ao atualizar categoria.' });
    }
};

// --- Desativar Categoria (Soft Delete) ---
exports.deactivateSubCategory = async (req, res) => {
    const { id } = req.params;
     // !!! ATENÇÃO: user_id virá da autenticação no futuro. Por agora, pegamos da query string. !!!
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório como query parameter.' });
    }

    try {
        const result = await pool.query(
            'UPDATE subcategories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING id', // Retorna só o ID para confirmar
            [id, userId]
        );

        if (result.rowCount === 0) { // Verifica se alguma linha foi afetada
            return res.status(404).json({ error: 'SubCategoria não encontrada ou pertence a outro usuário.' });
        }
        res.status(200).json({ message: 'SubCategoria desativada com sucesso.' }); // Responde com sucesso
    } catch (err) {
        console.error('Erro ao desativar subcategoria:', err);
        res.status(500).json({ error: 'Erro interno ao desativar categoria.' });
    }
};