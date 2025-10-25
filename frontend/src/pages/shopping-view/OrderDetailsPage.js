import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchOrderById } from "@/store/shop/order-slice";
import { Button } from "@/components/ui/button";
import { fetchPaymentStatus } from "@/store/shop/payment-slice";
const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const dispatch = useAppDispatch();
    const { orderDetails, isLoading } = useAppSelector((state) => state.orders);
    const { status } = useAppSelector((state) => state.payment);
    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
            dispatch(fetchPaymentStatus(orderId));
        }
    }, [dispatch, orderId]);
    if (isLoading || !orderDetails) {
        return _jsx("div", { className: "text-center mt-10", children: "Loading order..." });
    }
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Order Details" }), _jsxs("section", { className: "bg-white p-6 rounded shadow space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Order ID:" }), " ", orderDetails._id] }), _jsxs("p", { children: [_jsx("strong", { children: "Order Status:" }), " ", orderDetails.orderStatus] }), _jsxs("p", { children: [_jsx("strong", { children: "Payment Status:" }), " ", status] }), _jsxs("p", { children: [_jsx("strong", { children: "Total Amount:" }), " $", orderDetails.totalAmount] }), _jsxs("p", { children: [_jsx("strong", { children: "Order Date:" }), " ", new Date(orderDetails.orderDate).toLocaleString()] })] }), _jsxs("section", { className: "bg-white p-6 rounded shadow", children: [_jsx("h2", { className: "text-xl font-semibold mb-3", children: "Products" }), _jsx("div", { className: "space-y-2", children: orderDetails.cartItems.map((item) => (_jsxs("div", { className: "border p-3 rounded flex justify-between", children: [_jsxs("div", { children: [_jsx("p", { children: item.title }), _jsxs("p", { children: ["Quantity: ", item.quantity] })] }), _jsxs("p", { children: ["$", item.price] })] }, typeof item.productId === "string"
                            ? item.productId
                            : item.productId._id))) })] }), _jsx(Button, { onClick: () => window.history.back(), children: "Back" })] }));
};
export default OrderDetailsPage;
