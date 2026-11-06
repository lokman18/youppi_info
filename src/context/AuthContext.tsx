import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_USER_STORAGE_KEY = 'youppi_auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy demo account if found
        if (parsed?.id === 'cust-01' || parsed?.id === 'admin-01' || parsed?.name === 'Karim Brahimi') {
          localStorage.removeItem(AUTH_USER_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth user', e);
    }
  }, [user]);

  const login = useCallback(async (email: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez saisir une adresse email valide' });
      return false;
    }

    const newUser: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      wilaya: '16 - Alger',
      address: '',
      role: 'customer',
    };

    setUser(newUser);
    showToast({ type: 'success', title: 'Connexion réussie !', message: `Bienvenue, ${newUser.name}` });
    return true;
  }, [showToast]);

  const register = useCallback(async (name: string, email: string, _password?: string): Promise<boolean> => {
    if (!name.trim() || !email.trim()) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez remplir tous les champs obligatoires' });
      return false;
    }

    const newUser: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      wilaya: '16 - Alger',
      address: '',
      role: 'customer',
    };

    setUser(newUser);
    showToast({ type: 'success', title: 'Compte créé avec succès !', message: `Bienvenue chez YOUPPI INFO, ${newUser.name}` });
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    showToast({ type: 'info', title: 'Déconnexion réussie', message: 'À bientôt sur YOUPPI INFO !' });
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
