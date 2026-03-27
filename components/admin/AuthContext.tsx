"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "cms_api_key";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setApiKeyState(stored);
    setIsLoading(false);
  }, []);

  const setApiKey = useCallback((key: string) => {
    sessionStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setApiKeyState(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        setApiKey,
        logout,
        isAuthenticated: !!apiKey,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
