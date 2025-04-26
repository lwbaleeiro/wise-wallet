// backend/server.js
require('dotenv').config();
require('./config/db'); 
require('./config/passport-setup');

const session = require('express-session');
const passport = require('passport');
const express = require('express');

const categoryRoutes = require('./routes/categoryRoutes'); 
const subCategoryRoutes = require('./routes/subCategoryRoutes'); 
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middlewares
app.use(express.json());

// Configuração da Sessão (DEVE VIR ANTES DO PASSPORT)
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
  } 
}));

// Inicializa o Passport e restaura o estado de autenticação da sessão (se existir)
app.use(passport.initialize());
app.use(passport.session());

// Rotas da API
app.get('/api', (req, res) => {
  res.send('API Financeira Funcionando!');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});