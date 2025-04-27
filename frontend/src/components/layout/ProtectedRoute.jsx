// frontend/src/components/layout/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/login') {
      checkAuth();
    }
  }, [location.pathname, checkAuth]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (user === null) {
      return <Navigate to="/login" replace />;

  }

  return children;
};

export default ProtectedRoute;