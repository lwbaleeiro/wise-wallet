// backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db'); // Nosso pool de conexões PG
require('dotenv').config();

// Serialização: Determina quais dados do usuário devem ser armazenados na sessão
// Armazenamos apenas o ID do nosso banco de dados na sessão
passport.serializeUser((user, done) => {
    done(null, user.id); // user.id é o UUID da nossa tabela 'users'
});

// Desserialização: Recupera os dados completos do usuário a partir do ID armazenado na sessão
// Chamado a cada requisição após o login, para popular req.user
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT id, google_id, email, name FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]); // Popula req.user com os dados do banco
        } else {
            done(new Error('Usuário não encontrado na desserialização.'), null);
        }
    } catch (err) {
        done(err, null);
    }
});

// Configuração da Estratégia Google OAuth 2.0
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'] // Escopos que queremos acessar do Google
        },
        async (accessToken, refreshToken, profile, done) => {
            // Esta função é chamada após o usuário autenticar no Google com sucesso

            const googleId = profile.id;
            const email = profile.emails[0].value; // Pega o primeiro email (geralmente o principal)
            const name = profile.displayName;

            try {
                // 1. Verifica se o usuário já existe na nossa base pelo google_id
                let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
                let currentUser = result.rows[0];

                if (currentUser) {
                    // Usuário já existe, retorna o usuário encontrado
                    console.log('Usuário já existe:', currentUser);
                    done(null, currentUser); // Chama serializeUser com este usuário
                } else {
                    // 2. Se não existe, cria um novo usuário na nossa base
                    console.log('Criando novo usuário...');
                    result = await pool.query(
                        'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *',
                        [googleId, email, name]
                    );
                    const newUser = result.rows[0];
                    console.log('Novo usuário criado:', newUser);
                    done(null, newUser); // Chama serializeUser com o novo usuário
                }
            } catch (err) {
                console.error("Erro na estratégia Google:", err);
                done(err, null);
            }
        }
    )
);