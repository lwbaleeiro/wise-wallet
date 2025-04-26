// backend/middleware/authMiddleware.js

// Middleware simples para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
    // req.isAuthenticated() é uma função adicionada pelo Passport
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Acesso não autorizado. Faça o login para continuar.' });
};

module.exports = { isAuthenticated };