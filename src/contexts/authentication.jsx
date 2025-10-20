/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/supabaseService";
import { debugComponent, debugError } from "../utils/debug";

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
    debugComponent("AuthProvider", "Fetching user from Supabase");
    
    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      
      const result = await authService.getCurrentUser();
      
      if (result.error) {
        throw result.error;
      }
      
      if (!result.data) {
        debugComponent("AuthProvider", "No user found");
        setState((prevState) => ({
          ...prevState,
          user: null,
          getUserLoading: false,
        }));
        return;
      }
      
      // Get user profile
      const profileResult = await authService.getUserProfile(result.data.id);
      
      const userData = {
        ...result.data,
        ...profileResult.data
      };
      
      debugComponent("AuthProvider", "User fetched successfully");
      setState((prevState) => ({
        ...prevState,
        user: userData,
        getUserLoading: false,
      }));
      
    } catch (error) {
      debugError(error, "fetchUser");
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
    debugComponent("AuthProvider", "Starting login process");
    
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      const result = await authService.signIn(data.email, data.password);
      
      if (result.error) {
        throw result.error;
      }
      
      debugComponent("AuthProvider", "Login successful, fetching user data");
      
      // Set user data directly from Supabase session
      const userData = {
        ...result.data.user,
        access_token: result.data.session?.access_token
      };
      
      setState((prevState) => ({
        ...prevState,
        user: userData,
        loading: false,
        error: null,
      }));
      
      debugComponent("AuthProvider", "Navigating to home page");
      navigate("/");
      
      return; // Success
      
    } catch (error) {
      debugError(error, "login");
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
    debugComponent("AuthProvider", "Starting registration process");
    
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      const result = await authService.signUp(data.email, data.password, data.name);
      
      if (result.error) {
        throw result.error;
      }
      
      debugComponent("AuthProvider", "Registration successful");
      console.log("✅ Registration completed:", result.data);
      
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
      return; // Success
      
    } catch (error) {
      debugError(error, "register");
      console.error("❌ Registration failed:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || "Registration failed",
      }));
      return { error: error.message || "Registration failed" };
    }
  };

  // Logout user
  const logout = async () => {
    debugComponent("AuthProvider", "Starting logout process");
    
    try {
      await authService.signOut();
    } catch (error) {
      debugError(error, "logout");
    }
    
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