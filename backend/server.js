// backend/server.js
require('dotenv').config();
require('./config/db');
const express = require('express');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.get('/', (req, res) => {
  res.send('Olá do Backend!');
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});