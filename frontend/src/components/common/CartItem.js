import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const [localQty, setLocalQty] = useState(item.quantity);
    useEffect(() => {
        setLocalQty(item.quantity);
    }, [item.quantity]);
    const handleIncrement = useCallback(() => {
        const newQty = localQty + 1;
        setLocalQty(newQty);
        onUpdateQuantity(item._id, newQty);
    }, [localQty, item._id, onUpdateQuantity]);
    const handleDecrement = useCallback(() => {
        if (localQty <= 1)
            return;
        const newQty = localQty - 1;
        setLocalQty(newQty);
        onUpdateQuantity(item._id, newQty);
    }, [localQty, item._id, onUpdateQuantity]);
    const handleInputChange = useCallback((e) => {
        const val = Math.max(1, +e.target.value);
        setLocalQty(val);
        onUpdateQuantity(item._id, val);
    }, [item._id, onUpdateQuantity]);
    return (_jsxs("div", { className: "flex items-center justify-between border-b py-4 hover:bg-gray-50 transition duration-150", children: [_jsx("img", { src: item.productId.image, alt: item.productId.name, className: "w-20 h-20 object-cover rounded" }), _jsxs("div", { className: "flex-1 ml-4", children: [_jsx("h3", { className: "font-semibold", children: item.productId.name }), _jsxs("p", { className: "text-gray-600", children: ["$", item.productId.price] }), _jsxs("div", { className: "flex items-center mt-2 gap-2", children: [_jsx("button", { onClick: handleDecrement, className: "px-2 py-1 border rounded hover:bg-gray-200", disabled: localQty <= 1, children: "-" }), _jsx("input", { type: "number", min: 1, value: localQty, onChange: handleInputChange, className: "w-16 border rounded px-2 py-1 text-center" }), _jsx("button", { onClick: handleIncrement, className: "px-2 py-1 border rounded hover:bg-gray-200", children: "+" })] })] }), _jsx(Button, { variant: "destructive", onClick: () => onRemove(item._id), className: "ml-4", children: "Remove" })] }));
};
export default CartItem;
