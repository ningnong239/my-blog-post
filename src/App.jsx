import { Route, Routes } from "react-router-dom";
import { useAuth, AuthProvider } from "@/contexts/authentication";
import jwtInterceptor from "./utils/jwtIntercepter.js";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import { Toaster } from "@/components/ui/sonner";

// Main Pages
import HomePage from "./page/HomePage";
import ViewPostPage from "./page/ViewPostPage";
import NotFoundPage from "./page/NotFoundPage";
import SignUpPage from "./page/SignUpPage";
import LoginPage from "./page/LoginPage";
import SignUpSuccessPage from "./page/SignUpSuccessPage";
import ProfilePage from "./page/ProfilePage";
import ResetPasswordPage from "./page/ResetPasswordPage";

// Admin Pages
import AdminProfilePage from "./page/admin/AdminProfilePage";
import AdminArticlePage from "./page/admin/AdminArticlePage";
import AdminCategoryPage from "./page/admin/AdminCategoryPage";
import AdminCreateArticle from "./page/admin/AdminCreateArticle";
import AdminCreateCategoryPage from "./page/admin/AdminCreateCategoryPage";
import AdminEditArticlePage from "./page/admin/AdminEditArticlePage";
import AdminEditCategoryPage from "./page/admin/AdminEditCategoryPage";
import AdminLoginPage from "./page/admin/AdminLoginPage";
import AdminNotificationPage from "./page/admin/AdminNotificationPage";
import AdminResetPasswordPage from "./page/admin/AdminResetPasswordPage";
import "./utils/debugSignup"; // Import signup debug utilities

jwtInterceptor();

function AppContent() {
  const { isAuthenticated, state } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="/admin" element={<AdminProfilePage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/article-management" element={<AdminArticlePage />} />
        <Route path="/admin/category-management" element={<AdminCategoryPage />} />
        <Route path="/admin/create-article" element={<AdminCreateArticle />} />
        <Route path="/admin/create-category" element={<AdminCreateCategoryPage />} />
        <Route path="/admin/edit-article/:id" element={<AdminEditArticlePage />} />
        <Route path="/admin/edit-category/:id" element={<AdminEditCategoryPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-success" element={<SignUpSuccessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;