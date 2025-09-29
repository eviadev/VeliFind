import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../lib/apiClient';

const TOKEN_KEY = 'velifind-auth-token';

type AuthState = {
  token: string | null;
  authenticated: boolean;
};

type AuthSuccess = { success: true };
type AuthFailure = { success: false; message: string };
export type AuthResult = AuthSuccess | AuthFailure;

type AuthContextValue = {
  authState: AuthState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

type AuthResponse = {
  data: {
    _id: string;
    email: string;
  };
  authToken: {
    token: string;
    expiresIn: number;
  };
};

const initialState: AuthState = {
  token: null,
  authenticated: false,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (typeof window !== 'undefined' && window.navigator && !window.navigator.onLine) {
    return 'You appear to be offline. Please check your connection and try again.';
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { msg?: string; message?: string }; status?: number } }).response;

    if (response?.data?.msg) {
      return response.data.msg;
    }

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'We could not complete your request. Please try again.';
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const persistSession = (token: string) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch (storageError) {
      console.warn('Unable to persist session token', storageError);
    }
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearSession = () => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch (storageError) {
      console.warn('Unable to clear stored session token', storageError);
    }
  }

  delete apiClient.defaults.headers.common.Authorization;
};

const extractAuthToken = (payload: AuthResponse): string => {
  const token = payload.authToken?.token;

  if (!token) {
    throw new Error('Authentication token missing from server response');
  }

  return token;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const existingToken = window.localStorage.getItem(TOKEN_KEY);

        if (existingToken) {
          persistSession(existingToken);
          setAuthState({ token: existingToken, authenticated: true });
        }
      } catch (storageError) {
        console.warn('Unable to read stored session token', storageError);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/login', { email, password });
      const token = extractAuthToken(data);

      persistSession(token);
      setAuthState({ token, authenticated: true });

      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/signup', { email, password });
      const token = extractAuthToken(data);

      persistSession(token);
      setAuthState({ token, authenticated: true });

      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.warn('Failed to notify server about logout', error);
    } finally {
      clearSession();
      setAuthState(initialState);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      authState,
      isLoading,
      login,
      register,
      logout,
    }),
    [authState, isLoading, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
