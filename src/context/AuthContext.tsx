import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginDemo: (role?: 'customer' | 'admin') => void;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_USER_STORAGE_KEY = 'youppi_auth_user_v1';

const DEMO_CUSTOMER: CustomerUser = {
  id: 'cust-01',
  name: 'Karim Brahimi',
  email: 'karim.brahimi@gmail.com',
  phone: '0550 12 34 56',
  wilaya: '16 - Alger',
  address: '12 Rue Didouche Mourad, Alger Centre',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  role: 'customer',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEMO_CUSTOMER; // default to logged in demo user for instant smooth experience
    } catch {
      return DEMO_CUSTOMER;
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
    // Simulated realistic authentication
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez saisir une adresse email valide' });
      return false;
    }

    const newUser: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 7),
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      wilaya: '16 - Alger',
      address: 'Alger, Algérie',
      role: 'customer',
    };

    setUser(newUser);
    showToast({ type: 'success', title: 'Connexion réussie !', message: `Bienvenue, ${newUser.name}` });
    return true;
  }, [showToast]);

  const loginDemo = useCallback((role: 'customer' | 'admin' = 'customer') => {
    if (role === 'admin') {
      const adminUser: CustomerUser = {
        id: 'admin-01',
        name: 'Administrateur YOUPPI',
        email: 'admin@youppi-info.dz',
        phone: '0555 12 34 56',
        wilaya: '16 - Alger',
        role: 'admin',
      };
      setUser(adminUser);
      showToast({ type: 'success', title: 'Mode Admin Activé', message: 'Connecté en tant qu’administrateur' });
    } else {
      setUser(DEMO_CUSTOMER);
      showToast({ type: 'success', title: 'Connexion démo', message: 'Connecté en tant que Karim Brahimi' });
    }
  }, [showToast]);

  const register = useCallback(async (name: string, email: string, _password?: string): Promise<boolean> => {
    if (!name.trim() || !email.trim()) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez remplir tous les champs obligatoires' });
      return false;
    }

    const newUser: CustomerUser = {
      id: 'cust-' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim(),
      wilaya: '16 - Alger',
      address: 'Algérie',
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
        loginDemo,
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
