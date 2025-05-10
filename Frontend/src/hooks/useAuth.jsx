import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { authApi } from "../data/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("currentUser");
      const token = localStorage.getItem("token");
      if (user && token) {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (username, password) => {
    try {
      const response = await authApi.login({ username, password });
      // Assuming response contains token and user info
      const { token, ...user } = response;
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${user.firstName + " " + user.lastName}!`,
      });

      // Navigate based on role
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "MANAGER") {
        navigate("/profile");
      } else if (user.role === "USER") {
        navigate("/dashboard");
      } else {
        navigate("/notfound");
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };
  
  // Sync currentUser changes to localStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin: currentUser?.role === "ADMIN",
    isTrainer: currentUser?.role === "USER" || currentUser?.role === "ADMIN",
  };
  
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
