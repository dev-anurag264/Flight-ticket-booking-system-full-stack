import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { saveAuth, getToken, getUser, clearAuth } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });
    const { token, email: userEmail, role } = response.data;
    const userData = { email: userEmail, role };
    saveAuth(token, userData);
    setUser(userData);
    return userData;
  }

  async function register(name, email, password) {
    const response = await axiosClient.post("/auth/register", {
      name,
      email,
      password,
    });
    const { token, email: userEmail, role } = response.data;
    const userData = { email: userEmail, role };
    saveAuth(token, userData);
    setUser(userData);
    return userData;
  }

  function logout() {
    clearAuth();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
