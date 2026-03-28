import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const getInitialToken = () => localStorage.getItem("token");
const getInitialUser = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<User | null>(getInitialUser);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      setAuth: (nextToken, nextUser) => {
        localStorage.setItem("token", nextToken);
        localStorage.setItem("user", JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
