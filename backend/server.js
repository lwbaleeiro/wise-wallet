// backend/server.js
require('dotenv').config();
require('./config/db'); 
const express = require('express');
const categoryRoutes = require('./routes/categoryRoutes'); // Importa as rotas

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middlewares
app.use(express.json()); // Para parsear JSON no corpo das requisições

// Rotas da API
app.get('/api', (req, res) => { // Rota de teste para a raiz da API
  res.send('API Financeira Funcionando!');
});

app.use('/api/categories', categoryRoutes); // Monta as rotas de categoria

// (Adicionaremos mais rotas aqui depois: subcategorias, transações, auth...)

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});