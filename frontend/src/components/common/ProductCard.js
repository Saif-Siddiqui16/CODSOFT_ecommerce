import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/data/hook";
const ProductCard = React.memo(({ product, onAddToCart }) => {
    const [added, setAdded] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const handleAdd = useCallback(() => {
        onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    }, [onAddToCart, product]);
    return (_jsxs("div", { className: "border rounded-lg shadow hover:shadow-lg overflow-hidden bg-white", children: [_jsx("img", { src: product.image, alt: product.name, className: "w-full h-48 object-cover" }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-lg", children: product.name }), _jsx("p", { className: "text-gray-600 text-sm", children: product.category }), _jsxs("p", { className: "text-amber-600 font-bold mt-2", children: ["$", product.price] }), user?.role === "user" && (_jsx(Button, { className: `mt-4 w-full ${added
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-amber-500 hover:bg-amber-600"}`, onClick: handleAdd, disabled: added, children: added ? "Added!" : "Add to Cart" }))] })] }));
});
export default ProductCard;
