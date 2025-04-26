// backend/middleware/uploadMiddleware.js
const multer = require('multer');

// Configura o armazenamento em memória (bom para arquivos menores e processamento imediato)
const storage = multer.memoryStorage();

// Filtro para aceitar apenas arquivos CSV
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Formato de arquivo inválido. Envie apenas arquivos .csv'), false); // Rejeita o arquivo
    }
};

// Cria a instância do Multer com as configurações
const uploadCsv = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB (ajuste conforme necessário)
    }
}).single('csvfile'); // Espera um campo chamado 'csvfile' no formulário

module.exports = { uploadCsv };