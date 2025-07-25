// contexts/AuthContext.tsx
import useMutationQuery from "@/hooks/useMutationQuery";
import { ResponseLoginSchema, ResponseLoginType } from "@/schemas/loginSchema";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: ResponseLoginType | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ResponseLoginType | null>(null);

  const isLoggedIn = !!token;

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");

        if (storedToken) {
          setToken(storedToken);

          const decoded = jwtDecode<ResponseLoginType>(storedToken);
          setUser(decoded);
        }
      } catch (error) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const loginUser = async (data: {
    username: string;
    password: string;
  }): Promise<any> => {
    const res = await axios.post("https://dummyjson.com/auth/login", data);

    return res.data;
  };

  const { mutateAsync } = useMutationQuery<
    ResponseLoginType,
    { username: string; password: string }
  >(loginUser, ResponseLoginSchema);

  const login = async (username: string, password: string) => {
    try {
      const response = await mutateAsync({ username, password });
      await SecureStore.setItemAsync("authToken", response.accessToken);
      setToken(response.accessToken);

      const decoded = jwtDecode<ResponseLoginType>(response.accessToken);
      setUser(decoded);

      router.replace("/(tabs)");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, login, logout, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
};
