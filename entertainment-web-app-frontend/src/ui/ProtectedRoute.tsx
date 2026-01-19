import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentAuthSate } from "../services/api/authSlice";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useSelector(selectCurrentAuthSate);
  const location = useLocation();

  if (isAuthenticated) return children;
  else return <Navigate to="/login" state={{ from: location }} replace />;
}

export default ProtectedRoute;
