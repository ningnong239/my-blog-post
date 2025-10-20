import { Route, Routes } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
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

function App() {
  const { isAuthenticated, state } = useAuth();

  return (
    <div className="App">



      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="/admin" element={<AdminProfilePage />} />
        <Route path="/admin/articles" element={<AdminArticlePage />} />
        <Route path="/admin/categories" element={<AdminCategoryPage />} />
        <Route path="/admin/create-article" element={<AdminCreateArticle />} />
        <Route path="/admin/create-category" element={<AdminCreateCategoryPage />} />
        <Route path="/admin/edit-article/:id" element={<AdminEditArticlePage />} />
        <Route path="/admin/edit-category/:id" element={<AdminEditCategoryPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Authentication Section */}
        <Route
          path="/sign-up"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <SignUpPage />
            </AuthenticationRoute>
          }
        />
        <Route
          path="/sign-up/success"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <SignUpSuccessPage />
            </AuthenticationRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <LoginPage />
            </AuthenticationRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* User Section */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Section */}
        <Route
          path="/admin/article-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/edit/:postId"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditArticlePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/edit/:categoryId"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Optional Requirement */}
        {/* <Route
          path="/admin/notification"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminNotificationPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/admin/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminResetPasswordPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        toastOptions={{
          unstyled: true,
        }}
      />
    </div>
  );
}

export default App;
