import React, { createContext, useState, ReactNode } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  user: User | null;
  redirectAfterLogin: boolean;
  setRedirectAfterLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Initialize user state
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData);
        setRedirectAfterLogin(true);
        setError(null);
      } else {
        setIsAuthenticated(false);
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // add logout logic
    // Clear authentication token
    setIsAuthenticated(false);
    setUser(null);
    setRedirectAfterLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
        error,
        user,
        redirectAfterLogin,
        setRedirectAfterLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
