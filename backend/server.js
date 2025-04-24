// backend/server.js
require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001; // Define a porta pela variável de ambiente ou usa 3001

app.get('/', (req, res) => {
  res.send('Olá do Backend!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});