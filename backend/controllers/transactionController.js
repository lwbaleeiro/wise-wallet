// backend/controllers/transactionController.js
const pool = require('../config/db');
const { validate: uuidValidate } = require('uuid');
const csv = require('csv-parser');
const { Readable } = require('stream');

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
        fieldsToUpdate.updated_at = 'NOW();'; 

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

// --- Upload de Transações via CSV ---
exports.uploadCsvTransactions = async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo CSV enviado.' });
    }

    const transactionsToInsert = [];
    const skippedRows = []; // Para rastrear linhas puladas (ex: duplicadas)
    const errorRows = []; // Para rastrear linhas com erros de formato/dados

    // Cria um stream legível a partir do buffer do arquivo carregado na memória
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); // Sinaliza fim do stream

    bufferStream
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim() // Remove espaços extras dos cabeçalhos
         }))
        .on('data', (row) => {
            // Processa cada linha do CSV
            const dataOriginal = row['Data'];
            const valorOriginal = row['Valor'];
            const identificador = row['Identificador'];
            const descricao = row['Descrição'];
            let linha = (transactionsToInsert.length + skippedRows.length + errorRows.length + 1); // Número aproximado da linha

            // 1. Validações e Transformações Essenciais
            if (!dataOriginal || !valorOriginal || !identificador || !descricao) {
                 errorRows.push({ line: linha, data: row, error: 'Colunas faltando (Data, Valor, Identificador, Descrição).' });
                 return; // Pula esta linha
            }

            // 2. Parse e Valida Data (DD/MM/YYYY -> YYYY-MM-DD)
            const dateParts = dataOriginal.split('/');
            let formattedDate;
            if (dateParts.length === 3) {
                // Formata como YYYY-MM-DD - CUIDADO com mês/dia (DD/MM vs MM/DD)
                // Assumindo DD/MM/YYYY baseado no exemplo
                const [day, month, year] = dateParts;
                // Verifica se são números válidos antes de criar a data
                 if (!isNaN(parseInt(day)) && !isNaN(parseInt(month)) && !isNaN(parseInt(year))) {
                    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                     // Validação extra: Tenta criar um objeto Date para ver se é válido
                     if (isNaN(new Date(formattedDate).getTime())) {
                        errorRows.push({ line: linha, data: row, error: `Formato de Data inválido: ${dataOriginal}` });
                        return;
                     }
                 } else {
                     errorRows.push({ line: linha, data: row, error: `Formato de Data inválido: ${dataOriginal}` });
                     return;
                 }
            } else {
                errorRows.push({ line: linha, data: row, error: `Formato de Data inválido: ${dataOriginal}` });
                return; // Pula esta linha
            }

            // 3. Parse e Valida Valor (determina tipo)
            const amount = parseFloat(valorOriginal.replace(',', '.')); // Substitui vírgula se houver
            if (isNaN(amount)) {
                errorRows.push({ line: linha, data: row, error: `Valor inválido: ${valorOriginal}` });
                return; // Pula esta linha
            }
            const type = amount >= 0 ? 'income' : 'expense';

            // Adiciona a transação formatada à lista para inserção
            transactionsToInsert.push({
                user_id: userId,
                description: descricao.trim(),
                amount: amount, // Mantém o sinal original
                date: formattedDate,
                type: type,
                source_transaction_id: identificador.trim(),
                // category_id e subcategory_id serão null por padrão
                category_id: null, 
                subcategory_id: null,
                notes: null // Ou talvez adicionar algo como "Importado via CSV"?
            });
        })
        .on('end', async () => {
            // Processamento terminou, agora insere no banco
            if (transactionsToInsert.length === 0 && errorRows.length === 0) {
                return res.status(400).json({ message: 'Nenhuma transação válida encontrada no arquivo CSV.', errors: errorRows, skipped: skippedRows });
            }

            let successfulInserts = 0;
            const failedInserts = []; // Para erros durante a inserção (ex: duplicatas)

            // Usa uma transação SQL para inserir tudo ou nada (ou quase tudo)
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Prepara os dados para UNNEST - mais eficiente para bulk insert
                const values = transactionsToInsert.map(tx => [
                    tx.user_id, tx.description, tx.amount, tx.date, tx.type, tx.source_transaction_id,
                    tx.category_id, tx.subcategory_id, tx.notes
                ]);

                // Query usando UNNEST
                // ON CONFLICT tenta lidar com duplicatas (baseado na constraint unique)
                const insertQuery = `
                    INSERT INTO transactions (
                        user_id, description, amount, date, type, source_transaction_id, 
                        category_id, subcategory_id, notes
                    ) 
                    SELECT * FROM UNNEST(
                        $1::uuid[], $2::varchar[], $3::numeric[], $4::date[], $5::varchar[], $6::varchar[],
                        $7::uuid[], $8::uuid[], $9::text[]
                    )
                    ON CONFLICT (user_id, source_transaction_id) DO NOTHING -- Ignora linhas duplicadas
                    RETURNING id; -- Retorna IDs das linhas inseridas com sucesso
                `;

                // Separa os arrays por tipo
                const params = [
                    values.map(v => v[0]), values.map(v => v[1]), values.map(v => v[2]), values.map(v => v[3]),
                    values.map(v => v[4]), values.map(v => v[5]), values.map(v => v[6]), values.map(v => v[7]),
                    values.map(v => v[8])
                ];

                const result = await client.query(insertQuery, params);
                successfulInserts = result.rowCount; // Número de linhas realmente inseridas

                // Calcula as duplicadas que foram ignoradas pelo ON CONFLICT
                const duplicates = transactionsToInsert.length - successfulInserts;
                for (let i = 0; i < duplicates; i++) {
                     skippedRows.push({ error: 'Duplicata ignorada (user_id, source_transaction_id)' });
                 }

                await client.query('COMMIT');

                 res.status(200).json({
                    message: `Importação concluída.`,
                    success: successfulInserts,
                    duplicates_skipped: duplicates,
                    errors_parsing: errorRows.length,
                    error_details: errorRows // Retorna detalhes dos erros de parsing
                });

            } catch (dbError) {
                await client.query('ROLLBACK');
                console.error('Erro no banco de dados durante a inserção em lote:', dbError);
                res.status(500).json({
                    error: 'Erro no banco de dados ao salvar transações.',
                    parsing_errors: errorRows, // Mesmo com erro no DB, informa erros de parsing
                    message_details: dbError.message 
                });
            } finally {
                client.release(); // Libera a conexão de volta para o pool
            }
        })
        .on('error', (parseError) => {
             console.error('Erro ao parsear CSV:', parseError);
             res.status(400).json({ error: 'Erro ao ler o arquivo CSV.', details: parseError.message });
        });
};