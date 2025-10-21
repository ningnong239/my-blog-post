/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../LoadingScreen";

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}) {
  if (isLoading === null || isLoading) {
    // Loading state or no data yet
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== requiredRole) {
    // Return null while navigate performs the redirection
    // Redirect to admin login for admin routes, regular login for user routes
    const redirectPath = requiredRole === 'admin' ? '/admin/login' : '/login';
    console.log("🚫 [ProtectedRoute] Access denied. Redirecting to:", redirectPath);
    console.log("🚫 [ProtectedRoute] isAuthenticated:", isAuthenticated);
    console.log("🚫 [ProtectedRoute] userRole:", userRole);
    console.log("🚫 [ProtectedRoute] requiredRole:", requiredRole);
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role
  return children;
}

export default ProtectedRoute;
