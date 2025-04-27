// backend/routes/authRoutes.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Rota para iniciar a autenticação com Google
// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Solicita acesso ao perfil e email do usuário
}));

// Rota de callback do Google (para onde o Google redireciona após o login)
// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login/failed' }), // Redireciona se falhar
    (req, res) => {
       const user = encodeURIComponent(JSON.stringify(req.user));
       res.redirect(`http://localhost:5173/?user=${user}`);

    },
);

// Rota para verificar se o usuário está logado (útil para o frontend)
// GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) { // Função do Passport que verifica a sessão
        res.status(200).json({ user: req.user }); // Retorna os dados do usuário logado
    } else {
        res.status(401).json({ user: null, message: 'Usuário não autenticado.' });
    }
});

// Rota de Logout
// GET /api/auth/logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) { // Função do Passport para limpar a sessão de login
        if (err) { return next(err); }
        // Idealmente, redirecionar para a página inicial do frontend
        res.status(200).json({ message: 'Logout bem-sucedido.'}); 
        // Ou redirecionar: res.redirect('http://localhost:5173/');
    });
});

// Rota para falha no login (opcional)
router.get('/login/failed', (req, res) => {
    res.status(401).json({ message: 'Falha na autenticação com Google.' });
});


module.exports = router;