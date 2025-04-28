// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react'; // Adicione useCallback se for usar checkAuth
import api from '../services/api'; // Assumindo que api service está configurado

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicie user como null e loading como TRUE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Iniciar como true!

  useEffect(() => {
    let isMounted = true; // Flag para evitar updates em componente desmontado

    const initializeAuth = async () => {
      let foundUser = null;

      // 1. Tentar carregar do localStorage
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          foundUser = JSON.parse(storedUser);
          console.log('AuthContext: Usuário encontrado no localStorage:', foundUser);
        }
      } catch (error) {
        console.error('AuthContext: Erro ao ler localStorage:', error);
        localStorage.removeItem('user'); // Limpa em caso de erro
      }

      // 2. Se não achou no localStorage, checar parâmetro da URL
      if (!foundUser) {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        console.log('AuthContext: userParam da URL:', userParam);

        if (userParam) {
          try {
            foundUser = JSON.parse(decodeURIComponent(userParam));
            console.log('AuthContext: Usuário encontrado na URL:', foundUser);
            // Salva no localStorage para futuras visitas
            localStorage.setItem('user', JSON.stringify(foundUser));
            // Limpa o parâmetro da URL (importante!)
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error('AuthContext: Erro ao analisar dados do usuário da URL:', error);
            localStorage.removeItem('user'); // Limpa storage
            foundUser = null; // Garante que não use dados inválidos
          }
        }
      }

      // 3. Opcional: Verificar com o backend (se tiver checkAuth)
      // Se 'foundUser' ainda é null, ou se você sempre quer validar a sessão
      if (!foundUser && typeof checkAuth === 'function') {
        try {
          // Assumindo que checkAuth retorna o user ou null/undefined e gerencia seu próprio loading interno ou não
          // ou talvez checkAuth apenas configure cookies e você precise de outra chamada
          console.log("AuthContext: Verificando auth com backend...");
          // foundUser = await checkAuth(); // Se checkAuth retornar o usuário
        } catch (error) {
           console.error("AuthContext: Erro ao verificar auth com backend", error);
           foundUser = null;
        }
      }

      // 4. Atualizar o estado final APENAS se o componente ainda estiver montado
      if (isMounted) {
        setUser(foundUser); // Define o usuário encontrado (ou null)
        setLoading(false); // <-- Define loading como false SÓ AGORA!
        console.log('AuthContext: Inicialização completa. User:', foundUser, 'Loading:', false);
      }
    };

    initializeAuth();

    // Função de cleanup para evitar setar estado se o componente desmontar
    return () => {
      isMounted = false;
    };
  }, []); // Executa apenas uma vez na montagem inicial

  const login = () => {
    // Define loading como true ao iniciar o processo? Opcional.
    // setLoading(true);
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  const logout = async () => {
    setLoading(true); // Opcional: mostrar loading durante logout
    try {
      // Chamar backend para invalidar sessão/cookie se houver
       await api.get('/auth/logout'); // Verifique se sua API tem essa rota
      console.log('AuthContext: Logout no backend chamado.');
    } catch (error) {
      console.error('AuthContext: Erro ao fazer logout no backend:', error);
    } finally {
      // Limpar frontend independentemente do backend
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false); // Termina o loading do logout
      console.log('AuthContext: Usuário deslogado no frontend.');
      // Redirecionar para login (pode ser feito aqui ou pelo ProtectedRoute)
      // window.location.href = '/login'; // Causa reload completo
    }
  };

  // Opcional: Função para verificar ativamente com o backend
  const checkAuth = useCallback(async () => {
    if (!loading) setLoading(true); // Começa a carregar
    try {
      const response = await api.get('/auth/me'); // Endpoint que retorna dados do user se logado
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data)); // Atualiza local storage
    } catch (error) {
      // Se der erro (ex: 401), significa não autenticado
      console.log('AuthContext: CheckAuth falhou ou não autenticado.', error);
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false); // Termina de carregar
    }
  }, [loading]); // Dependência em loading para evitar chamadas concorrentes? Ou [] se for estável.


  // Log final antes de prover o contexto
   console.log('AuthProvider Render: User:', user, 'Loading:', loading);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);