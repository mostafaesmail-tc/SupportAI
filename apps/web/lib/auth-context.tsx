'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from '../types/auth';

import {
  login as loginRequest,
  logout as logoutRequest,
  restoreSession as restoreSessionRequest,
  register as registerRequest,
} from './api';

import { setAccessToken } from './auth-token';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const result = await restoreSessionRequest();

        if (isMounted) {
          setAccessToken(result.accessToken);
          setUser(result.user);
        }
      } catch {
        if (isMounted) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const result = await loginRequest(input);

    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await registerRequest(input);

    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}