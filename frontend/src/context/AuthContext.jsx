// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Настройка axios
  axios.defaults.baseURL = 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Попытка получить заметки (проверит токен)
        await axios.get('/notes');
        setCurrentUser({ isAuthenticated: true });
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция для регистрации пользователя
  const register = async (email, password) => {
    try {
      const response = await axios.post('/auth/register', { email, password });
      setCurrentUser({ isAuthenticated: true });
      return response.data;
    } catch (error) {
      console.error("Ошибка регистрации:", error.response?.data || error.message);
      throw error;
    }
  };

  // Функция для входа пользователя
  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    setCurrentUser({ isAuthenticated: true });
    return response.data;
  };

  // Функция для выхода пользователя
  const logout = async () => {
    await axios.post('/auth/logout');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
