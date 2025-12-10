'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('webtools_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate Google OAuth (would integrate with actual Firebase)
      const mockUser: User = {
        id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Google+User&background=random'
      };
      
      setUser(mockUser);
      localStorage.setItem('webtools_user', JSON.stringify(mockUser));
      
      alert('Login dengan Google berhasil! (Mode Demo - Firebase akan segera tersedia)');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate email/password authentication
      if (email && password) {
        const mockUser: User = {
          id: 'email_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(email.split('@')[0]) + '&background=random'
        };
        
        setUser(mockUser);
        localStorage.setItem('webtools_user', JSON.stringify(mockUser));
        
        alert('Login berhasil! (Mode Demo - Firebase akan segera tersedia)');
      } else {
        throw new Error('Email dan password harus diisi');
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate user registration
      if (email && password) {
        const mockUser: User = {
          id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(email.split('@')[0]) + '&background=random'
        };
        
        setUser(mockUser);
        localStorage.setItem('webtools_user', JSON.stringify(mockUser));
        
        alert('Pendaftaran berhasil! (Mode Demo - Firebase akan segera tersedia)');
      } else {
        throw new Error('Email dan password harus diisi');
      }
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem('webtools_user');
      alert('Berhasil keluar!');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};