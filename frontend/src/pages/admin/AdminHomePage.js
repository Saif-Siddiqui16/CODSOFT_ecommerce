import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/common/admin/AdminHeader";
import ProductTable from "@/components/common/admin/ProductTable";
import OrderTable from "@/components/common/admin/OrderTable";
import Pagination from "@/components/common/Pagination";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { fetchProducts, deleteProduct } from "@/store/shop/product-slice";
import { fetchAllOrders, updateOrderStatus, deleteOrder, } from "@/store/shop/order-slice";
const ITEMS_PER_PAGE = 5;
const AdminHomePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { productList } = useAppSelector((state) => state.product);
    const { orders } = useAppSelector((state) => state.orders);
    const [productPage, setProductPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);
    const totalProductPages = Math.ceil((productList?.length ?? 0) / ITEMS_PER_PAGE);
    const totalOrderPages = Math.ceil((orders?.length ?? 0) / ITEMS_PER_PAGE);
    const paginatedProducts = productList?.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE) ?? [];
    const paginatedOrders = orders?.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE) ?? [];
    const handleAddProduct = () => navigate("/admin/products/add");
    const handleEditProduct = (id) => navigate(`/admin/products/edit/${id}`);
    const handleDeleteProduct = (id) => {
        dispatch(deleteProduct(id)).then(() => {
            dispatch(fetchProducts());
        });
    };
    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ orderId, status })).then(() => {
            dispatch(fetchAllOrders());
        });
    };
    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrder(orderId)).then(() => {
            dispatch(fetchAllOrders());
        });
    };
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsx(AdminHeader, { onAddProduct: handleAddProduct }), _jsxs("section", { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Products" }), _jsx(ProductTable, { products: paginatedProducts, onEdit: handleEditProduct, onDelete: handleDeleteProduct }), _jsx(Pagination, { currentPage: productPage, totalPages: totalProductPages, onPageChange: setProductPage })] }), _jsxs("section", { className: "mt-12", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Orders" }), _jsx(OrderTable, { orders: paginatedOrders, onStatusChange: handleStatusChange, onDeleteOrder: handleDeleteOrder }), _jsx(Pagination, { currentPage: orderPage, totalPages: totalOrderPages, onPageChange: setOrderPage })] })] }));
};
export default AdminHomePage;
