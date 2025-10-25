import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const CheckoutCancel = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen text-center space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-red-500", children: "Payment Canceled \u274C" }), _jsx("p", { children: "Your payment was canceled. You can try again anytime." }), _jsx("button", { onClick: () => navigate("/cart"), className: "bg-gray-600 text-white px-6 py-2 rounded", children: "Return to Cart" })] }));
};
export default CheckoutCancel;
