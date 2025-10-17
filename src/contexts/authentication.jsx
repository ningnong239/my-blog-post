/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../config/api";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: false,
    getUserLoading: false,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // Fetch user details
  const fetchUser = async () => {
    console.log("=== FETCH USER START ===");
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    
    if (!token) {
      console.log("No token found, setting user to null");
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      
      console.log("Attempting API getUser from Supabase...");
      const userData = await authAPI.getUser();
      
      console.log("API getUser response:", userData);
      setState((prevState) => ({
        ...prevState,
        user: userData,
        getUserLoading: false,
      }));
      console.log("=== FETCH USER SUCCESS ===");
      return;
      
    } catch (error) {
      console.log("=== FETCH USER ERROR ===");
      console.log("Fetch user error:", error);
      console.log("Error message:", error.message);
      console.log("Error details:", error);
      
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // Load user on initial app load
  }, []);

  // Login user
  const login = async (data) => {
    console.log("=== LOGIN START ===");
    console.log("Login attempt with:", data);
    console.log("Email:", data.email);
    console.log("Password:", data.password);
    
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      console.log("Attempting API login to Supabase...");
      console.log("Login data:", data);
      
      const loginData = await authAPI.login(data.email, data.password);
      
      console.log("API login response:", loginData);
      const token = loginData.access_token;
      localStorage.setItem("token", token);
      console.log("Token saved to localStorage:", token);
      
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      console.log("Navigating to home page...");
      navigate("/");
      
      console.log("Fetching user data...");
      await fetchUser();
      
      console.log("=== LOGIN SUCCESS ===");
      return; // Success
      
    } catch (error) {
      console.log("=== LOGIN ERROR ===");
      console.log("Login error:", error);
      console.log("Error message:", error.message);
      console.log("Error details:", error);
      console.log("Error stack:", error.stack);
      
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || "Login failed",
      }));
      return { error: error.message || "Login failed" };
    }
  };

  // Register user
  const register = async (data) => {
    console.log("Register attempt with:", data);
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      // Try API first - this will save to Supabase
      try {
        console.log("Attempting API register to Supabase...");
        console.log("Register data:", data);
        const registerData = await authAPI.register(data);
        
        console.log("API register response:", registerData);
        console.log("User created with ID:", registerData.user?.id);
        setState((prevState) => ({ ...prevState, loading: false, error: null }));
        navigate("/sign-up/success");
        return; // Success
      } catch (apiError) {
        console.log("API register failed:", apiError.message);
        console.log("API error details:", apiError);
        
        // If API fails, return the error instead of using fallback
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: apiError.message,
        }));
        return { error: apiError.message };
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || "Registration failed",
      }));
      return { error: error.message || "Registration failed" };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setState({ user: null, error: null, loading: false });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Hook for consuming AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };