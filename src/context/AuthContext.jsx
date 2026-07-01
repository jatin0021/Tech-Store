import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load saved authentication states from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("tech_store_user");
    const savedToken = localStorage.getItem("tech_store_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse local user profile:", e);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem("tech_store_token", token);
      localStorage.setItem("tech_store_user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone, address) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });
      const { token, ...userData } = response.data;

      localStorage.setItem("tech_store_token", token);
      localStorage.setItem("tech_store_user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("tech_store_token");
    localStorage.removeItem("tech_store_user");
    setUser(null);
  };

  // Profile update handler
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put("/auth/profile", profileData);
      const { token, ...userData } = response.data;

      if (token) {
        localStorage.setItem("tech_store_token", token);
      }
      localStorage.setItem("tech_store_user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // Computed helper statuses
  const isAuthenticated = !!user;
  const isAdmin = user && user.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
