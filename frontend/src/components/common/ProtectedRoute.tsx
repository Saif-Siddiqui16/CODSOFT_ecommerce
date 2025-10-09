import { useAppDispatch, useAppSelector } from "@/data/hook";
import { checkAuth, logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (err) {
        // If token missing or invalid, log out immediately
        dispatch(logoutUser());
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, [dispatch, location.pathname]); // run on every route change

  if (!authChecked || isLoading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
