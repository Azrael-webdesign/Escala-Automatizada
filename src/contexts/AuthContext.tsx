
import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'employee';

export interface User {
  id: number;
  name: string;
  role: Role;
  defaultShiftCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  { id: 1, name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin' as Role },
  { id: 2, name: 'User1', username: 'user1', password: 'employee123', role: 'employee' as Role, defaultShiftCode: 'A' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in (using localStorage for demo purposes)
  useEffect(() => {
    const savedUser = localStorage.getItem('scheduleAppUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('scheduleAppUser');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simulate API call with mock data
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      throw new Error('Usuário ou Senha inválido');
    }

    const userInfo = {
      id: foundUser.id,
      name: foundUser.name,
      role: foundUser.role,
      defaultShiftCode: foundUser.defaultShiftCode,
    };

    setUser(userInfo);
    localStorage.setItem('scheduleAppUser', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scheduleAppUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
