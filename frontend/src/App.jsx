// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Layout from './components/layout/Layout'; // Componente Layout que provavelmente contém <Outlet />

// --- Componente ProtectedRoute movido para fora da função App ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Obtém user e loading do contexto

  // Mostra loading se a informação do usuário ainda está sendo carregada
  if (loading) {
    // Você pode querer um componente de Spinner/Loading mais elaborado aqui
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se não há usuário (após o loading terminar), redireciona para /login
  if (!user) {
    // Adicionado 'replace' para melhor experiência de navegação
    return <Navigate to="/login" replace />;
  }

  // Se há usuário, renderiza os componentes filhos (a rota protegida)
  return children;
};

// Função principal do App
function App() {
  return (
    // Provider de autenticação envolvendo toda a aplicação
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota Pai Protegida usando o Layout */}
          {/* Todas as rotas aninhadas aqui dentro exigirão autenticação */}
          {/* e serão renderizadas dentro do componente Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout /> {/* O Layout provavelmente renderiza {children} ou <Outlet /> */}
              </ProtectedRoute>
            }
          >
            {/* Rotas Filhas (aninhadas) - renderizadas dentro do Layout */}
            <Route index element={<Dashboard />} /> {/* Rota inicial (/) */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
             {/* Adicione outras rotas que devem usar o Layout aqui */}
          </Route>

          {/* Rota Catch-all: Redireciona qualquer rota não encontrada para a raiz */}
          {/* Se não estiver logado, o ProtectedRoute da raiz vai redirecionar para /login */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;