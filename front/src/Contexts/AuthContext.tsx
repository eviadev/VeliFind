import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

/* eslint-disable */
interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
}


const TOKEN_KEY = "my-jwt";
export const API_URL = "http://localhost:3001";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log("stored:", token);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          setAuthState({
            token: token,
            authenticated: true,
          });
        }
      } catch (error) {
        console.error('Error loading token from AsyncStorage:', error);
      }
    };
    loadToken();
  }, []);


  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/signup`, { email, password });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/login`, { email, password });
      console.log('Starting login process...');
      if (result && result.data && result.data.authToken) {
        setAuthState({
          token: result.data.authToken.token,
          authenticated: true,
        });

        axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.authToken.token}`;

        try {
          await AsyncStorage.setItem(TOKEN_KEY, result.data.authToken.token);
        } catch (error) {
          console.error('Error saving token to AsyncStorage:', error);
        }
        console.log('Login successful:', result);
        return result;
      } else {
        console.error("Login response is missing 'authToken' property:", result);
        return { error: true, msg: 'Invalid response from server during login.' };
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { error: true, msg: 'An error occurred during login.' };
    }
  };



  const logout = async () => {
    // Delete token from storage
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from AsyncStorage:', error);
    }

    // Update HTTP Headers
    axios.defaults.headers.common["Authorization"] = "";

    // Reset auth state
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  // @ts-ignore
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
