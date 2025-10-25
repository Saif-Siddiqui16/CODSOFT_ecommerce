import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CartItem from "@/components/common/CartItem";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchCartItems, deleteCartItem, updateCartQuantity, } from "@/store/shop/cart-slice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Cart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { cartItems = [], isLoading } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);
    const handleRemove = async (itemId) => {
        try {
            await dispatch(deleteCartItem({ itemId })).unwrap();
        }
        catch (error) {
            console.error("Failed to remove item:", error);
        }
    };
    const handleUpdateQuantity = async (itemId, quantity) => {
        if (quantity < 1)
            return;
        try {
            await dispatch(updateCartQuantity({ itemId, quantity })).unwrap();
        }
        catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };
    const handleCheckout = async () => {
        navigate("/checkout");
    };
    if (isLoading) {
        return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Your Cart" }), _jsx("p", { children: "Loading cart items..." })] }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Your Cart" }), cartItems.length === 0 ? (_jsx("p", { children: "Your cart is empty" })) : (_jsx("div", { className: "space-y-4", children: cartItems.map((item) => (_jsx(CartItem, { item: item, onRemove: handleRemove, onUpdateQuantity: handleUpdateQuantity }, item._id))) })), _jsx("div", { className: "flex items-center justify-center", children: user?.role === "user" && (_jsx(Button, { className: "cursor-pointer", onClick: handleCheckout, children: "CheckOut" })) })] }));
};
export default Cart;
