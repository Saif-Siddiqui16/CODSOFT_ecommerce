import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/auth-slice";
const Header = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleAdminPage = () => navigate("/admin");
    const handleLogout = () => dispatch(logoutUser());
    return (_jsxs("header", { className: "h-[100px] w-full bg-amber-300 flex items-center px-4 md:px-10 shadow-md", children: [_jsxs("div", { className: "hidden md:flex w-full items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold tracking-wide", children: "Ecommerce App" }), user && (_jsxs("nav", { className: "flex gap-6 font-medium text-gray-800", children: [_jsx(Link, { to: "/", className: "hover:underline", children: "Home" }), _jsx(Link, { to: "/profile", className: "hover:underline", children: "Profile" }), user.role === "user" && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/cart", className: "hover:underline", children: "Cart" }), _jsx(Link, { to: "/orders", className: "hover:underline", children: "Orders" })] })), isAuthenticated && _jsx(Button, { onClick: handleLogout, children: "Logout" }), user?.role === "admin" && (_jsx(Button, { onClick: handleAdminPage, children: "Admin Home" }))] }))] }), _jsxs("div", { className: "md:hidden flex items-center justify-between w-full", children: [_jsx("h1", { className: "text-xl font-bold", children: "Ecommerce App" }), _jsxs(Sheet, { children: [_jsx(SheetTrigger, { className: "text-black font-semibold border px-3 py-1 rounded-md", children: "Menu" }), _jsx(SheetContent, { side: "right", children: _jsxs(SheetHeader, { children: [_jsx(SheetTitle, { className: "text-xl", children: "Navigation" }), _jsxs("div", { className: "flex flex-col items-start mt-4 gap-4", children: [user && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/", className: "hover:underline", children: "Home" }), _jsx(Link, { to: "/profile", className: "hover:underline", children: "Profile" }), user.role === "user" && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/cart", className: "hover:underline", children: "Cart" }), _jsx(Link, { to: "/orders", className: "hover:underline", children: "Orders" })] }))] })), isAuthenticated && (_jsx(Button, { onClick: handleLogout, className: "w-full", children: "Logout" })), user?.role === "admin" && (_jsx(_Fragment, { children: _jsx(Button, { onClick: handleAdminPage, className: "w-full", children: "Admin Home" }) }))] })] }) })] })] })] }));
};
export default Header;
