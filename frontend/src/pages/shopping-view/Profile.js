import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { addNewAddress, deleteAddress, fetchAllAddresses, } from "@/store/shop/address-slice";
import { fetchAllOrders } from "@/store/shop/order-slice";
import Pagination from "@/components/common/Pagination";
import { useNavigate } from "react-router-dom";
const ITEMS_PER_PAGE = 5;
const Profile = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderPage, setOrderPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        pincode: "",
        phone: "",
    });
    const fetchAddress = useCallback(async () => {
        const data = await dispatch(fetchAllAddresses());
        if (data.payload && Array.isArray(data.payload)) {
            setAddresses(data.payload);
        }
    }, [dispatch]);
    const fetchOrders = useCallback(async () => {
        const result = await dispatch(fetchAllOrders());
        if (result.payload && Array.isArray(result.payload)) {
            setOrders(result.payload);
        }
        else {
            console.warn("Invalid orders payload:", result.payload);
            setOrders([]);
        }
    }, [dispatch]);
    useEffect(() => {
        fetchAddress();
        fetchOrders();
    }, [fetchAddress, fetchOrders]);
    const handleDeleteAddress = async (id) => {
        await dispatch(deleteAddress(id));
        fetchAddress();
    };
    const handleEditAddress = (id) => {
        navigate(`/address/${id}`);
    };
    const handleCreateAddress = async () => {
        await dispatch(addNewAddress(newAddress));
        setNewAddress({ address: "", city: "", pincode: "", phone: "" });
        setIsDialogOpen(false);
        fetchAddress();
    };
    const totalOrderPages = Math.ceil((orders?.length || 0) / ITEMS_PER_PAGE);
    const paginatedOrders = Array.isArray(orders)
        ? orders.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE)
        : [];
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-8", children: [_jsxs("section", { className: "bg-white p-6 rounded shadow", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Profile" }), _jsxs("p", { children: [_jsx("strong", { children: "Username:" }), " ", user?.userName] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", user?.email] })] }), _jsxs("section", { className: "bg-white p-6 rounded shadow", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Addresses" }), _jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "Add Address" }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Add New Address" }) }), _jsxs("div", { className: "space-y-3 mt-4", children: [_jsx(Label, { children: "Address" }), _jsx("input", { className: "border px-3 py-2 w-full rounded", placeholder: "Address", value: newAddress.address, onChange: (e) => setNewAddress((prev) => ({
                                                            ...prev,
                                                            address: e.target.value,
                                                        })) }), _jsx(Label, { children: "City" }), _jsx("input", { className: "border px-3 py-2 w-full rounded", placeholder: "City", value: newAddress.city, onChange: (e) => setNewAddress((prev) => ({ ...prev, city: e.target.value })) }), _jsx(Label, { children: "Pincode" }), _jsx("input", { className: "border px-3 py-2 w-full rounded", placeholder: "Pincode", value: newAddress.pincode, onChange: (e) => setNewAddress((prev) => ({
                                                            ...prev,
                                                            pincode: e.target.value,
                                                        })) }), _jsx(Label, { children: "Phone" }), _jsx("input", { className: "border px-3 py-2 w-full rounded", placeholder: "Phone", value: newAddress.phone, onChange: (e) => setNewAddress((prev) => ({
                                                            ...prev,
                                                            phone: e.target.value,
                                                        })) }), _jsx(Button, { className: "mt-2 w-full", onClick: handleCreateAddress, children: "Save Address" })] })] })] })] }), _jsx("div", { className: "space-y-3", children: Array.isArray(addresses) && addresses.length > 0 ? (addresses.map((addr) => (_jsxs("div", { className: "border p-3 rounded flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("p", { children: [addr.address, ", ", addr.city, ", ", addr.pincode] }), _jsxs("p", { children: ["Phone: ", addr.phone] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => handleEditAddress(addr._id), children: "Edit" }), _jsx(Button, { variant: "destructive", onClick: () => handleDeleteAddress(addr._id), children: "Delete" })] })] }, addr._id)))) : (_jsx("p", { children: "No addresses found." })) })] }), _jsxs("section", { className: "bg-white p-6 rounded shadow", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Orders" }), _jsxs("div", { className: "space-y-3", children: [Array.isArray(paginatedOrders) && paginatedOrders.length === 0 && (_jsx("p", { children: "No orders found." })), Array.isArray(paginatedOrders) &&
                                paginatedOrders.map((order) => (_jsxs("div", { className: "border p-3 rounded flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("p", { children: ["Order ID: ", order._id] }), _jsxs("p", { children: ["Total Amount: $", order.totalAmount] }), _jsxs("p", { children: ["Status: ", order.orderStatus] }), _jsxs("p", { children: ["Date:", " ", order.orderDate
                                                            ? new Date(order.orderDate).toLocaleDateString()
                                                            : "N/A"] })] }), _jsx(Button, { variant: "outline", onClick: () => navigate(`/order/${order._id}`), children: "View Details" })] }, order._id)))] }), totalOrderPages > 1 && (_jsx(Pagination, { currentPage: orderPage, totalPages: totalOrderPages, onPageChange: setOrderPage }))] })] }));
};
export default Profile;
