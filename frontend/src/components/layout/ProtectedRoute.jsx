// frontend/src/components/layout/ProtectedRoute.jsx
import React, { useEffect } from 'react'; // Import React se ainda não o fez
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// Renomeei para seguir a convenção de começar com maiúscula
const ProtectedRoute = ({ children }) => {
  // Obtenha user, loading e checkAuth do contexto
  // checkAuth é uma função (presumivelmente definida no AuthContext)
  // para verificar ativamente a sessão do usuário com o backend.
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Se checkAuth existir e não estivermos na página de login,
    // chame checkAuth para validar a sessão.
    // É importante que checkAuth defina loading = true no início
    // e loading = false no final (ou em caso de erro).
    // Considere usar useCallback para checkAuth no AuthContext para estabilidade.
    if (checkAuth && location.pathname !== '/login') {
       checkAuth();
    }
    // Adicione checkAuth às dependências se ele puder mudar.
    // Se checkAuth for estável (definido fora ou com useCallback), pode omitir.
  }, [location.pathname, checkAuth]); // Dependências

  // Enquanto estiver verificando (loading === true), mostre um loader.
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Após verificar (loading === false):
  // Se NÃO houver usuário (user é null ou undefined), redirecione para /login.
  if (!user) {
     // Salva a localização atual para que possamos redirecionar de volta após o login (opcional)
     // state={{ from: location }}
    return <Navigate to="/login" replace />;
  }

  // Se houver usuário, renderize o componente filho (a página protegida).
  return children;
};

export default ProtectedRoute;