import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'youppi_admin_session';
const ADMIN_CREDENTIALS_KEY = 'youppi_admin_creds';
const CLERK_CREDENTIALS_KEY = 'youppi_clerk_creds';

// Default initial admin credentials (can be updated from dashboard)
const DEFAULT_ADMIN_CREDS = {
  username: 'admin',
  passwordHash: 'youppi_admin2026',
};

// Default stock clerk credentials (enters and exits stock only)
const DEFAULT_CLERK_CREDS = {
  username: 'stock',
  passwordHash: 'youppi_stock2026',
};

class AuthService {
  private currentUser: AdminUser | null = null;

  constructor() {
    this.checkSession();
  }

  private checkSession() {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      try {
        this.currentUser = JSON.parse(raw);
      } catch {
        this.currentUser = null;
      }
    }
  }

  private getStoredAdminCreds() {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return DEFAULT_ADMIN_CREDS;
      }
    }
    return DEFAULT_ADMIN_CREDS;
  }

  private getStoredClerkCreds() {
    const raw = localStorage.getItem(CLERK_CREDENTIALS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return DEFAULT_CLERK_CREDS;
      }
    }
    return DEFAULT_CLERK_CREDS;
  }

  public login(username: string, password: string): { success: boolean; role?: AdminUser['role']; error?: string } {
    const trimmedUsername = username.trim();
    const adminCreds = this.getStoredAdminCreds();
    const clerkCreds = this.getStoredClerkCreds();

    // 1. Check Super Admin Login
    if (trimmedUsername === adminCreds.username && password === adminCreds.passwordHash) {
      const user: AdminUser = {
        id: 'usr-admin-1',
        username: adminCreds.username,
        displayName: 'Responsable Magasin YOUPPI INFO',
        role: 'super_admin',
        lastLogin: new Date().toISOString(),
      };
      this.currentUser = user;
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      return { success: true, role: 'super_admin' };
    }

    // 2. Check Inventory/Stock Clerk Login (Entrée/Sortie seulement)
    if (trimmedUsername === clerkCreds.username && password === clerkCreds.passwordHash) {
      const user: AdminUser = {
        id: 'usr-clerk-1',
        username: clerkCreds.username,
        displayName: 'أمين المخزن / Agent de Stock',
        role: 'inventory_clerk',
        lastLogin: new Date().toISOString(),
      };
      this.currentUser = user;
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      return { success: true, role: 'inventory_clerk' };
    }

    return {
      success: false,
      error: 'Nom d’utilisateur ou mot de passe incorrect.',
    };
  }

  public logout() {
    this.currentUser = null;
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public isClerk(): boolean {
    return this.currentUser?.role === 'inventory_clerk';
  }

  public isSuperAdmin(): boolean {
    return this.currentUser?.role === 'super_admin';
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public updatePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const creds = this.getStoredAdminCreds();
    if (oldPassword !== creds.passwordHash) {
      return { success: false, error: 'L’ancien mot de passe est incorrect.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' };
    }

    const updated = {
      ...creds,
      passwordHash: newPassword,
    };
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updated));
    return { success: true };
  }
}

export const authService = new AuthService();
