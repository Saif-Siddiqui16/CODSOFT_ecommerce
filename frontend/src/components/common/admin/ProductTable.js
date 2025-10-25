import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/data/hook";
import { deleteProduct, fetchProducts } from "@/store/shop/product-slice";
const ProductTable = ({ products, onEdit }) => {
    const dispatch = useAppDispatch();
    if (products.length === 0)
        return _jsx("p", { children: "No products found." });
    const handleDelete = async (id) => {
        await dispatch(deleteProduct(id));
        dispatch(fetchProducts());
    };
    return (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Category" }), _jsx(TableHead, { children: "Price" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: products.map((product) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: product.name }), _jsx(TableCell, { children: product.category }), _jsxs(TableCell, { children: ["$", product.price] }), _jsxs(TableCell, { className: "flex gap-2", children: [_jsx(Button, { onClick: () => onEdit(product._id), children: "Edit" }), _jsx(Button, { variant: "destructive", onClick: () => handleDelete(product._id), children: "Delete" })] })] }, product._id))) })] }));
};
export default ProductTable;
