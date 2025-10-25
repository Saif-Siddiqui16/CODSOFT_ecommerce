import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchUserOrders } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
const Orders = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userOrders: orders, isLoading, error, } = useAppSelector((state) => state.orders);
    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);
    const handleOrderClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "My Orders" }), isLoading && _jsx("p", { children: "Loading orders..." }), error && _jsxs("p", { className: "text-red-600", children: ["Error: ", error] }), !isLoading && orders.length === 0 && _jsx("p", { children: "No orders yet" }), !isLoading && orders.length > 0 && (_jsx("div", { className: "space-y-4", children: orders.map((order) => (_jsxs("div", { className: "border p-4 rounded bg-white cursor-pointer hover:bg-gray-400", onClick: () => handleOrderClick(order._id), children: [_jsxs("h2", { className: "font-semibold", children: ["Order #", order._id] }), _jsxs("p", { children: ["Status: ", order.orderStatus] }), _jsxs("p", { children: ["Total: $", order.totalAmount] })] }, order._id))) }))] }));
};
export default Orders;
