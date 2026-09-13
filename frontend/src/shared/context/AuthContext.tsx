import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRolePersona: (roleName: string) => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default logged in user (Business Owner) so dashboard can be tested immediately
const DEFAULT_USER: User = {
  userId: 1,
  username: 'admin',
  fullName: 'Saman Jayawardena',
  email: 'owner@novamart.lk',
  phoneNumber: '+94771234560',
  isActive: true,
  roles: ['BUSINESS_OWNER'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('novamart_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('novamart_jwt') || 'mock_jwt_token_business_owner_2026';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('novamart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('novamart_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('novamart_jwt', token);
    } else {
      localStorage.removeItem('novamart_jwt');
    }
  }, [token]);

  const login = async (username: string, pass: string) => {
    try {
      const data = await authApi.login(username, pass);
      setUser(data.user);
      setToken(data.token);
    } catch (err: any) {
      // In offline preview mode, allow quick login with demo users
      if (pass === 'Admin@123' || pass === 'admin') {
        const mockUser: User = {
          userId: 1,
          username,
          fullName: username === 'admin' ? 'Saman Jayawardena' : username.toUpperCase(),
          email: `${username}@novamart.lk`,
          isActive: true,
          roles: username === 'admin' ? ['BUSINESS_OWNER'] : ['INVENTORY_CLERK'],
        };
        setUser(mockUser);
        setToken('mock_jwt_' + username);
        return;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('novamart_user');
    localStorage.removeItem('novamart_jwt');
  };

  const switchRolePersona = (roleName: string) => {
    if (!user) return;
    const updated = {
      ...user,
      roles: [roleName],
    };
    setUser(updated);
  };

  const hasRole = (role: string) => {
    if (!user || !user.roles) return false;
    if (user.roles.includes('BUSINESS_OWNER')) return true; // Owner has super-access
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        switchRolePersona,
        hasRole,
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
