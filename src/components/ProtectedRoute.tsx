
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You must be logged in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  // If specific role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    toast({
      title: "Access denied",
      description: `Only ${requiredRole} users can access this page`,
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
