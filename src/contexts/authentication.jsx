/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../config/api";
import { supabase } from "../lib/supabase";

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
    
    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      
      console.log("🔄 [fetchUser] Getting current session from Supabase...");
      
      // Get current session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ [fetchUser] Session error:", sessionError);
        throw new Error(sessionError.message);
      }
      
      if (!session || !session.user) {
        console.log("❌ [fetchUser] No active session found");
        setState((prevState) => ({
          ...prevState,
          user: null,
          getUserLoading: false,
        }));
        return;
      }
      
      console.log("✅ [fetchUser] Session found:", session);
      console.log("👤 [fetchUser] User from session:", session.user);
      
      // Transform Supabase user data to match expected format
      const userData = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        profilePic: session.user.user_metadata?.avatar_url || null,
        role: session.user.user_metadata?.role || (session.user.email === 'devvv@msil.com' ? 'admin' : 'user'), // Check if admin email
        email_verified: session.user.email_confirmed_at ? true : false,
        created_at: session.user.created_at,
        updated_at: session.user.updated_at
      };
      
      console.log("✅ [fetchUser] Transformed user data:", userData);
      console.log("🔑 [fetchUser] User role:", userData.role);
      console.log("🔑 [fetchUser] User email:", userData.email);
      console.log("🔑 [fetchUser] Is admin:", userData.role === 'admin');
      
      setState((prevState) => ({
        ...prevState,
        user: userData,
        getUserLoading: false,
      }));
      console.log("🎉 [fetchUser] === FETCH USER SUCCESS ===");
      return;
      
    } catch (error) {
      console.log("💥 [fetchUser] === FETCH USER ERROR ===");
      console.log("💥 [fetchUser] Fetch user error:", error);
      console.log("📝 [fetchUser] Error message:", error.message);
      console.log("🔍 [fetchUser] Error details:", error);
      console.log("📚 [fetchUser] Error stack:", error.stack);
      
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
    console.log("🚀 [login] Email:", data.email);
    console.log("🚀 [login] Password:", data.password);
    console.log("=== LOGIN START ===");
    console.log("Login attempt with:", data);
    
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      console.log("🔄 [login] Attempting direct Supabase login...");
      console.log("📤 [login] Login data:", data);
      
      // Use Supabase auth directly
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (loginError) {
        console.error("❌ [login] Supabase login error:", loginError);
        throw new Error(loginError.message);
      }
      
      console.log("✅ [login] Supabase login response:", loginData);
      
      if (loginData.session) {
        const token = loginData.session.access_token;
        localStorage.setItem("token", token);
        console.log("💾 [login] Token saved to localStorage:", token);
        console.log("🔍 [login] Token type:", typeof token);
        console.log("🔍 [login] Token length:", token?.length);
        console.log("🔍 [login] Token preview:", token?.substring(0, 50) + "...");
        
        setState((prevState) => ({ ...prevState, loading: false, error: null }));
        console.log("🏠 [login] Navigating to home page...");
        navigate("/");
        
        console.log("👤 [login] Fetching user data...");
        await fetchUser();
        
        console.log("🎉 [login] === LOGIN SUCCESS ===");
        return; // Success
      } else {
        throw new Error("No session returned from login");
      }
      
    } catch (error) {
      console.log("❌ [login] === LOGIN ERROR ===");
      console.log("💥 [login] Login error:", error);
      console.log("📝 [login] Error message:", error.message);
      console.log("🔍 [login] Error details:", error);
      console.log("📚 [login] Error stack:", error.stack);
      
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
      
      console.log("🔄 [register] Attempting direct Supabase registration...");
      console.log("📤 [register] Register data:", data);
      
      // Use Supabase auth directly
      const { data: registerData, error: registerError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            role: 'user' // Default role for new users
          }
        }
      });
      
      if (registerError) {
        console.error("❌ [register] Supabase registration error:", registerError);
        throw new Error(registerError.message);
      }
      
      console.log("✅ [register] Supabase registration response:", registerData);
      console.log("User created with ID:", registerData.user?.id);
      
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
      return; // Success
      
    } catch (error) {
      console.log("❌ [register] === REGISTER ERROR ===");
      console.log("💥 [register] Register error:", error);
      console.log("📝 [register] Error message:", error.message);
      
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
    try {
      console.log("🚪 [logout] Signing out from Supabase...");
      await supabase.auth.signOut();
      console.log("✅ [logout] Successfully signed out from Supabase");
    } catch (error) {
      console.error("❌ [logout] Supabase signout error:", error);
    }
    
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