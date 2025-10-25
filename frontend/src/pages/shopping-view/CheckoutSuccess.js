import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { API_BASE_URL } from "@/store/auth-slice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const CheckoutSuccess = () => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const sessionId = new URLSearchParams(location.search).get("session_id");
    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/user/payment/verify-session/${sessionId}`, { withCredentials: true });
                setPaymentInfo(res.data);
            }
            catch (err) {
                console.error("Failed to verify payment:", err);
            }
            finally {
                setLoading(false);
            }
        };
        if (sessionId)
            verifyPayment();
    }, [sessionId]);
    if (loading)
        return _jsx("p", { className: "text-center mt-10", children: "Verifying payment..." });
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen text-center space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold text-green-600", children: "Payment Successful \uD83C\uDF89" }), paymentInfo ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: ["Thank you! You paid", " ", _jsxs("strong", { children: ["$", (paymentInfo.amount_total / 100).toFixed(2)] }), "."] }), _jsxs("p", { children: ["Receipt sent to: ", paymentInfo.customer_email] }), _jsx("button", { onClick: () => navigate("/orders"), className: "bg-amber-500 text-white px-6 py-2 rounded", children: "View My Orders" })] })) : (_jsx("p", { children: "Could not load payment details." }))] }));
};
export default CheckoutSuccess;
