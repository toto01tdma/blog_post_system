import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, LoginCredentials, SignupCredentials } from '../types';
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://localhost:3001';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem('token', authState.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [authState.token]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { token } = response.data;
      setAuthState({
        user: { id: 0, username: credentials.username },
        token
      });
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await axios.post(`${API_URL}/signup`, credentials);
      await login(credentials);
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
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