import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { checkAuth, logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await dispatch(checkAuth()).unwrap();
            }
            catch (err) {
                dispatch(logoutUser());
            }
            finally {
                setAuthChecked(true);
            }
        };
        verifyAuth();
    }, [dispatch, location.pathname]);
    if (!authChecked || isLoading) {
        return _jsx("div", { className: "text-center mt-10", children: "Checking authentication..." });
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
