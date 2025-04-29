// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

// --- Interceptor de Resposta ---
api.interceptors.response.use(
    (response) => {
        // Retorna a resposta se for sucesso (status 2xx)
        return response;
    },
    (error) => {
        // Verifica se o erro tem uma resposta do servidor
        if (error.response) {
            // --- Tratamento específico para 401 Unauthorized ---
            if (error.response.status === 401) {
                console.error("Interceptor API: Erro 401 - Não autorizado. Limpando sessão local e redirecionando para login.");

                // 1. Limpar o estado de autenticação local
                localStorage.removeItem('user');

                // 2. Redirecionar para a página de login
                //    Usar window.location.href força um reload completo,
                //    garantindo que o AuthContext reinicie sem usuário.
                //    Isso evita loops caso o AuthContext não seja atualizado
                //    imediatamente antes do redirecionamento via React Router.
                if (window.location.pathname !== '/login') { // Evita loop se já estiver no login
                   window.location.href = '/login';
                }

                // Retornar uma promessa rejeitada com um erro específico pode ser útil
                // para que o local da chamada original saiba que falhou por auth.
                // Mas o redirecionamento acima já interrompe o fluxo normal.
                return Promise.reject(new Error("Sessão inválida ou expirada."));
            }
            // Você pode adicionar tratamento para outros erros (403, 500, etc.) aqui se desejar
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta (ex: rede, CORS em alguns casos)
            console.error('Interceptor API: Erro de requisição (sem resposta)', error.request);
        } else {
            // Erro ao configurar a requisição
            console.error('Interceptor API: Erro ao configurar requisição', error.message);
        }

        // Re-lança o erro para que possa ser tratado no local da chamada (ex: .catch() )
        // se não for um 401 que causou redirecionamento.
        return Promise.reject(error);
    }
);

export default api;