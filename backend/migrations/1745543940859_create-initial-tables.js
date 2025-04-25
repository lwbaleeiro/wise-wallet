/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
// backend/migrations/<timestamp>_create_initial_tables.js
exports.shorthands = undefined;

exports.up = (pgm) => {
  // 0. Habilitar extensão para gerar UUIDs (se não estiver habilitada)
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // 1. Tabela Users
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    google_id: { type: 'varchar(255)', notNull: true, unique: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });

  // 2. Tabela Categories
  pgm.createTable('categories', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE' }, // Se usuário for deletado, suas categorias também são
    name: { type: 'varchar(100)', notNull: true },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });
  // Índice para garantir que nome da categoria seja único por usuário
  pgm.addConstraint('categories', 'categories_user_id_name_unique', { unique: ['user_id', 'name'] });
  // Índice na chave estrangeira para performance
  pgm.createIndex('categories', 'user_id');

  // 3. Tabela Subcategories
  pgm.createTable('subcategories', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE' }, // Se usuário for deletado, suas subcategorias também são
    category_id: { type: 'uuid', notNull: true, references: 'categories(id)', onDelete: 'CASCADE' }, // Se categoria for deletada, subcategorias também são
    name: { type: 'varchar(100)', notNull: true },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });
  // Índice para garantir que nome da subcategoria seja único por usuário/categoria
  pgm.addConstraint('subcategories', 'subcategories_user_category_name_unique', { unique: ['user_id', 'category_id', 'name'] });
  // Índices nas chaves estrangeiras para performance
  pgm.createIndex('subcategories', 'user_id');
  pgm.createIndex('subcategories', 'category_id');

  // 4. Tabela Transactions
  pgm.createTable('transactions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)', onDelete: 'CASCADE' }, // Se usuário for deletado, suas transações também são
    description: { type: 'varchar(255)', notNull: true },
    amount: { type: 'numeric(15, 2)', notNull: true }, // Ex: 1234567890123.45
    date: { type: 'date', notNull: true },
    type: { type: 'varchar(7)', notNull: true }, // 'income' ou 'expense'
    category_id: { type: 'uuid', references: 'categories(id)', onDelete: 'SET NULL' }, // Se categoria deletada, fica NULL
    subcategory_id: { type: 'uuid', references: 'subcategories(id)', onDelete: 'SET NULL' }, // Se subcategoria deletada, fica NULL
    notes: { type: 'text' },
    created_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp with time zone', notNull: true, default: pgm.func('current_timestamp') },
  });
  // Adiciona constraint para garantir que 'type' seja 'income' ou 'expense'
  pgm.addConstraint('transactions', 'transactions_type_check', {
    check: "type IN ('income', 'expense')"
  });
  // Índices para performance
  pgm.createIndex('transactions', 'user_id');
  pgm.createIndex('transactions', 'category_id');
  pgm.createIndex('transactions', 'subcategory_id');
  pgm.createIndex('transactions', 'date'); // Indexar data é comum em apps financeiros

  // 5. (Opcional, mas recomendado) Trigger para atualizar 'updated_at' automaticamente
  // Cria uma função genérica que atualiza a coluna updated_at
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Aplica o trigger a cada tabela que tem a coluna updated_at
  const tables = ['users', 'categories', 'subcategories', 'transactions'];
  tables.forEach(table => {
    pgm.sql(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON ${table}
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();
    `);
  });
};

// A função 'down' desfaz o que a função 'up' fez, na ordem inversa
exports.down = (pgm) => {
  // Remove triggers primeiro
  const tables = ['users', 'categories', 'subcategories', 'transactions'];
  tables.forEach(table => {
    pgm.sql(`DROP TRIGGER IF EXISTS set_timestamp ON ${table};`);
  });

  // Remove a função do trigger
  pgm.sql('DROP FUNCTION IF EXISTS trigger_set_timestamp();');

  // Remove tabelas na ordem inversa da criação para respeitar as dependências (FKs)
  pgm.dropTable('transactions');
  pgm.dropTable('subcategories'); // Constraint unique e indexes são removidos automaticamente com a tabela
  pgm.dropTable('categories'); // Constraint unique e indexes são removidos automaticamente com a tabela
  pgm.dropTable('users');

  // (Opcional) Remover a extensão pgcrypto se souber que não é mais necessária
  // pgm.sql('DROP EXTENSION IF EXISTS "pgcrypto"'); // Cuidado ao remover extensões
};