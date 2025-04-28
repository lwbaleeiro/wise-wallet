// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        // Store user data in localStorage
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Remove o parâmetro 'user' da URL após a extração
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário da URL:', error);
      }
    }
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      // Remove user data from localStorage
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);