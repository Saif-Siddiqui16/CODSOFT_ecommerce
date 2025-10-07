import { useAppDispatch, useAppSelector } from "@/data/hook";
import { checkAuth } from "@/store/auth-slice";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, isAuthenticated]);

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
