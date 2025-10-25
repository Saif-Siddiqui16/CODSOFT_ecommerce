import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/data/hook";
import { createCoupon, deleteCoupon, fetchCoupons, } from "@/store/shop/discount-slice";
const CouponPage = () => {
    const dispatch = useAppDispatch();
    const { coupons, isLoading, error } = useAppSelector((state) => state.coupon);
    const [form, setForm] = useState({
        code: "",
        discountPercent: "",
        expiresAt: "",
    });
    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleAddCoupon = async (e) => {
        e.preventDefault();
        if (!form.code || !form.discountPercent || !form.expiresAt)
            return;
        await dispatch(createCoupon({
            code: form.code.trim(),
            discountPercent: Number(form.discountPercent),
            expiresAt: form.expiresAt,
        }));
        setForm({ code: "", discountPercent: "", expiresAt: "" });
    };
    const handleDelete = async (id) => {
        await dispatch(deleteCoupon(id));
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Coupon Management" }), _jsxs("form", { onSubmit: handleAddCoupon, className: "bg-white p-4 shadow rounded space-y-4 mb-10", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-medium", children: "Code" }), _jsx("input", { type: "text", name: "code", value: form.code, onChange: handleChange, className: "w-full border rounded p-2 mt-1", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium", children: "Discount (%)" }), _jsx("input", { type: "number", name: "discountPercent", value: form.discountPercent, onChange: handleChange, className: "w-full border rounded p-2 mt-1", required: true, min: 1, max: 100 })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-medium", children: "Expiry Date" }), _jsx("input", { type: "date", name: "expiresAt", value: form.expiresAt, onChange: handleChange, className: "w-full border rounded p-2 mt-1", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60", children: isLoading ? "Adding..." : "Add Coupon" })] }), _jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Existing Coupons" }), isLoading ? (_jsx("p", { children: "Loading coupons..." })) : coupons.length === 0 ? (_jsx("p", { children: "No coupons available." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full bg-white shadow rounded", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3", children: "Code" }), _jsx("th", { className: "text-left p-3", children: "Discount" }), _jsx("th", { className: "text-left p-3", children: "Expiry" }), _jsx("th", { className: "text-left p-3", children: "Actions" })] }) }), _jsx("tbody", { children: coupons.map((coupon) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-3", children: coupon.code }), _jsxs("td", { className: "p-3", children: [coupon.discountPercent, "%"] }), _jsx("td", { className: "p-3", children: coupon.expiresAt
                                            ? new Date(coupon.expiresAt).toLocaleDateString()
                                            : "N/A" }), _jsx("td", { className: "p-3", children: _jsx("button", { onClick: () => handleDelete(coupon._id), className: "text-red-600 hover:underline", children: "Delete" }) })] }, coupon._id))) })] }) })), error && _jsx("p", { className: "text-red-600 mt-4", children: error })] }));
};
export default CouponPage;
