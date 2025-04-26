/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('transactions', {
        // Coluna para armazenar o ID original da transação (do CSV/banco)
        source_transaction_id: { 
            type: 'varchar(255)', 
            unique: false // Não pode ser unique globalmente, apenas por usuário
        } 
    });
    // Adiciona uma constraint unique composta para evitar duplicatas por usuário
    pgm.addConstraint('transactions', 'transactions_user_id_source_id_unique', { 
        unique: ['user_id', 'source_transaction_id'] 
    });
    // Cria um índice para otimizar a busca por source_transaction_id
     pgm.createIndex('transactions', ['user_id', 'source_transaction_id']);
};

exports.down = pgm => {
    // A constraint é removida automaticamente ao dropar a coluna
    pgm.dropColumn('transactions', 'source_transaction_id');
    // O índice também precisa ser removido explicitamente se você quiser reverter completamente
    // Mas dropar a coluna geralmente já resolve. Se precisar:
    // pgm.dropIndex('transactions', ['user_id', 'source_transaction_id']); 
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
