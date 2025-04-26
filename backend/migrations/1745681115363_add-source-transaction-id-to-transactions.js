/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('transactions', {
        source_transaction_id: { 
            type: 'varchar(255)', 
            unique: false 
        } 
    });
    pgm.addConstraint('transactions', 'transactions_user_id_source_id_unique', { 
        unique: ['user_id', 'source_transaction_id'] 
    });
    pgm.createIndex('transactions', ['user_id', 'source_transaction_id']);
};

exports.down = pgm => {
    pgm.dropConstraint('transactions', 'transactions_user_id_source_id_unique');
    pgm.dropIndex('transactions', ['user_id', 'source_transaction_id']);
    pgm.dropColumn('transactions', 'source_transaction_id');
};
