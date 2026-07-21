import React, { createContext, useState, useContext, useEffect } from 'react';
import { clearStoredUser, getStoredUser, saveStoredUser } from '@/lib/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      const fallbackUser = {
        id: 'local-user',
        name: 'Usuário',
        email: 'usuario@finanly.com',
        role: 'user',
      };

      saveStoredUser(fallbackUser);
      setUser(fallbackUser);
      setIsAuthenticated(true);
    }

    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
  }, []);

  const checkAppState = async () => {
    setAuthError(null);
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
  };

  const login = (nextUser) => {
    saveStoredUser(nextUser);
    setUser(nextUser);
    setIsAuthenticated(true);
    setAuthError(null);
    return nextUser;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const navigateToLogin = () => {
    setAuthError({
      type: 'auth_required',
      message: 'Authentication required',
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      login,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
