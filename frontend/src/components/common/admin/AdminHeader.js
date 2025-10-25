import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ onAddProduct }) => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Admin Dashboard" }), _jsx(Button, { onClick: () => navigate("/coupons"), className: "bg-amber-500 hover:bg-amber-600", children: "Add/Delete Coupons" }), _jsx(Button, { onClick: onAddProduct, className: "bg-amber-500 hover:bg-amber-600", children: "Add Product" })] }));
};
export default AdminHeader;
