// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "user") {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (userData, tokens) => {
    try {
      setError(null);

      // Store tokens and user data
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setUser(userData);

      // Dispatch custom event for Navbar to listen
      window.dispatchEvent(new Event("authStateChanged"));

      return { success: true };
    } catch (err) {
      const errorMsg = "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint if needed
      // await api.post("/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Update state
      setUser(null);

      // Dispatch custom event
      window.dispatchEvent(new Event("authStateChanged"));
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // This would be your API call
      // const response = await api.post("/users/update-profile", profileData);
      // const updatedUser = response.data.data;

      // For now, update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const newUser = { ...storedUser, ...profileData };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      // Dispatch custom event
      window.dispatchEvent(new Event("authStateChanged"));

      return { success: true };
    } catch (err) {
      const errorMsg = "Profile update failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
